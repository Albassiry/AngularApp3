import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book, BookService } from '../../services/book';

@Component({
  selector: 'app-book-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-update.html',
  styleUrl: './book-update.css'
})
export class BookUpdateComponent implements OnInit {
  book: Book = {
    id: 0,
    title: '',
    author: '',
    description: '',
    cover_image: 'placeholder_100.jpg'
  };

  selectedFile: File | null = null;
  loading = true;
  saving = false;
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
        this.book = { ...data };
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load book details.';
        this.loading = false;
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files && input.files.length > 0 ? input.files[0] : null;
  }

  onUpdate(): void {
    this.errorMessage = '';

    if (!this.book.title.trim() || !this.book.author.trim()) {
      this.errorMessage = 'Title and Author are required.';
      return;
    }

    this.saving = true;

    if (this.selectedFile) {
      this.bookService.uploadCover(this.selectedFile).subscribe({
        next: (res) => {
          this.book.cover_image = res.filename;
          this.persistUpdate();
        },
        error: (err) => {
          this.saving = false;
          this.errorMessage = err?.error?.message || 'Cover image upload failed.';
        }
      });
    } else {
      this.persistUpdate();
    }
  }

  private persistUpdate(): void {
    this.bookService.updateBook(this.book).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/list']);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.message || 'Failed to update book.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/list']);
  }
}