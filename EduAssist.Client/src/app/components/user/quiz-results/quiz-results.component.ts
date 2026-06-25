import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { QuizService } from '../../../services/quiz.service';
import { ToastService } from '../../../services/toast.service';
import { QuizResult } from '../../../models/quiz.model';

@Component({
  selector: 'app-quiz-results',
  standalone: true,
  imports: [CommonModule, RouterModule, UserNavbarComponent, FooterComponent],
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.css']
})
export class QuizResultsComponent implements OnInit {
  result: QuizResult | null = null;
  loading = true;

  constructor(private quizService: QuizService, private route: ActivatedRoute, private router: Router, private toast: ToastService) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.quizService.getResults(id).subscribe({
      next: (r) => { this.result = r; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('No results found'); this.router.navigate(['/user/quiz']); }
    });
  }

  getScoreColor(): string {
    if (!this.result) return 'text-muted';
    if (this.result.percentage >= 80) return 'text-success';
    if (this.result.percentage >= 50) return 'text-warning';
    return 'text-danger';
  }
}
