import type { YapElement } from "./core";
import type { MaybeSignal } from "../signals";
import { createEffect, get } from "../signals";

export function conditions(
  items: [MaybeSignal<boolean>, YapElement][],
  fallback: YapElement = () => () => {},
) {
  return (parent: HTMLElement) => {
    let ci = items.length;
    let fallbackRendered = false;
    let unmount = () => {};

    const removeListener = createEffect(() => {
      const firstTrue = items
        .map(([condition]) => get(condition))
        .findIndex((condition) => condition);

      const current = fallbackRendered ? get(items[ci][0]) : false;

      if (firstTrue == -1) {
        if (!fallbackRendered) {
          unmount();
          unmount = fallback(parent);
          fallbackRendered = true;
        }
      } else if (firstTrue < ci || !current) {
        unmount();
        unmount = items[firstTrue][1](parent);
        ci = firstTrue;
        fallbackRendered = false;
      }
    });

    return () => {
      unmount();
      removeListener();
    };
  };
}

export function forEach<T>(
  itemsSignal: MaybeSignal<T[]>,
  extractKey: (item: T, index: number) => string,
  render: (item: T, index: number) => YapElement,
) {
  return (parent: HTMLElement) => {
    let rendered: Map<string, () => void> = new Map();

    const cleanUp = createEffect(() => {
      const items = get(itemsSignal);
      const keys = new Set();

      for (let i = 0; i < items.length; i++) {
        const key = extractKey(items[i], i);
        keys.add(key);
        if (!rendered.has(key)) {
          rendered.set(key, render(items[i], i)(parent));
        }
      }

      for (const key of rendered.keys()) {
        if (keys.has(key)) {
          continue;
        }

        rendered.get(key)!();
      }
    });

    return () => {
      cleanUp();
      for (const [_, remove] of rendered.entries()) {
        remove();
      }
    };
  };
}
