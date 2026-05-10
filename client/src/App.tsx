import { useState, useEffect } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import './index.css';
import { SpendForm } from './components/SpendForm';
import { AuditResults } from './components/AuditResults';
import { LeadCapture } from './components/LeadCapture';
import type { AuditFormData, AuditResult } from './types';
import { runAudit } from './engine';

const HomeView = () => {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleAudit = async (data: AuditFormData) => {
    setLoading(true);
    const result = runAudit(data);
    
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          useCase: data.useCase,
          totalSpend: result.totalMonthlySpend,
          monthlySavings: result.totalMonthlySavings,
          annualSavings: result.totalAnnualSavings,
          recommendations: result.recommendations.map(r => `${r.tool}: ${r.recommendedAction} (${r.reason})`).join('\n')
        })
      });
      const aiData = await response.json();
      result.summary = aiData.summary;
    } catch (error) {
      console.error('Failed to fetch summary:', error);
      result.summary = `Based on your current stack for ${data.useCase}, you're spending $${result.totalMonthlySpend} per month. Our audit found that by switching to more cost-effective plans and alternatives, you could save $${result.totalMonthlySavings} monthly—totaling $${result.totalAnnualSavings} per year.`;
    }

    setAuditResult(result);
    setLoading(false);
  };

  const handleLeadCapture = async (email: string, details: any) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ...details, auditResult })
      });
      const data = await response.json();
      setShareUrl(data.shareUrl);
    } catch (error) {
      console.error('Failed to save lead:', error);
    }
  };

  return (
    <>
      {!auditResult && !loading && <SpendForm onAudit={handleAudit} />}
      
      {loading && (
        <div className="loading">
          <h2>Analyzing your stack...</h2>
          <p>Running hardcoded rules + AI inference...</p>
        </div>
      )}

      {auditResult && (
        <>
          <AuditResults result={auditResult} onReset={() => setAuditResult(null)} />
          {!shareUrl ? (
            <LeadCapture onSubmit={handleLeadCapture} />
          ) : (
            <div className="share-section">
              <h3>Audit Saved!</h3>
              <p>Share your results with this unique URL:</p>
              <div className="share-url-box">
                <code>{shareUrl}</code>
                <button onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy</button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

const ShareView = () => {
  const { id } = useParams();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/share/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(true);
        else setResult(data);
      })
      .catch(() => setError(true));
  }, [id]);

  if (error) return <div className="error">Audit not found.</div>;
  if (!result) return <div className="loading">Loading shared audit...</div>;

  return (
    <div>
      <div className="share-badge">Shared Audit Report</div>
      <AuditResults result={result} onReset={() => window.location.href = '/'} />
    </div>
  );
};

function App() {
  return (
    <div className="container">
      <header onClick={() => window.location.href = '/'} style={{ cursor: 'pointer' }}>
        <h1>AI Spend Auditor</h1>
        <p>Stop overpaying for AI. Get an instant, defensible audit of your stack.</p>
      </header>

      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/share/:id" element={<ShareView />} />
      </Routes>

      <footer>
        <p>&copy; 2026 AI Spend Auditor. Built for the modern stack.</p>
      </footer>
    </div>
  );
}

export default App;
