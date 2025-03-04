import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITodo } from '../core/models/todo'
import { QueryParam } from '../core/models/query-param';

@Injectable({ providedIn: 'root'})
export class TodoService{

    private readonly baseUrl: string;

    constructor(private http: HttpClient){
        this.baseUrl = ''
    }

    getAll(param: QueryParam): Observable<ITodo[]> {
        const params = new HttpParams()
        .append('page', param.page ?? 1)
        .append('size', param.size ?? 30)
        .append('search', param.search ?? '')
        .append('orderBy', param.orderBy ?? '')

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

    delete(todo: ITodo): Observable<unknown>{
        return this.http.delete<unknown>(`${this.baseUrl}/${todo.id}`)
    }

}