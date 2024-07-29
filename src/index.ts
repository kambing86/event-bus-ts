// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createEventBus<Mapping extends { [key: string]: any }>() {
  const eventListenersMap = {} as Record<keyof Mapping, Set<(data: Mapping[keyof Mapping]) => void> | undefined>;

  const eventBus = {
    dispatch<E extends keyof Mapping, D extends Mapping[E]>(
      event: E,
      ...args: D extends undefined ? [undefined?] : [D]
    ) {
      const eventListeners = eventListenersMap[event];
      if (eventListeners == null) return;
      eventListeners.forEach((callback) => callback(args[0]));
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
      return unsubscribe;
    },
  };

  return eventBus;
}

export { createUseEventBus } from './hook';
