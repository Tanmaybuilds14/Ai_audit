export type ToolName = 
  | 'Cursor' 
  | 'GitHub Copilot' 
  | 'Claude' 
  | 'ChatGPT' 
  | 'Anthropic API' 
  | 'OpenAI API' 
  | 'Gemini' 
  | 'Windsurf';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface ToolSpend {
  tool: ToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditFormData {
  tools: ToolSpend[];
  teamSize: number;
  useCase: UseCase;
}

export interface Recommendation {
  tool: ToolName;
  currentSpend: number;
  recommendedAction: string;
  savings: number;
  reason: string;
}

export interface AuditResult {
  recommendations: Recommendation[];
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  summary?: string;
}
