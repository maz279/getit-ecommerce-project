
export class HealthMonitor {
  calculateOverallHealth(performance: any, alerts: any[], services: any): 'excellent' | 'good' | 'warning' | 'critical' {
    const criticalAlerts = alerts.filter(a => a.severity === 'high').length;
    const downServices = Object.values(services).filter(s => s === 'down').length;
    const avgResponseTime = performance.averageResponseTime || 0;

    if (criticalAlerts > 0 || downServices > 1) return 'critical';
    if (alerts.length > 5 || downServices > 0 || avgResponseTime > 2000) return 'warning';
    if (avgResponseTime > 1000 || alerts.length > 2) return 'good';
    return 'excellent';
  }

  generateHealthRecommendations(performance: any, alerts: any[]): string[] {
    const recommendations = [];

    if (performance.averageResponseTime > 1000) {
      recommendations.push('Optimize response time - consider caching improvements');
    }

    if (performance.cacheHitRate < 0.8) {
      recommendations.push('Improve cache strategy - current hit rate below optimal');
    }

    if (alerts.length > 3) {
      recommendations.push('Address active alerts to improve system stability');
    }

    if (performance.activeServices < 3) {
      recommendations.push('Ensure all AI services are running properly');
    }

    if (recommendations.length === 0) {
      recommendations.push('System performing optimally - consider advanced optimizations');
    }

    return recommendations;
  }
}

export const healthMonitor = new HealthMonitor();
