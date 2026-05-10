import type { AuditFormData, AuditResult, Recommendation } from './types';

// Pricing data is sourced from PRICING_DATA.md and used in logic below

export function runAudit(data: AuditFormData): AuditResult {
  const recommendations: Recommendation[] = [];
  let totalMonthlySpend = 0;

  data.tools.forEach(toolSpend => {
    totalMonthlySpend += toolSpend.monthlySpend;
    
    let rec: Recommendation | null = null;

    switch (toolSpend.tool) {
      case 'Claude':
        if (toolSpend.plan === 'Team' && toolSpend.seats < 5) {
          const actualCost = toolSpend.monthlySpend;
          const proCost = 20 * toolSpend.seats;
          rec = {
            tool: 'Claude',
            currentSpend: toolSpend.monthlySpend,
            recommendedAction: `Switch to Pro (${toolSpend.seats} seats)`,
            savings: actualCost - proCost,
            reason: 'Claude Team requires minimum 5 seats. You are paying for seats you don\'t use.'
          };
        }
        break;
      
      case 'GitHub Copilot':
        if (toolSpend.plan === 'Enterprise' && data.useCase !== 'coding') {
          rec = {
            tool: 'GitHub Copilot',
            currentSpend: toolSpend.monthlySpend,
            recommendedAction: 'Switch to Business or Individual',
            savings: toolSpend.monthlySpend - (19 * toolSpend.seats),
            reason: 'Enterprise features like custom models are likely overkill for non-coding primary use cases.'
          };
        }
        break;

      case 'Cursor':
        if (toolSpend.plan === 'Business' && toolSpend.seats === 1) {
          rec = {
            tool: 'Cursor',
            currentSpend: toolSpend.monthlySpend,
            recommendedAction: 'Switch to Pro',
            savings: 20,
            reason: 'Cursor Pro offers identical individual features for $20 less than Business.'
          };
        }
        break;
        
      case 'ChatGPT':
        if (toolSpend.plan === 'Pro Max' && data.useCase === 'writing') {
          rec = {
            tool: 'ChatGPT',
            currentSpend: toolSpend.monthlySpend,
            recommendedAction: 'Switch to Claude Pro',
            savings: 180,
            reason: 'Claude Pro ($20) is widely considered superior for long-form writing and nuance compared to high-tier ChatGPT plans.'
          };
        }
        break;
    }

    if (rec && rec.savings > 0) {
      recommendations.push(rec);
    } else {
      recommendations.push({
        tool: toolSpend.tool,
        currentSpend: toolSpend.monthlySpend,
        recommendedAction: 'Keep current plan',
        savings: 0,
        reason: 'Your current plan is well-optimized for your team size and use case.'
      });
    }
  });

  const totalMonthlySavings = recommendations.reduce((acc, r) => acc + r.savings, 0);

  return {
    recommendations,
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12
  };
}
