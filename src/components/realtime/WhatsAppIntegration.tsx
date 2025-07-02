import React, { useState, useEffect } from 'react';
import { MessageSquare, Settings, Send, Users, BarChart3, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppIntegration {
  id: string;
  vendor_id: string;
  business_account_id: string;
  phone_number_id: string;
  status: string;
  integration_config: any;
  message_templates: any[];
}

interface MessageTemplate {
  name: string;
  category: 'TRANSACTIONAL' | 'MARKETING' | 'UTILITY';
  language: string;
  components: Array<{
    type: string;
    format?: string;
    text: string;
  }>;
}

export const WhatsAppIntegration: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [integration, setIntegration] = useState<WhatsAppIntegration | null>(null);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [setupData, setSetupData] = useState({
    businessAccountId: '',
    phoneNumberId: '',
    accessToken: ''
  });
  const [newTemplate, setNewTemplate] = useState<MessageTemplate>({
    name: '',
    category: 'TRANSACTIONAL',
    language: 'bn',
    components: [
      { type: 'HEADER', format: 'TEXT', text: '' },
      { type: 'BODY', text: '' }
    ]
  });

  useEffect(() => {
    fetchIntegration();
  }, []);

  const fetchIntegration = async () => {
    try {
      const { data: vendorData } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (vendorData) {
        const { data, error } = await supabase
          .from('whatsapp_integrations')
          .select('*')
          .eq('vendor_id', vendorData.id)
          .single();

        if (data) {
          setIntegration({
            ...data,
            integration_config: data.integration_config || {},
            message_templates: Array.isArray(data.message_templates) ? data.message_templates : []
          });
        }
      }
    } catch (error) {
      console.error('Error fetching WhatsApp integration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupIntegration = async () => {
    try {
      setLoading(true);

      const { data: vendorData } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!vendorData) {
        throw new Error('Vendor profile not found');
      }

      const { data, error } = await supabase.functions.invoke('whatsapp-integration-service', {
        body: {
          action: 'setup_integration',
          vendorId: vendorData.id,
          businessAccountId: setupData.businessAccountId,
          phoneNumberId: setupData.phoneNumberId,
          accessToken: setupData.accessToken
        }
      });

      if (error) throw error;

      toast({
        title: "Integration Setup Complete",
        description: "WhatsApp Business API has been connected successfully"
      });

      setIsSetupOpen(false);
      await fetchIntegration();
    } catch (error) {
      console.error('Error setting up integration:', error);
      toast({
        title: "Setup Failed",
        description: "Failed to setup WhatsApp integration. Please check your credentials.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      if (!integration) return;

      const { data, error } = await supabase.functions.invoke('whatsapp-integration-service', {
        body: {
          action: 'create_template',
          vendorId: integration.vendor_id,
          templateName: newTemplate.name,
          templateData: newTemplate
        }
      });

      if (error) throw error;

      toast({
        title: "Template Created",
        description: `Template "${newTemplate.name}" has been created successfully`
      });

      setIsTemplateOpen(false);
      setNewTemplate({
        name: '',
        category: 'TRANSACTIONAL',
        language: 'bn',
        components: [
          { type: 'HEADER', format: 'TEXT', text: '' },
          { type: 'BODY', text: '' }
        ]
      });
      await fetchIntegration();
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Template Creation Failed",
        description: "Failed to create message template",
        variant: "destructive"
      });
    }
  };

  const handleSendTestMessage = async () => {
    try {
      if (!integration) return;

      const { data, error } = await supabase.functions.invoke('whatsapp-integration-service', {
        body: {
          action: 'send_message',
          vendorId: integration.vendor_id,
          recipientPhone: integration.integration_config.phone_number,
          messageType: 'text',
          messageContent: {
            text: 'This is a test message from GetIt Bangladesh. Your WhatsApp integration is working correctly!'
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Test Message Sent",
        description: "Test message has been sent successfully"
      });
    } catch (error) {
      console.error('Error sending test message:', error);
      toast({
        title: "Test Failed",
        description: "Failed to send test message",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!integration) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">WhatsApp Business Integration</h2>
          <p className="text-muted-foreground mb-6">
            Connect your WhatsApp Business account to send automated messages to customers
          </p>
          
          <Dialog open={isSetupOpen} onOpenChange={setIsSetupOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Settings className="w-4 h-4" />
                Setup WhatsApp Integration
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Setup WhatsApp Business Integration</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Business Account ID</Label>
                  <Input
                    placeholder="Enter your WhatsApp Business Account ID"
                    value={setupData.businessAccountId}
                    onChange={(e) => setSetupData({...setupData, businessAccountId: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Phone Number ID</Label>
                  <Input
                    placeholder="Enter your Phone Number ID"
                    value={setupData.phoneNumberId}
                    onChange={(e) => setSetupData({...setupData, phoneNumberId: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Access Token</Label>
                  <Input
                    type="password"
                    placeholder="Enter your WhatsApp Business API Access Token"
                    value={setupData.accessToken}
                    onChange={(e) => setSetupData({...setupData, accessToken: e.target.value})}
                  />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">How to get these credentials:</h4>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>Go to Facebook Business Manager</li>
                    <li>Navigate to WhatsApp Business API settings</li>
                    <li>Copy your Business Account ID and Phone Number ID</li>
                    <li>Generate a permanent access token</li>
                  </ol>
                </div>
                
                <Button 
                  onClick={handleSetupIntegration} 
                  disabled={!setupData.businessAccountId || !setupData.phoneNumberId || !setupData.accessToken}
                  className="w-full"
                >
                  Setup Integration
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6" />
              WhatsApp Business Integration
            </div>
            <Badge variant={integration.status === 'active' ? 'default' : 'secondary'}>
              {integration.status === 'active' ? (
                <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
              ) : (
                <><AlertCircle className="w-3 h-3 mr-1" /> {integration.status}</>
              )}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Phone Number</Label>
              <p className="font-medium">{integration.integration_config.phone_number}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Verified Name</Label>
              <p className="font-medium">{integration.integration_config.verified_name}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Quality Rating</Label>
              <p className="font-medium">{integration.integration_config.quality_rating}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSendTestMessage} variant="outline" size="sm">
              Send Test Message
            </Button>
            <Button variant="outline" size="sm">
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
          <TabsTrigger value="messages">Message History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Message Templates</h3>
            
            <Dialog open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
              <DialogTrigger asChild>
                <Button>Create Template</Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create Message Template</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Template Name</Label>
                      <Input
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                        placeholder="e.g., order_confirmation"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select 
                        value={newTemplate.category} 
                        onValueChange={(value: any) => setNewTemplate({...newTemplate, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TRANSACTIONAL">Transactional</SelectItem>
                          <SelectItem value="MARKETING">Marketing</SelectItem>
                          <SelectItem value="UTILITY">Utility</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Header Text</Label>
                    <Input
                      value={newTemplate.components[0]?.text || ''}
                      onChange={(e) => {
                        const updatedComponents = [...newTemplate.components];
                        updatedComponents[0] = {...updatedComponents[0], text: e.target.value};
                        setNewTemplate({...newTemplate, components: updatedComponents});
                      }}
                      placeholder="Header text"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Body Text</Label>
                    <Textarea
                      value={newTemplate.components[1]?.text || ''}
                      onChange={(e) => {
                        const updatedComponents = [...newTemplate.components];
                        updatedComponents[1] = {...updatedComponents[1], text: e.target.value};
                        setNewTemplate({...newTemplate, components: updatedComponents});
                      }}
                      placeholder="Use {{1}}, {{2}} for variables"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleCreateTemplate}
                    disabled={!newTemplate.name || !newTemplate.components[1]?.text}
                    className="w-full"
                  >
                    Create Template
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {integration.message_templates?.map((template, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant="secondary">{template.category}</Badge>
                        <Badge variant="outline">{template.language}</Badge>
                      </div>
                      
                      <div className="space-y-1">
                        {template.components.map((component, i) => (
                          <div key={i}>
                            <Label className="text-xs text-muted-foreground uppercase">
                              {component.type}
                            </Label>
                            <p className="text-sm">{component.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Message History</h3>
              <p className="text-sm text-muted-foreground">
                View and analyze your WhatsApp message history
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Automatic Order Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Send automatic messages for order status updates
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow promotional and marketing messages
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Customer Support</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable WhatsApp for customer support
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};