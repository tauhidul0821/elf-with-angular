import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITodo } from '../core/models/todo'
import { QueryParam } from '../core/models/query-param';
import { environment } from '../environments/environment';

@Injectable()
export class TodoService{

    private readonly baseUrl: string;

    constructor(private http: HttpClient){
        this.baseUrl = `${environment.baseUrl}/todos`
    }

    getAll(param: QueryParam): Observable<ITodo[]> {
        const params = new HttpParams()
        // .append('_page', param.page ?? 1)
        // .append('_limit', param.size ?? 10)
        // ?_page=1&_limit=2&_sort=name&_order=asc

        return this.http.get<ITodo[]>(this.baseUrl, {params});
    }

    getById(id: string | number): Observable<ITodo>{
        return this.http.get<ITodo>(this.baseUrl+'/'+ id);
    }

    create(data: ITodo): Observable<ITodo>{
        return this.http.post<ITodo>(this.baseUrl, data)
    }

    update(todo: ITodo): Observable<ITodo>{
        return this.http.put<ITodo>(`${this.baseUrl}/${todo.id}`, todo)
    }

    delete(todoId: string): Observable<unknown>{
        return this.http.delete<unknown>(`${this.baseUrl}/${todoId}`)
    }

}
