import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Book record shape matching MySQL books table
export interface Book {
  id?: number;
  title: string;
  author: string;
  description: string;
  cover_image?: string;
  created_at?: string;
}

// Response payload returned by upload.php
export interface UploadResponse {
  message: string;
  filename: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  // Local PHP API base URL
  private readonly baseUrl = 'http://localhost/AngularApp3API';
  private readonly apiUrl = `${this.baseUrl}/api.php`;

  constructor(private http: HttpClient) {}

  // GET all books
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  // GET single book by ID
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}?id=${id}`);
  }

  // POST new book
  addBook(book: Book): Observable<{ message: string; id: number }> {
    return this.http.post<{ message: string; id: number }>(this.apiUrl, book);
  }

  // PUT updated book
  updateBook(book: Book): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.apiUrl, book);
  }

  // DELETE book by ID
  deleteBook(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}?id=${id}`);
  }

  // POST cover image file to upload.php
  uploadCover(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadResponse>(`${this.baseUrl}/upload.php`, formData);
  }

  // Build cover image URL with fallback placeholder
  getCoverUrl(filename?: string): string {
    const safeName = filename && filename.trim() !== '' ? filename : 'placeholder_100.jpg';
    return `${this.baseUrl}/uploads/${safeName}`;
  }
}