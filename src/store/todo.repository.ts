import { Injectable } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { createStore, select, withProps } from '@ngneat/elf';
import { addEntities, deleteEntities, selectAllEntities, setEntities, upsertEntities, withEntities } from '@ngneat/elf-entities';
import {PaginationData, setPage, updatePaginationData, withPagination } from '@ngneat/elf-pagination';
import { ITodo } from '../core/models/todo';
import { Observable, tap, map } from 'rxjs';
import { QueryParam } from '../core/models/query-param';
import { PageContent } from '../core/models/page-content';


interface ITodoProp{
    current: ITodo | null;
}

const store = createStore(
    {name: 'todo'},
    withEntities<ITodo>(),
    withProps<ITodoProp>({ current: null}),
    withPagination()
);

@Injectable({providedIn: 'root'})
export class TodoRepository{
    todo$: Observable<ITodo[]> = store.pipe(selectAllEntities());

    constructor(private todoService: TodoService){}

    setCurrent = (todo: ITodo | null) => {
        store.update((state) => ({...state, current: todo}))
    }

    fetch = (param: QueryParam = {}): Observable<ITodo[]> => {
        // const {page = 1, size = 10 } = param;
        return this.todoService.getAll(param).pipe(
            tap((content: any) => {
                console.log(content)
                // const {items,total } = content;

                // const paginationData = {
                //     currentPage: page,
                //     perPage: size,
                //     total,
                //     lastPage: Math.floor(total/size)
                // };

                store.update(
                    setEntities(content),
                    // updatePaginationData(paginationData),
                    // setPage(
                    //     page,
                    //     items.map((i: any) => i.id)
                    // )
                )
            }),
            map((pageContent: PageContent<ITodo>)=> {
                return pageContent.items;
            })
        )

    }

    create = (todo: ITodo): Observable<ITodo> => {
        return this.todoService.create(todo).pipe(
            tap((newTodo: ITodo) => {
                store.update(addEntities(newTodo));
            })
        );
    }

    update = (todo: ITodo): Observable<ITodo> => {
        return this.todoService.update(todo).pipe(
            tap((updatedTodo) => {
                store.update(upsertEntities(updatedTodo));
            })
        );
    }

    delete = (id: string): Observable<unknown> => {
        return this.todoService.delete(id).pipe(
            tap(() => {
                store.update(deleteEntities([id]))
            })
        )

    }


}
