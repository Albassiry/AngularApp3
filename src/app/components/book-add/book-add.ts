import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Book, BookService } from '../../services/book';

@Component({
  selector: 'app-book-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-add.html',
  styleUrl: './book-add.css'
})
export class BookAddComponent {
  book: Book = {
    title: '',
    author: '',
    description: '',
    cover_image: 'placeholder_100.jpg'
  };

  selectedFile: File | null = null;
  submitting = false;
  errorMessage = '';

  constructor(private bookService: BookService, private router: Router) {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files && input.files.length > 0 ? input.files[0] : null;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.book.title.trim() || !this.book.author.trim()) {
      this.errorMessage = 'Title and Author are required.';
      return;
    }

    this.submitting = true;

    if (this.selectedFile) {
      this.bookService.uploadCover(this.selectedFile).subscribe({
        next: (res) => {
          this.book.cover_image = res.filename;
          this.saveBook();
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage = err?.error?.message || 'Cover image upload failed.';
        }
      });
    } else {
      this.saveBook();
    }
  }

  private saveBook(): void {
    this.bookService.addBook(this.book).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/list']);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err?.error?.message || 'Failed to add book.';
      }
    });
  }
}