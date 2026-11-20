import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list';
import { BookAddComponent } from './components/book-add/book-add';
import { BookUpdateComponent } from './components/book-update/book-update';
import { BookDeleteComponent } from './components/book-delete/book-delete';

export const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: BookListComponent },
  { path: 'add', component: BookAddComponent },
  { path: 'update/:id', component: BookUpdateComponent },
  { path: 'delete/:id', component: BookDeleteComponent },
  { path: '**', redirectTo: 'list' }
];