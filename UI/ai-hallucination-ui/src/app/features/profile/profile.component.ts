import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  fullName = 'Verification Analyst';
  email = 'analyst@example.com';
  team = 'AI Trust & Safety';
  notifications = true;

  save(): void {
    alert('Profile preferences saved in UI state.');
  }
}
