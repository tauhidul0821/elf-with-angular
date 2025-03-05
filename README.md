## elf package install 

```bash

"@ngneat/elf": "^2.5.1",
"@ngneat/elf-devtools": "^1.3.0",
"@ngneat/elf-entities": "^5.0.2",
"@ngneat/elf-pagination": "^1.1.0",
"@ngneat/elf-persist-state": "^1.2.1",
"@ngneat/elf-requests": "^1.9.2",
```


# Elf State Management in Angular

Elf is a lightweight and flexible state management library for Angular applications, built on RxJS. It provides a simple API for managing state, focusing on immutability and reactivity.

## 1. Core Concepts in Elf
Elf revolves around the **store**, which holds the application state and provides reactive updates. You can define a store with features like entities, pagination, and props.

---

## Understanding the Core API

### 1. Creating a Store
The `createStore` function initializes a store.

```typescript
import { createStore } from '@ngneat/elf';

const counterStore = createStore({ name: 'counter' });
```
Here, `'counter'` is the store name (useful for debugging).

---

### 2. Using `select` to Get Data Reactively
The `select` function listens for state changes and emits values whenever the state updates.

```typescript
import { select } from '@ngneat/elf';

counterStore.pipe(select()).subscribe((state) => {
  console.log('Counter state:', state);
});
```

---

### 3. Adding Props with `withProps`
Props are used to store primitive values in the state.

```typescript
import { withProps } from '@ngneat/elf';

const store = createStore(
  { name: 'counter' },
  withProps<{ count: number }>({ count: 0 })
);
```

To update props, use the `update` method:

```typescript
import { update } from '@ngneat/elf';

store.update((state) => ({ count: state.count + 1 }));
```

---

## Entity Management in Elf
Entities are objects identified by a unique `id`, similar to NgRx Entity.

### 1. Setting Up Entities
To manage entities, use `withEntities` in `createStore`.

```typescript
import { createStore } from '@ngneat/elf';
import { withEntities } from '@ngneat/elf-entities';

interface User {
  id: number;
  name: string;
}

const userStore = createStore(
  { name: 'users' },
  withEntities<User>()
);
```

---

### 2. Entity Operations
Elf provides functions for CRUD operations:

#### Adding Entities (`addEntities`)
```typescript
import { addEntities } from '@ngneat/elf-entities';

userStore.update(addEntities({ id: 1, name: 'John Doe' }));
userStore.update(addEntities([{ id: 2, name: 'Jane Doe' }, { id: 3, name: 'Alice' }]));
```

#### Selecting Entities (`selectAllEntities`)
```typescript
import { selectAllEntities } from '@ngneat/elf-entities';

userStore.pipe(selectAllEntities()).subscribe((users) => {
  console.log('Users:', users);
});
```

#### Updating Entities (`upsertEntities`)
```typescript
import { upsertEntities } from '@ngneat/elf-entities';

userStore.update(upsertEntities({ id: 1, name: 'John Smith' }));
```

#### Deleting Entities (`deleteEntities`)
```typescript
import { deleteEntities } from '@ngneat/elf-entities';

userStore.update(deleteEntities(1)); // Deletes user with ID 1
```

#### Replacing All Entities (`setEntities`)
```typescript
import { setEntities } from '@ngneat/elf-entities';

userStore.update(setEntities([{ id: 4, name: 'Bob' }]));
```

---

## Pagination in Elf
Elf provides built-in support for pagination using `withPagination`.

### 1. Adding Pagination
```typescript
import { withPagination, PaginationData } from '@ngneat/elf-pagination';

const paginationStore = createStore(
  { name: 'pagination' },
  withPagination()
);
```

### 2. Setting the Page
```typescript
import { setPage } from '@ngneat/elf-pagination';

paginationStore.update(setPage(2));
```

### 3. Updating Pagination Data
```typescript
import { updatePaginationData } from '@ngneat/elf-pagination';

paginationStore.update(
  updatePaginationData({ currentPage: 1, totalItems: 100, perPage: 10 })
);
```

---

## Summary
- **`createStore`**: Initializes a store.
- **`select`**: Reactively selects store data.
- **`withProps`**: Adds simple properties to the store.
- **Entity Functions**:
  - **`withEntities`**: Enables entity management.
  - **`addEntities`**: Adds new entities.
  - **`deleteEntities`**: Removes entities.
  - **`selectAllEntities`**: Retrieves all entities.
  - **`setEntities`**: Replaces all entities.
  - **`upsertEntities`**: Updates or inserts entities.
- **Pagination Functions**:
  - **`withPagination`**: Adds pagination.
  - **`setPage`**: Updates the current page.
  - **`updatePaginationData`**: Updates total items, per page, etc.

Would you like me to provide an example using Angular components and services? 🚀
