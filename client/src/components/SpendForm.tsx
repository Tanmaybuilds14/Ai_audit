import React, { useState, useEffect } from 'react';
import type { AuditFormData, ToolName, UseCase, ToolSpend } from '../types';

interface Props {
  onAudit: (data: AuditFormData) => void;
}

const TOOLS: ToolName[] = [
  'Cursor', 'GitHub Copilot', 'Claude', 'ChatGPT', 
  'Anthropic API', 'OpenAI API', 'Gemini', 'Windsurf'
];

const USE_CASES: UseCase[] = ['coding', 'writing', 'data', 'research', 'mixed'];

export const SpendForm: React.FC<Props> = ({ onAudit }) => {
  const [formData, setFormData] = useState<AuditFormData>(() => {
    const saved = localStorage.getItem('audit_form_data');
    return saved ? JSON.parse(saved) : {
      tools: [],
      teamSize: 1,
      useCase: 'mixed'
    };
  });

  useEffect(() => {
    localStorage.setItem('audit_form_data', JSON.stringify(formData));
  }, [formData]);

  const addTool = () => {
    const newTool: ToolSpend = {
      tool: 'ChatGPT',
      plan: 'Plus',
      monthlySpend: 20,
      seats: 1
    };
    setFormData({ ...formData, tools: [...formData.tools, newTool] });
  };

  const removeTool = (index: number) => {
    const newTools = [...formData.tools];
    newTools.splice(index, 1);
    setFormData({ ...formData, tools: newTools });
  };

  const updateTool = (index: number, field: keyof ToolSpend, value: any) => {
    const newTools = [...formData.tools];
    newTools[index] = { ...newTools[index], [field]: value };
    setFormData({ ...formData, tools: newTools });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAudit(formData);
  };

  return (
    <form className="spend-form" onSubmit={handleSubmit}>
      <h2>Analyze Your AI Stack</h2>
      
      <div className="form-group">
        <label>Team Size</label>
        <input 
          type="number" 
          min="1" 
          value={formData.teamSize} 
          onChange={e => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 1 })}
        />
      </div>

      <div className="form-group">
        <label>Primary Use Case</label>
        <select 
          value={formData.useCase} 
          onChange={e => setFormData({ ...formData, useCase: e.target.value as UseCase })}
        >
          {USE_CASES.map(uc => <option key={uc} value={uc}>{uc.charAt(0).toUpperCase() + uc.slice(1)}</option>)}
        </select>
      </div>

      <div className="tools-section">
        <h3>Tools & Plans</h3>
        {formData.tools.map((ts, index) => (
          <div key={index} className="tool-row">
            <select 
              value={ts.tool} 
              onChange={e => updateTool(index, 'tool', e.target.value as ToolName)}
            >
              {TOOLS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            
            <input 
              type="text" 
              placeholder="Plan (e.g. Pro)" 
              value={ts.plan} 
              onChange={e => updateTool(index, 'plan', e.target.value)}
            />
            
            <div className="input-with-prefix">
              <span>$</span>
              <input 
                type="number" 
                placeholder="Monthly Spend" 
                value={ts.monthlySpend} 
                onChange={e => updateTool(index, 'monthlySpend', parseFloat(e.target.value) || 0)}
              />
            </div>

            <input 
              type="number" 
              placeholder="Seats" 
              min="1"
              value={ts.seats} 
              onChange={e => updateTool(index, 'seats', parseInt(e.target.value) || 1)}
            />

            <button type="button" className="remove-btn" onClick={() => removeTool(index)}>×</button>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addTool}>+ Add Tool</button>
      </div>

      <button type="submit" className="submit-btn">Run Audit Engine</button>
    </form>
  );
};
