import { Injectable } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { createStore, select, withProps } from '@ngneat/elf';
import {
  addEntities,
  deleteEntities,
  selectAllEntities,
  setEntities,
  updateEntities,
  upsertEntities,
  withEntities
} from '@ngneat/elf-entities';
import { ITodo } from '../core/models/todo';
import {Observable, tap, map, throwError, catchError} from 'rxjs';
import { QueryParam } from '../core/models/query-param';
import {HttpErrorResponse} from '@angular/common/http';

interface ITodoProp{
    current: ITodo | null;
}

@Injectable()
export class TodoRepository{
  private readonly store = createStore(
    {name: 'todo'},
    withEntities<ITodo>(), // withEntities is a function in Elf that adds entity management to a store. It allows handling collections of objects identified by a unique id.
    withProps<ITodoProp>({ current: null}), //withProps is a function in Elf that adds custom properties (state) to a store.
  );

    readonly todo$: Observable<ITodo[]> = this.store.pipe(selectAllEntities());// selectAllEntities is a function in Elf that selects and returns all entities from a store as an observable.

    constructor(private todoService: TodoService){}

    fetch = (param: QueryParam = {}): Observable<ITodo[]> => {
        return this.todoService.getAll(param).pipe(
            tap((content: any) => {
                console.log(content)
                this.store.update(
                    setEntities(content) // setEntities replaces all existing entities in the store with a new set of entities. It removes old entities and adds the new ones.
                )
            }),
            catchError((error: HttpErrorResponse) => {
              return throwError(() => error);
            })
        )

    }

  generateUniqueNumber(): string {
    return Date.now() + Math.floor(Math.random() * 1000).toString();
  }

    create = (todo: Omit<ITodo, 'id'>): Observable<ITodo> => {
      const newTodo = {
        id: this.generateUniqueNumber(),
        ...todo
      }
        return this.todoService.create(newTodo).pipe(
            tap((newTodo: ITodo) => {// Server Response → tap (update store) → Observable emits to subscribers
              this.store.update(addEntities(newTodo));// addEntities is a function in Elf that adds new entities to the store while keeping existing ones.
            }),
            catchError((error: HttpErrorResponse) => {
              console.log(error)
              return throwError(() => error);
            })
        );
    }

    update = (todo: ITodo): Observable<ITodo> => {
        return this.todoService.update(todo).pipe(
            tap((updatedTodo) => {// The pipe function allows chaining operators, and tap is one of them. Tap is used for side effects, like logging or updating a store, without modifying the stream. So when the observable from todoService.create emits a value, it should pass through the tap operator.
                //this.store.update(upsertEntities(updatedTodo)); // The term "upsert" is a combination of "update" and "insert". So, it's likely that this function either updates existing entities or adds new ones if they don't exist
                this.store.update(updateEntities(todo.id, () => updatedTodo));
            }),
            catchError((error: HttpErrorResponse) => {
              return throwError(() => error);
            })
        );
    }

    delete = (id: string): Observable<unknown> => {
        return this.todoService.delete(id).pipe(
            tap(() => {
              this.store.update(deleteEntities([id]))
            }),
            catchError((error: HttpErrorResponse) => {
              return throwError(() => error);
            })
        )
    }
}
