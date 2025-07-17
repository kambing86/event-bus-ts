import { useEffect, useRef } from 'react';
import type { createEventBus } from '.';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventBusType<Mapping extends { [key: string]: any }> = ReturnType<typeof createEventBus<Mapping>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createUseEventBus<Mapping extends { [key: string]: any }>(eventBus: EventBusType<Mapping>) {
  return function useEventBus<E extends keyof Mapping, D extends Mapping[E]>(
    event: E,
    callback: D extends undefined ? () => void : (data: D) => void,
  ) {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;
    useEffect(() => eventBus.subscribe(event, callbackRef.current), [event]);
  };
}
