import type { YapElement } from "./core";
import type { MaybeSignal } from "../signals";
import { createEffect, get } from "../signals";

export function conditions(
  items: [MaybeSignal<boolean>, YapElement][],
  fallback: YapElement = () => () => {}
) {
  return (parent: HTMLElement) => {
    let ci = items.length;
    let unmount = fallback(parent);

    const removeListener = createEffect(() => {
      let renderPrevFallback = ci != items.length;

      if (ci < items.length && !get(items[ci][0])) {
        unmount();
        unmount = () => {};
        ci = items.length;
      }

      for (let i = 0; i < items.length; i++) {
        const [condition, renderElement] = items[i];
        if (get(condition) && i < ci) {
          unmount();
          unmount = renderElement(parent);
          ci = i;
        }
      }

      if (ci == items.length && renderPrevFallback) {
        unmount = fallback(parent);
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
  render: (item: T) => YapElement
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
          rendered.set(key, render(items[i])(parent));
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
