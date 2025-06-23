
export class EventProcessor {
  private patterns: Map<string, any[]> = new Map();

  async processRealTimeEvent(event: {
    type: string;
    userId?: string;
    data: any;
    timestamp: number;
  }): Promise<{
    insights: any[];
    recommendations: any[];
    alerts: any[];
    patterns: any[];
  }> {
    console.log('Event Processor: Processing event:', event.type);

    this.storeEventForPatternAnalysis(event);

    const insights = await this.analyzeEventInsights(event);
    const recommendations = await this.generateEventRecommendations(event, insights);
    const alerts = await this.checkForAlerts(event, insights);
    const patterns = await this.identifyPatterns(event);

    return {
      insights,
      recommendations,
      alerts,
      patterns
    };
  }

  private storeEventForPatternAnalysis(event: any): void {
    const eventType = event.type;
    if (!this.patterns.has(eventType)) {
      this.patterns.set(eventType, []);
    }
    
    const events = this.patterns.get(eventType)!;
    events.push({
      ...event,
      hour: new Date(event.timestamp).getHours(),
      dayOfWeek: new Date(event.timestamp).getDay()
    });

    if (events.length > 1000) {
      events.shift();
    }
  }

  private async analyzeEventInsights(event: any): Promise<any[]> {
    const insights = [];

    switch (event.type) {
      case 'product_view':
        insights.push({
          type: 'engagement',
          message: `Product ${event.data.productId} viewed`,
          impact: 'positive',
          category: 'user_behavior'
        });
        break;

      case 'purchase':
        insights.push({
          type: 'conversion',
          message: `Sale completed: ${event.data.amount}`,
          impact: 'positive',
          category: 'revenue'
        });
        break;

      case 'cart_abandonment':
        insights.push({
          type: 'opportunity',
          message: 'Cart abandoned - recovery opportunity',
          impact: 'negative',
          category: 'conversion'
        });
        break;

      case 'search':
        insights.push({
          type: 'intent',
          message: `Search interest in: ${event.data.query}`,
          impact: 'neutral',
          category: 'demand'
        });
        break;
    }

    return insights;
  }

  private async generateEventRecommendations(event: any, insights: any[]): Promise<any[]> {
    const recommendations = [];

    if (event.type === 'cart_abandonment') {
      recommendations.push({
        action: 'send_recovery_email',
        priority: 'high',
        timing: 'within 2 hours',
        expectedImpact: '15% recovery rate'
      });
    }

    if (event.type === 'product_view' && event.data.duration > 30000) {
      recommendations.push({
        action: 'show_personalized_offer',
        priority: 'medium',
        timing: 'immediate',
        expectedImpact: '8% conversion increase'
      });
    }

    return recommendations;
  }

  private async checkForAlerts(event: any, insights: any[]): Promise<any[]> {
    const alerts = [];

    if (event.type === 'error' && event.data.frequency > 10) {
      alerts.push({
        type: 'system_alert',
        severity: 'high',
        message: 'High error rate detected',
        action: 'Investigate system issues'
      });
    }

    if (event.type === 'purchase' && event.data.amount > 100000) {
      alerts.push({
        type: 'business_alert',
        severity: 'medium',
        message: 'High-value purchase detected',
        action: 'Verify payment and delivery'
      });
    }

    return alerts;
  }

  private async identifyPatterns(event: any): Promise<any[]> {
    const patterns = [];
    const eventHistory = this.patterns.get(event.type) || [];

    if (eventHistory.length >= 10) {
      const hourlyPattern = this.analyzeHourlyPattern(eventHistory);
      if (hourlyPattern.strength > 0.7) {
        patterns.push({
          type: 'temporal',
          pattern: `Peak ${event.type} activity at ${hourlyPattern.peakHour}:00`,
          strength: hourlyPattern.strength,
          recommendation: `Optimize for ${hourlyPattern.peakHour}:00 traffic`
        });
      }
    }

    return patterns;
  }

  private analyzeHourlyPattern(events: any[]): { peakHour: number; strength: number } {
    const hourCounts: { [hour: number]: number } = {};
    
    events.forEach(event => {
      hourCounts[event.hour] = (hourCounts[event.hour] || 0) + 1;
    });

    const hours = Object.keys(hourCounts).map(Number);
    const counts = Object.values(hourCounts);
    const maxCount = Math.max(...counts);
    const avgCount = counts.reduce((a, b) => a + b, 0) / counts.length;
    
    const peakHour = hours[counts.indexOf(maxCount)];
    const strength = (maxCount - avgCount) / avgCount;

    return { peakHour, strength: Math.min(strength, 1) };
  }

  getPatternSummary(): any {
    const summary: any = {};
    
    this.patterns.forEach((events, eventType) => {
      summary[eventType] = {
        totalEvents: events.length,
        recentEvents: events.filter(e => Date.now() - e.timestamp < 24 * 60 * 60 * 1000).length,
        trend: this.analyzeFrequencyPattern(events).trend
      };
    });

    return summary;
  }

  private analyzeFrequencyPattern(events: any[]): { trend: string; confidence: number } {
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    
    const recentEvents = events.filter(e => now - e.timestamp < 24 * hour);
    const olderEvents = events.filter(e => now - e.timestamp >= 24 * hour && now - e.timestamp < 48 * hour);

    if (olderEvents.length === 0) {
      return { trend: 'stable', confidence: 0.5 };
    }

    const recentRate = recentEvents.length / 24;
    const olderRate = olderEvents.length / 24;
    const change = (recentRate - olderRate) / olderRate;

    if (change > 0.2) {
      return { trend: 'increasing', confidence: Math.min(change, 1) };
    } else if (change < -0.2) {
      return { trend: 'decreasing', confidence: Math.min(Math.abs(change), 1) };
    }

    return { trend: 'stable', confidence: 0.8 };
  }
}

export const eventProcessor = new EventProcessor();
