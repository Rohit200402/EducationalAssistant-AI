import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { StudyGoalService } from '../../../services/study-goal.service';
import { ToastService } from '../../../services/toast.service';
import { StudyGoalDto } from '../../../models/study-goal.model';

@Component({
  selector: 'app-study-planner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UserNavbarComponent, FooterComponent],
  templateUrl: './study-planner.component.html',
  styleUrls: ['./study-planner.component.css']
})
export class StudyPlannerComponent implements OnInit {
  goal: StudyGoalDto | null = null;
  dailyTarget = 5;
  weeklyTarget = 25;
  loading = true;
  saving = false;

  constructor(private studyGoalService: StudyGoalService, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.studyGoalService.get().subscribe({
      next: (data) => {
        this.goal = data;
        this.dailyTarget = data.dailyTarget;
        this.weeklyTarget = data.weeklyTarget;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  save(): void {
    this.saving = true;
    this.studyGoalService.update({ dailyTarget: this.dailyTarget, weeklyTarget: this.weeklyTarget }).subscribe({
      next: (data) => {
        this.goal = data;
        this.saving = false;
        this.toast.success('Goals updated!');
        this.cdr.detectChanges();
      },
      error: () => { this.saving = false; this.toast.error('Failed to save goals.'); }
    });
  }

  getDailyProgress(): number {
    if (!this.goal || this.goal.dailyTarget === 0) return 0;
    return Math.min(100, Math.round((this.goal.questionsToday / this.goal.dailyTarget) * 100));
  }

  getWeeklyProgress(): number {
    if (!this.goal || this.goal.weeklyTarget === 0) return 0;
    return Math.min(100, Math.round((this.goal.questionsThisWeek / this.goal.weeklyTarget) * 100));
  }
}
