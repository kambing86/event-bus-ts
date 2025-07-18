import { useEffect, useRef } from 'react';
import type { AllowedPayload, createEventBus } from '.';

type EventBusType<Mapping extends { [key: string]: AllowedPayload }> = ReturnType<typeof createEventBus<Mapping>>;

export function createUseEventBus<Mapping extends { [key: string]: AllowedPayload }>(eventBus: EventBusType<Mapping>) {
  return function useEventBus<E extends keyof Mapping, D extends Mapping[E]>(
    event: E,
    callback: D extends undefined ? () => void : (data: D) => void,
  ) {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;
    useEffect(() => eventBus.subscribe(event, callbackRef.current).unsubscribe, [event, eventBus]);
  };
}
