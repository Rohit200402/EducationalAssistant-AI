import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Input() placeholder = 'Search...';
  @Output() searchChange = new EventEmitter<string>();
  searchTerm = '';

  onSearch(): void { this.searchChange.emit(this.searchTerm); }
  onClear(): void { this.searchTerm = ''; this.searchChange.emit(''); }
}
