import { Component, DestroyRef, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoRepository } from '../store/todo.repository';
import { Observable } from 'rxjs';
import { EntityRef } from '../core/models/entity';
import { map } from "rxjs";
import { ITodo } from '../core/models/todo';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {AsyncPipe, NgClass, NgFor} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, NgFor, AsyncPipe, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  newTask: string = '';

  todo$!: Observable<ITodo[]>;

  constructor(private todoRepo: TodoRepository,
    private destroyRef: DestroyRef){
    this.todo$ = this.todoRepo.todo$.pipe(map((todo: ITodo[]) => todo.map((e)=> ({id: e.id, title: e.title, completed: e.completed}))));
  }

  addTask(): void{
    if(this.newTask.trim() !== ''){
      const newTodoItem: ITodo = {
        id: this.generateUniqueNumber(),
        title: this.newTask,
        completed: false
      }
      console.log('newTodoItem:-', newTodoItem)

      this.newTask = '';
    }
  }

  toggleCompleted(id: string): void{
    console.log('updateTask', id)
  }

  deleteTask(id: string): void{
    console.log('deleteTask', id)
  }

  ngOnInit(): void {
    this.todoRepo.fetch().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  generateUniqueNumber(): string {
    return Date.now() + Math.floor(Math.random() * 1000).toString();
  }
}
