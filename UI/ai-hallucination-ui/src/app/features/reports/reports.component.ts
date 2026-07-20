import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { VerificationResult } from '../../core/models/verification.models';
import { ApiService } from '../../core/services/api.service';
import { VerificationStoreService } from '../../core/services/verification-store.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  reports = signal<VerificationResult[]>([]);

  constructor(
    private readonly api: ApiService,
    private readonly store: VerificationStoreService
  ) {}

  ngOnInit(): void {
    const storeReports = this.store.recentResults();
    if (storeReports.length) {
      this.reports.set(storeReports);
      return;
    }

    this.api.history().subscribe({
      next: (res: VerificationResult[]) => this.reports.set(res),
      error: () =>
        this.reports.set([
          {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            sourceType: 'text',
            responseText: 'Sample verification content',
            confidenceScore: 74,
            claims: [],
            suggestedCorrections: [],
            highlights: []
          }
        ])
    });
  }

  download(report: VerificationResult): void {
    const content = [
      `Report ID: ${report.id}`,
      `Created At: ${report.createdAt}`,
      `Confidence Score: ${report.confidenceScore}%`,
      '--- Claims ---',
      ...report.claims.map((claim) => `${claim.status.toUpperCase()} ${claim.confidence}% ${claim.claim}`),
      '--- Suggested Corrections ---',
      ...report.suggestedCorrections
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `verification-report-${report.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
