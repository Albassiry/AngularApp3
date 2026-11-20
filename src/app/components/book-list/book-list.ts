import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Book, BookService } from '../../services/book';

@Component({
selector: 'app-book-list',
standalone: true,
imports: [CommonModule, RouterLink],
templateUrl: './book-list.html',
styleUrl: './book-list.css'
})
export class BookListComponent implements OnInit {
books: Book[] = [];
loading = true;
errorMessage = '';

constructor(public bookService: BookService) {}

ngOnInit(): void {
this.loadBooks();
}

loadBooks(): void {
this.loading = true;
this.errorMessage = '';

this.bookService.getBooks().subscribe({
  next: (data) => {
    this.books = Array.isArray(data) ? data : [];
    this.loading = false;
  },
  error: () => {
    this.errorMessage = 'Failed to load books. Verify Apache and MySQL are running.';
    this.loading = false;
  }
});
}

onImgError(event: Event): void {
const img = event.target as HTMLImageElement;
img.src = this.bookService.getCoverUrl('placeholder_100.jpg');
}
}
