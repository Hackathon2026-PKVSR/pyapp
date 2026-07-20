import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VerificationResult } from '../../core/models/verification.models';
import { ApiService } from '../../core/services/api.service';
import { VerificationStoreService } from '../../core/services/verification-store.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  items = signal<VerificationResult[]>([]);

  constructor(
    private readonly api: ApiService,
    private readonly store: VerificationStoreService
  ) {}

  ngOnInit(): void {
    this.api.history().subscribe({
      next: (res: VerificationResult[]) => this.items.set(res),
      error: () => {
        const fromStore = this.store.recentResults();
        if (fromStore.length) {
          this.items.set(fromStore);
        } else {
          this.items.set([
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
          ]);
        }
      }
    });
  }
}
