import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Fingerprint, Eye, Mic, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface BiometricRegistration {
  id: string;
  credential_id: string;
  device_name: string;
  device_type: string;
  last_used_at: string;
  registered_at: string;
  is_active: boolean;
  user_id: string;
  public_key: string;
  authenticator_data: any;
}

export const BiometricAuth: React.FC = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<BiometricRegistration[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
    if (user) {
      loadBiometricRegistrations();
    }
  }, [user]);

  const checkBiometricSupport = () => {
    setIsSupported(
      'navigator' in window && 
      'credentials' in navigator &&
      'create' in navigator.credentials
    );
  };

  const loadBiometricRegistrations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('biometric_auth_registrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error('Failed to load biometric registrations:', error);
    }
  };

  const registerBiometric = async (authType: string) => {
    if (!isSupported || !user) return;

    setIsRegistering(true);
    try {
      // In a real implementation, this would use WebAuthn API
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new TextEncoder().encode('demo-challenge'),
          rp: { name: 'GetIt' },
          user: {
            id: new TextEncoder().encode(user.id),
            name: user.email || 'user',
            displayName: user.email || 'User'
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required'
          }
        }
      });

      if (credential) {
        // Store registration in database
        await supabase
          .from('biometric_auth_registrations')
          .insert({
            user_id: user.id,
            device_type: authType,
            credential_id: credential.id,
            public_key: 'demo-key',
            device_name: navigator.userAgent.split(' ')[0],
            authenticator_data: {}
          });

        await loadBiometricRegistrations();
      }
    } catch (error) {
      console.error('Biometric registration failed:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  const getAuthIcon = (authType: string) => {
    switch (authType) {
      case 'fingerprint': return <Fingerprint className="h-4 w-4" />;
      case 'face': return <Eye className="h-4 w-4" />;
      case 'voice': return <Mic className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  if (!user) {
    return (
      <Alert>
        <AlertDescription>Please log in to manage biometric authentication.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Biometric Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSupported ? (
          <Alert>
            <AlertDescription>
              Biometric authentication is not supported on this device.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="space-y-3">
              <h3 className="font-medium">Registered Methods</h3>
              {registrations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No biometric methods registered yet.
                </p>
              ) : (
                registrations.map((registration) => (
                  <div key={registration.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getAuthIcon(registration.device_type)}
                      <div>
                        <p className="font-medium capitalize">{registration.device_type || 'Biometric'}</p>
                        <p className="text-sm text-muted-foreground">
                          {registration.device_name}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Add New Method</h3>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={() => registerBiometric('fingerprint')}
                  disabled={isRegistering}
                  variant="outline"
                  className="justify-start"
                >
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Fingerprint
                </Button>
                <Button
                  onClick={() => registerBiometric('face')}
                  disabled={isRegistering}
                  variant="outline"
                  className="justify-start"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Face Recognition
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};