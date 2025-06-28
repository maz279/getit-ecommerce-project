
import { supabase } from '@/integrations/supabase/client';

export interface InventoryAlert {
  id?: string;
  product_id?: string;
  vendor_id?: string;
  alert_type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiring';
  current_quantity: number;
  threshold_quantity: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  is_resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
  created_at?: string;
}

export class InventoryService {
  static async getInventoryAlerts(filters?: any): Promise<InventoryAlert[]> {
    try {
      let query = supabase.from('inventory_alerts').select('*');
      
      if (filters?.alert_type) {
        query = query.eq('alert_type', filters.alert_type);
      }
      
      if (filters?.severity) {
        query = query.in('severity', filters.severity);
      }
      
      if (filters?.is_resolved !== undefined) {
        query = query.eq('is_resolved', filters.is_resolved);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Inventory alerts table not accessible, returning mock data');
        return this.getMockInventoryAlerts();
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching inventory alerts:', error);
      return this.getMockInventoryAlerts();
    }
  }

  static async createInventoryAlert(alert: InventoryAlert): Promise<InventoryAlert> {
    try {
      const { data, error } = await supabase
        .from('inventory_alerts')
        .insert([{
          ...alert,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating inventory alert:', error);
      throw error;
    }
  }

  static async updateInventoryAlert(id: string, updates: Partial<InventoryAlert>): Promise<InventoryAlert> {
    try {
      const { data, error } = await supabase
        .from('inventory_alerts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating inventory alert:', error);
      throw error;
    }
  }

  static async resolveInventoryAlert(id: string, resolvedBy: string): Promise<void> {
    try {
      await this.updateInventoryAlert(id, {
        is_resolved: true,
        resolved_by: resolvedBy,
        resolved_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error resolving inventory alert:', error);
      throw error;
    }
  }

  static async getInventoryAnalytics(): Promise<any> {
    try {
      const alerts = await this.getInventoryAlerts();
      
      return {
        totalAlerts: alerts.length,
        criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
        unresolvedAlerts: alerts.filter(a => !a.is_resolved).length,
        lowStockItems: alerts.filter(a => a.alert_type === 'low_stock').length,
        outOfStockItems: alerts.filter(a => a.alert_type === 'out_of_stock').length,
        alertsByType: this.groupAlertsByType(alerts),
        alertsBySeverity: this.groupAlertsBySeverity(alerts)
      };
    } catch (error) {
      console.error('Error fetching inventory analytics:', error);
      return this.getMockInventoryAnalytics();
    }
  }

  private static groupAlertsByType(alerts: InventoryAlert[]): Record<string, number> {
    return alerts.reduce((acc, alert) => {
      acc[alert.alert_type] = (acc[alert.alert_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private static groupAlertsBySeverity(alerts: InventoryAlert[]): Record<string, number> {
    return alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private static getMockInventoryAlerts(): InventoryAlert[] {
    return [
      {
        id: '1',
        product_id: 'product-1',
        vendor_id: 'vendor-1',
        alert_type: 'low_stock',
        current_quantity: 5,
        threshold_quantity: 10,
        severity: 'medium',
        message: 'Product XYZ is running low on stock',
        is_resolved: false,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: '2',
        product_id: 'product-2',
        vendor_id: 'vendor-2',
        alert_type: 'out_of_stock',
        current_quantity: 0,
        threshold_quantity: 5,
        severity: 'critical',
        message: 'Product ABC is completely out of stock',
        is_resolved: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      },
      {
        id: '3',
        product_id: 'product-3',
        vendor_id: 'vendor-1',
        alert_type: 'overstock',
        current_quantity: 150,
        threshold_quantity: 100,
        severity: 'low',
        message: 'Product DEF has excessive inventory',
        is_resolved: true,
        resolved_by: 'admin-1',
        resolved_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
      }
    ];
  }

  private static getMockInventoryAnalytics(): any {
    return {
      totalAlerts: 15,
      criticalAlerts: 3,
      unresolvedAlerts: 8,
      lowStockItems: 6,
      outOfStockItems: 3,
      alertsByType: {
        low_stock: 6,
        out_of_stock: 3,
        overstock: 4,
        expiring: 2
      },
      alertsBySeverity: {
        low: 4,
        medium: 6,
        high: 3,
        critical: 2
      }
    };
  }
}
