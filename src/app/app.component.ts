import {AfterViewInit, Component, DestroyRef, OnInit} from '@angular/core';
import { TodoRepository } from '../store/todo.repository';
import { Observable } from 'rxjs';
import { map } from "rxjs";
import { ITodo } from '../core/models/todo';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {AsyncPipe, NgClass, NgFor} from '@angular/common';
import * as introJs from 'intro.js';

@Component({
  selector: 'app-root',
  imports: [FormsModule, NgFor, AsyncPipe, NgClass],
  providers: [TodoRepository],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit{
  newTask: string = '';
  title = 'testbed';
  introJS = introJs.default();
  showBtns = false;

  todo$!: Observable<ITodo[]>;

  constructor(private todoRepo: TodoRepository,
    private destroyRef: DestroyRef){
    this.todo$ = this.todoRepo.todo$.pipe(map((todo: ITodo[]) => todo.map((e)=> ({id: e.id, title: e.title, completed: e.completed}))));
  }

  addTask(): void{
    if(this.newTask.trim() !== ''){
      const newTodoItem: Omit<ITodo, 'id'> = {
        title: this.newTask,
        completed: false
      }

      // call create repository
      console.log('newTodoItem:-', newTodoItem)
      this.todoRepo.create(newTodoItem).subscribe({
        next: () => {
          console.log('added successfully');
        }
      })

      this.newTask = '';
    }
  }

  toggleCompleted(todo: ITodo): void{
    this.todoRepo.update(todo).subscribe({
      next: () => console.log('updated successfully')
    })
  }

  deleteTask(id: string): void{
    this.todoRepo.delete(id).subscribe({
      next: () => {
        console.log('deleted successfully');
      }
    })
  }

  ngOnInit(): void {
    this.todoRepo.fetch().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();

  }

  ngAfterViewInit() {
    this.startTour();

    this.introJS.start();
  }

  clickButton(): void{
    this.introJS.start();
  }

  startTour(){
    this.introJS.setOptions({
      steps: [
        {

          title: 'buttons',
          element: '#addNew',
          intro: 'Click to view the buttons111'
        },
        {

          title: 'test',
          element: '#test',
          intro: 'This is test'
        }
      ],
      showProgress: true,
      disableInteraction: false
    });
    //
    // this.introJS.start();
    // this.introJS.onbeforechange((): any => {
    //   console.log("new step");
    //   this.introJS.refresh();
    // });

  }

}
