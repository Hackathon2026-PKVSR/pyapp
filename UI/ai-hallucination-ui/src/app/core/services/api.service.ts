import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginPayload } from '../models/verification.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  login(payload: LoginPayload) {
    return this.http.post<{ token: string }>(this.buildUrl('/login'), payload);
  }

  dashboard() {
    return this.http.get(this.buildUrl('/dashboard'));
  }

  verify(payload: { text: string }) {
    return this.http.post(this.buildUrl('/verify'), payload);
  }

  upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.buildUrl('/upload'), formData);
  }

  history() {
    return this.http.get(this.buildUrl('/history'));
  }

  report(id: string) {
    return this.http.get(this.buildUrl(`/report/${id}`));
  }

  private buildUrl(endpoint: string): string {
    return `${environment.apiBaseUrl}${endpoint}`;
  }
}
