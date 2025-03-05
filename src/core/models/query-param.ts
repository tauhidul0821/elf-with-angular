export interface QueryParam {
    id?: string;
    page?: number;
    size?: number;
    search?: string;
    from?: Date | string;
    to?: Date | string;
    orderBy?: string;
  }
  