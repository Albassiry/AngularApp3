import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  selectedBook: Book = { title: '', author: '', description: '' };
  isEditMode: boolean = false;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data: Book[]) => (this.books = data),
      error: (err: any) => console.error('Error fetching books:', err)
    });
  }

  saveBook(): void {
    if (!this.selectedBook.title || !this.selectedBook.author) {
      alert('Title and Author are required!');
      return;
    }

    if (this.isEditMode) {
      this.bookService.updateBook(this.selectedBook).subscribe(() => {
        this.resetForm();
        this.loadBooks();
      });
    } else {
      this.bookService.createBook(this.selectedBook).subscribe(() => {
        this.resetForm();
        this.loadBooks();
      });
    }
  }

  editBook(book: Book): void {
    this.selectedBook = { ...book };
    this.isEditMode = true;
  }

  deleteBook(id: number | undefined): void {
    if (id && confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe(() => {
        this.loadBooks();
      });
    }
  }

  resetForm(): void {
    this.selectedBook = { title: '', author: '', description: '' };
    this.isEditMode = false;
  }
}