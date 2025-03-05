import { HttpResponse } from '@angular/common/http';
export declare class PageContent<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
  constructor(response: HttpResponse<unknown>);
}

export interface Page {
  first: number;
  rows: number;
}
