import React, { useState } from 'react';

interface Props {
  onSubmit: (email: string, details: any) => void;
}

export const LeadCapture: React.FC<Props> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, { company, role });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="lead-success">
        <h3>Report Sent!</h3>
        <p>Check your inbox for the full PDF breakdown and optimization guide.</p>
      </div>
    );
  }

  return (
    <div className="lead-capture">
      <h3>Get Your Full Audit Report</h3>
      <p>We'll send a detailed PDF breakdown and notify you when new savings opportunities arise.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Company Name (Optional)" 
            value={company} 
            onChange={e => setCompany(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Your Role (Optional)" 
            value={role} 
            onChange={e => setRole(e.target.value)} 
          />
        </div>
        <button type="submit" className="capture-btn">Send My Report</button>
      </form>
      <p className="privacy-note">No spam. Only high-value optimization alerts.</p>
    </div>
  );
};
