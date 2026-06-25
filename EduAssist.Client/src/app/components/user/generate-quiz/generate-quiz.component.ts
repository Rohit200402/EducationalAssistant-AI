import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { QuizService } from '../../../services/quiz.service';
import { CategoryService } from '../../../services/category.service';
import { ToastService } from '../../../services/toast.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-generate-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UserNavbarComponent, FooterComponent],
  templateUrl: './generate-quiz.component.html',
  styleUrls: ['./generate-quiz.component.css']
})
export class GenerateQuizComponent implements OnInit {
  categories: Category[] = [];
  selectedCategoryId = 0;
  topic = '';
  numberOfQuestions = 5;
  difficulty = 'Medium';
  generating = false;

  constructor(private quizService: QuizService, private categoryService: CategoryService, private router: Router, private toast: ToastService) {}

  ngOnInit(): void { this.categoryService.getAllNoPagination().subscribe(c => this.categories = c); }

  generate(): void {
    if (!this.selectedCategoryId || !this.topic.trim()) { this.toast.warning('Select a category and enter a topic'); return; }
    this.generating = true;
    this.quizService.generate({ categoryId: this.selectedCategoryId, topic: this.topic, numberOfQuestions: this.numberOfQuestions, difficulty: this.difficulty }).subscribe({
      next: (quiz) => { this.toast.success('Quiz generated!'); this.router.navigate(['/user/quiz', quiz.quizId]); },
      error: (err) => { this.generating = false; this.toast.error(err.error?.message || 'Failed to generate quiz'); }
    });
  }
}
