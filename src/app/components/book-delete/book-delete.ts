import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Book, BookService } from '../../services/book';

@Component({
  selector: 'app-book-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-delete.html',
  styleUrl: './book-delete.css'
})
export class BookDeleteComponent implements OnInit {
  book: Book | null = null;
  loading = true;
  deleting = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public bookService: BookService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage = 'Invalid book ID.';
      this.loading = false;
      return;
    }

    this.bookService.getBookById(id).subscribe({
      next: (data) => {
        this.book = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load book.';
        this.loading = false;
      }
    });
  }

  confirmDelete(): void {
    if (!this.book?.id) return;

    this.deleting = true;
    this.errorMessage = '';

    this.bookService.deleteBook(this.book.id).subscribe({
      next: () => {
        this.deleting = false;
        this.router.navigate(['/list']);
      },
      error: (err) => {
        this.deleting = false;
        this.errorMessage = err?.error?.message || 'Failed to delete book.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/list']);
  }
}