<div align="center">
  <img width="200" height="200" src="https://raw.githubusercontent.com/voodootikigod/logo.js/master/js.png">
  <h1>event-bus</h1>
  <p>a simple event bus to be used in JavaScript/TypeScript Application, with React hook</p>
</div>

<h2 align="center">Install</h2>

```bash
npm install @kambing86/event-bus-ts
```

<h2 align="center">Usage</h2>

1) add `@kambing86/event-bus-ts` by installing `npm install @kambing86/event-bus-ts`
2) create a file for event bus, for eg. "src/util/eventBus.ts"
```ts
import { createEventBus, createUseEventBus } from '@kambing86/event-bus-ts';

// string enum for Event
export enum EventType {
  ADD_TODO = 'addTodo',
  REMOVE_TODO = 'removeTodo',
}

// or just const
export const EventType = {
  ADD_TODO: 'addTodo',
  REMOVE_TODO: 'removeTodo',
} as const;

// define the payload data for Event
export type EventDataMapping = {
  [EventType.ADD_TODO]: { id: number; text: string };
  [EventType.REMOVE_TODO]: number;
};

export const eventBus = createEventBus<EventDataMapping>({ events: EventType });

export const useEventBus = createUseEventBus<EventDataMapping>(eventBus);

const subscription = eventBus.subscribe(EventType.ADD_TODO, (todo) => {
  console.log(`${todo.text} is added`);
});

// Dispatch an event with payload
eventBus.dispatch(EventType.ADD_TODO, { id: 1, text: 'Learn TypeScript' });

// or use the actions with typescript hint
eventBus.actions.addTodo({ id: 2, text: 'Learn Event Bus' });

// or use actions with the enum / const
eventBus.actions[EventType.ADD_TODO]({ id: 3, text: 'Learn React' });

// Unsubscribe from the event
setTimeout(() => {
  subscription.unsubscribe();
}, 0);
```
3) then use it in React component
```tsx
function NewTodo() {
  // ...
  return <button onClick={() => eventBus.dispatch(EventType.ADD_TODO, newTodo)}>Add new</button>
  // or
  return <button onClick={() => eventBus.actions.addTodo(newTodo)}>Add new</button>
}

function TodoList() {
  const [todoList, setTodoList] = useState([]);

  // ...

  useEventBus(EventType.ADD_TODO, (newTodo) =>
    setTodoList((prev) => [...prev, newTodo]),
  );

  return <div>{todoList.map((todo) => <div>{todo.text}</div>)}</div>
}
```

<h2 align="center">Maintainers</h2>

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/kambing86">
          <img width="150" height="150" src="https://avatars3.githubusercontent.com/u/1342133?s=460&v=4">
          </br>
          Chua Kang Ming
        </a>
      </td>
    </tr>
  <tbody>
</table>
