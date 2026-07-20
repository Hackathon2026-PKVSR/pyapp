export interface LoginPayload {
  username: string;
  password: string;
}

export interface DashboardSummary {
  totalChecks: number;
  avgConfidence: number;
  hallucinationRate: number;
  lastRunAt: string;
}

export interface AtomicClaim {
  claim: string;
  status: 'correct' | 'needs-review' | 'incorrect';
  confidence: number;
  evidence: string;
}

export interface VerificationResult {
  id: string;
  createdAt: string;
  sourceType: 'text' | 'document';
  sourceName?: string;
  responseText: string;
  confidenceScore: number;
  claims: AtomicClaim[];
  suggestedCorrections: string[];
  highlights: string[];
}
