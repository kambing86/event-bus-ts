// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AllowedPayload = any;

type Events<Mapping extends { [key: string]: AllowedPayload }> = {
  [key: string]: keyof Mapping;
};

type ActionsMapping<Mapping extends { [key: string]: AllowedPayload }, E extends Events<Mapping>> = {
  [Key in E[keyof E]]: Mapping[Key] extends undefined ? () => void : (payload: Mapping[Key]) => void;
};

export function createEventBus<Mapping extends { [key: string]: AllowedPayload }>({
  events,
}: {
  events: Events<Mapping>;
}) {
  // check duplicate events
  const eventTypes = Object.values(events);
  const uniqueEventTypes = new Set(eventTypes);
  if (uniqueEventTypes.size !== eventTypes.length) {
    throw new Error('Duplicate event types found in the event bus.');
  }

  type ListenerMap = {
    [Key in keyof Mapping]: Set<(data: Mapping[Key]) => void> | undefined;
  };
  const eventListenersMap = {} as ListenerMap;

  const eventBus = {
    dispatch<E extends keyof Mapping, D extends Mapping[E]>(
      event: E,
      ...args: D extends undefined ? [undefined?] : [D]
    ) {
      const eventListeners = eventListenersMap[event];
      if (eventListeners == null) return;
      for (const callback of eventListeners) {
        callback(args[0]);
      }
    },
    subscribe<E extends keyof Mapping, D extends Mapping[E]>(
      event: E,
      callback: D extends undefined ? () => void : (data: D) => void,
    ) {
      let eventListeners = eventListenersMap[event];
      if (eventListeners == null) {
        // eslint-disable-next-line no-multi-assign
        eventListeners = eventListenersMap[event] = new Set();
      }
      eventListeners.add(callback);
      const unsubscribe = () => {
        if (eventListeners == null) return;
        eventListeners.delete(callback);
      };
      return { unsubscribe };
    },
  };

  const actions = {} as ActionsMapping<Mapping, Events<Mapping>>;

  for (const eventType of eventTypes) {
    type E = typeof eventType;
    type Actions = Mapping[E] extends undefined ? () => void : (payload: Mapping[E]) => void;
    const action = (<D extends Mapping[E]>(...args: D extends undefined ? [undefined?] : [D]) =>
      eventBus.dispatch(eventType, ...args)) as Actions;
    actions[eventType] = action;
  }

  return { ...eventBus, actions };
}

export { createUseEventBus } from './hook';
