export function store<T>(value: T) {
  let state = value;

  const subscribers = new Set<(value: T) => void>();

  const get = () => state;
  const set = (value: T) => {
    state = value;
    for (const callback of subscribers) {
      callback(value);
    }
  };
  const subscribe = (callback: (value: T | undefined) => void) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  };

  return { get, set, subscribe };
}
