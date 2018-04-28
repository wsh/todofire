import { Component } from '@angular/core';
import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class TodoStore {
  todos: Observable<TodoId[]>;
  db: AngularFirestore;
  undone: AngularFirestore

  constructor(db: AngularFirestore) {
    this.db = db;
    this.todos = db.collection<Todo>("todos").snapshotChanges().map(snap => {
      return snap.map(a => {
        const id = a.payload.doc.id;
        const todo = a.payload.doc.data() as Todo;
        return { id, ...todo };
      });
    });
  }

  allCompleted() {
    return true;
  }

  getCompleted() {
    return this.todos.map(v => v.filter(b => b.completed).length);
  }

  getRemaining() {
    return this.todos.map(v => v.filter(b => !b.completed).length);
  }

  addTodo(foo: Todo) {
    var id = this.db.createId();
    this.db.collection("todos").doc(id).set({ text: foo.text, completed: false });
  }

  removeTodo(foo: TodoId) {
    this.db.collection("todos").doc(foo.id).delete();
  }

  toggleCompletion(foo: TodoId) {
    this.db.collection("todos").doc(foo.id).update({ completed: !foo.completed });
  }
}

@Component({
  selector: 'app-root',
  providers: [TodoStore],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent {
  title = 'app';
  todoStore: TodoStore;
  newTodoText = 'What needs to be done?';

  constructor(todoStore: TodoStore) {
    this.todoStore = todoStore;
  }

  editTodo(foo: TodoId) {
    foo.editing = true;
  }

  updateTodo(foo: TodoId, bar: String) {
    if (bar.trim().length == 0) {
      this.todoStore.removeTodo(foo);
      return;
    }
    foo.text = bar;
    foo.editing = false;
  }

  addTodo(foo: String) {
    this.todoStore.addTodo(new Todo(foo));
  }

  toggleCompletion(foo: TodoId) {
    this.todoStore.toggleCompletion(foo);
  }
}

export class Todo {
  text: String;
  completed: Boolean;
  editing: Boolean;

  constructor(text: String) {
    this.text = text;
    this.completed = false;
    this.editing = false;
  }
}

export class TodoId extends Todo { id: string }