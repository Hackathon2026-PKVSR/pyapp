import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VerificationResult } from '../../core/models/verification.models';
import { ApiService } from '../../core/services/api.service';
import { VerificationStoreService } from '../../core/services/verification-store.service';

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
}

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {
  inputText = '';
  selectedFile: File | null = null;
  infoMessage = '';
  voiceActive = false;
  private recognition?: SpeechRecognitionLike;

  constructor(
    private readonly api: ApiService,
    private readonly store: VerificationStoreService,
    private readonly router: Router
  ) {}

  onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] ?? null;
    this.selectedFile = file;
  }

  toggleVoice(): void {
    const api = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!api) {
      this.infoMessage = 'Voice input is not supported in this browser.';
      return;
    }

    if (!this.recognition) {
      const recognition = new api() as SpeechRecognitionLike;
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript ?? '';
        this.inputText = this.inputText ? `${this.inputText} ${transcript}` : transcript;
      };
      recognition.onerror = () => {
        this.voiceActive = false;
        this.infoMessage = 'Voice input failed. Please type manually.';
      };
      this.recognition = recognition;
    }

    if (this.voiceActive) {
      this.recognition.stop();
      this.voiceActive = false;
      return;
    }

    this.recognition.start();
    this.voiceActive = true;
    this.infoMessage = 'Listening... speak your text now.';
  }

  runVerification(): void {
    if (!this.inputText.trim() && !this.selectedFile) {
      this.infoMessage = 'Please enter text or upload a document before verifying.';
      return;
    }

    if (this.selectedFile) {
      this.api.upload(this.selectedFile).subscribe({
        next: () => this.createResult(this.selectedFile!.name),
        error: () => this.createResult(this.selectedFile!.name)
      });
      return;
    }

    this.createResult();
  }

  private createResult(fileName?: string): void {
    const payloadText = this.inputText.trim() || `Uploaded file: ${fileName}`;
    this.api.verify({ text: payloadText }).subscribe({
      next: (result: VerificationResult) => {
        this.store.setCurrentResult(result);
        this.router.navigateByUrl('/results');
      },
      error: () => {
        const result = this.buildMockResult(payloadText, fileName);
        this.store.setCurrentResult(result);
        this.router.navigateByUrl('/results');
      }
    });
  }

  private buildMockResult(text: string, fileName?: string): VerificationResult {
    return {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      sourceType: fileName ? 'document' : 'text',
      sourceName: fileName,
      responseText: text,
      confidenceScore: 74,
      claims: [
        {
          claim: 'The treatment is approved globally since 2019.',
          status: 'incorrect',
          confidence: 24,
          evidence: 'No global approval record found in public registries.'
        },
        {
          claim: 'The process reduced cost by 28% in pilot sites.',
          status: 'needs-review',
          confidence: 63,
          evidence: 'Pilot report exists but has smaller sample support than stated.'
        },
        {
          claim: 'The team shipped the release in Q2.',
          status: 'correct',
          confidence: 91,
          evidence: 'Release notes and tagged commits confirm Q2 delivery.'
        }
      ],
      suggestedCorrections: [
        'Replace global approval claim with verified country-level approval details.',
        'Add uncertainty bounds to pilot cost reduction statement.'
      ],
      highlights: ['approved globally since 2019', 'reduced cost by 28% in pilot sites']
    };
  }
}
