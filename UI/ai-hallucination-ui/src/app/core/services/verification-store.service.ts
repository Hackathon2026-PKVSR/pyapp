import { Injectable, signal } from '@angular/core';
import { VerificationResult } from '../models/verification.models';

@Injectable({ providedIn: 'root' })
export class VerificationStoreService {
  readonly currentResult = signal<VerificationResult | null>(null);
  readonly recentResults = signal<VerificationResult[]>([]);

  setCurrentResult(result: VerificationResult): void {
    this.currentResult.set(result);
    this.recentResults.update((items) => [result, ...items].slice(0, 30));
  }
}
