import { Component, DestroyRef, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoRepository } from '../store/todo.repository';
import { Observable } from 'rxjs';
import { EntityRef } from '../core/models/entity';
import { map } from "rxjs";
import { ITodo } from '../core/models/todo';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'elf-with-ng';
  todo$!: Observable<EntityRef[]>;

  constructor(private todoRepo: TodoRepository,
    private destroyRef: DestroyRef,
  ){
    this.todo$ = this.todoRepo.todo$.pipe(map((todo: ITodo[]) => todo.map((e)=> ({id: e.id, title: e.title, completed: e.completed})))) as any;

  }

  ngOnInit(): void {
    this.todoRepo.fetch().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
