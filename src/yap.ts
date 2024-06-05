export type MaybeSignal<T> = T | Signal<T> | (() => T);

const YAP_STORE = Symbol("Yap Store");

export type Signal<T> = {
  createListener(listener: (arg0: T) => void): void;
  removeListener(listener: (arg0: T) => void): void;
  [YAP_STORE]: true;

  get(): T;
};

export type CallableSignal<T> = () => T;

export type Store<T> = {
  set(value: T): void;
} & Signal<T>;

export type CallableStore<T> = Store<T> &
  CallableSignal<T> & {
    (value: T): void;
  };

let globalTable: Store<unknown>[] | undefined;

export function create_store<T>(initial: T): CallableStore<T> {
  const value = {
    [YAP_STORE]: true as const,
    currentValue: initial,
    listeners: [] as ((newValue: T) => void)[],

    createListener(listener: (arg0: T) => void) {
      this.listeners.push(listener);
    },

    removeListener(listener: (arg0: T) => void) {
      this.listeners.splice(this.listeners.indexOf(listener), 1);
    },

    get() {
      if (globalTable) {
        globalTable.push(this);
      }

      return this.currentValue;
    },

    set(newValue: T) {
      this.currentValue = newValue;
      this.listeners.forEach((listner) => listner(this.currentValue));
    },
  };

  return Object.assign(
    (maybeValue: T | undefined = undefined) => {
      if (maybeValue) {
        value.set(maybeValue);
      }

      return value.get();
    },
    {
      ...value,
    },
  );
}

export function create_effect(fn: () => void) {
  const currentTable: Store<unknown>[] = [];
  globalTable = currentTable;

  fn();

  globalTable = undefined;

  for (const item of currentTable) {
    item.createListener(fn);
  }

  return () => {
    for (const item of currentTable) {
      item.removeListener(fn);
    }
  };
}

function isSignal<T>(val: T | Signal<T>): val is Signal<T> {
  return (val as Signal<T>)[YAP_STORE];
}

export function get<T>(item: MaybeSignal<T>) {
  return item instanceof Function ? item() : isSignal(item) ? item.get() : item;
}
