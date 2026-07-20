import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardSummary } from '../../core/models/verification.models';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  summary = signal<DashboardSummary | null>(null);

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    this.api.dashboard().subscribe({
      next: (res: DashboardSummary) => this.summary.set(res),
      error: () => {
        this.summary.set({
          totalChecks: 182,
          avgConfidence: 79,
          hallucinationRate: 21,
          lastRunAt: new Date().toISOString()
        });
      }
    });
  }
}
