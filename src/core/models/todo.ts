import { EntityRef } from "./entity";

export interface ITodo extends EntityRef{
    title: string;
    completed: boolean
}
