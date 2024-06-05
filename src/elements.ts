import { MaybeSignal, create_effect, get } from "./yap";

type YapElement = (parent: HTMLElement) => () => void;

export type DivProps = {};

export function div(children: YapElement[], options?: DivProps) {
  return (parent: HTMLElement) => {
    const element = document.createElement("div");

    const childrenEffects: (() => void)[] = [];

    for (const child of children) {
      childrenEffects.push(child(element));
    }

    parent.appendChild(element);

    return () => {
      for (const removeChild of childrenEffects) {
        removeChild();
      }
      element.remove();
    };
  };
}

export function conditions(
  items: [MaybeSignal<boolean>, YapElement][],
  fallback: YapElement = () => () => {},
) {
  return (parent: HTMLElement) => {
    let ci = items.length;
    let unmount = fallback(parent);

    const removeListener = create_effect(() => {
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

export function text(text: MaybeSignal<string>) {
  return (parent: HTMLElement) => {
    const element = document.createTextNode("");

    const destoryTextEffect = create_effect(() => {
      element.data = get(text);
    });
    parent.appendChild(element);

    return () => {
      destoryTextEffect();
      element.remove();
    };
  };
}

export type InputProps = {
  onInput: (this: HTMLInputElement, ev: Event) => any;
  type: HTMLInputElement["type"];
};

export function input({ onInput, type }: InputProps) {
  return (parent: HTMLElement) => {
    const element = document.createElement("input");
    element.type = type;
    element.addEventListener("input", onInput);

    parent.appendChild(element);

    return () => {
      element.remove();
    };
  };
}
