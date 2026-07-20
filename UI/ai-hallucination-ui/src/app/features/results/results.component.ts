import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VerificationStoreService } from '../../core/services/verification-store.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {
  readonly result;
  readonly riskLevel;

  constructor(private readonly store: VerificationStoreService) {
    this.result = this.store.currentResult;
    this.riskLevel = computed(() => {
      const score = this.result()?.confidenceScore ?? 0;
      if (score >= 85) {
        return { label: 'Low Risk', className: 'ok' };
      }
      if (score >= 60) {
        return { label: 'Medium Risk', className: 'warn' };
      }
      return { label: 'High Risk', className: 'bad' };
    });
  }
}
