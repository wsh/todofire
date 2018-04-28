import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  todoStore: TodoStore;
  newTodoText = 'What needs to be done?';

  constructor() {
    this.todoStore = new TodoStore();
  }

  editTodo(foo: Todo) {
    foo.editing = true;
  }

  updateTodo(foo: Todo, bar: String) {
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

  toggleCompletion(foo: Todo) {
    foo.completed = !foo.completed;
  }
}

export class TodoStore {
  todos: Array<Todo>;

  constructor() {
    this.todos = [new Todo("sample")];
  }

  allCompleted() {
    return true;
  }

  getCompleted() {
    return this.todos.filter(v => v.completed);
  }

  getRemaining() {
    return this.todos.filter(v => !v.completed);
  }

  addTodo(foo: Todo) {
    this.todos.push(foo);
  }

  removeTodo(foo: Todo) {
    this.todos.splice(this.todos.indexOf(foo), 1);
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