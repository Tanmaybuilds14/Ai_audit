import React from 'react';
import type { AuditResult } from '../types';

interface Props {
  result: AuditResult;
  onReset: () => void;
}

export const AuditResults: React.FC<Props> = ({ result, onReset }) => {
  const { recommendations, totalMonthlySavings, totalAnnualSavings, summary } = result;

  return (
    <div className="audit-results">
      <div className="hero-savings">
        <div className="savings-card primary">
          <h3>Monthly Savings</h3>
          <p className="amount">${totalMonthlySavings.toFixed(2)}</p>
        </div>
        <div className="savings-card secondary">
          <h3>Annual Savings</h3>
          <p className="amount">${totalAnnualSavings.toFixed(2)}</p>
        </div>
      </div>

      {summary && (
        <div className="summary-section">
          <h3>AI Analysis</h3>
          <p>{summary}</p>
        </div>
      )}

      <div className="recommendations-list">
        <h3>Per-Tool Breakdown</h3>
        {recommendations.map((rec, i) => (
          <div key={i} className={`rec-item ${rec.savings > 0 ? 'highlight' : 'optimal'}`}>
            <div className="rec-header">
              <span className="tool-name">{rec.tool}</span>
              <span className="spend-info">${rec.currentSpend}/mo</span>
            </div>
            <div className="rec-action">
              <strong>Action:</strong> {rec.recommendedAction}
            </div>
            <div className="rec-reason">
              {rec.reason}
            </div>
            {rec.savings > 0 && (
              <div className="rec-savings">
                Potential Savings: ${rec.savings.toFixed(2)}/mo
              </div>
            )}
          </div>
        ))}
      </div>

      {totalMonthlySavings > 500 && (
        <div className="credex-callout">
          <h2>You're leaving significant money on the table.</h2>
          <p>Our experts at Credex specialize in deep-tier optimizations that go beyond plan switching.</p>
          <button className="consult-btn">Book a Credex Consultation</button>
        </div>
      )}

      {totalMonthlySavings <= 100 && totalMonthlySavings > 0 && (
        <div className="optimization-signup">
          <p>You're spending well, but there's room for improvement.</p>
          <button className="signup-btn">Notify me of new optimizations</button>
        </div>
      )}

      {totalMonthlySavings === 0 && (
        <div className="optimized-message">
          <h3>You're an AI Spend Pro!</h3>
          <p>Your current stack is perfectly optimized. We'll notify you if new plans or tools change the math.</p>
          <button className="signup-btn">Stay Optimized</button>
        </div>
      )}

      <button className="reset-btn" onClick={onReset}>Start New Audit</button>
    </div>
  );
};
