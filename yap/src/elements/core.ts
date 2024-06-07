import type { MaybeSignal } from "../signals";
import { createEffect, get } from "../signals";

export type YapElement = (parent: HTMLElement) => () => void;

export function addClassAndId(
  element: HTMLElement,
  className: MaybeSignal<string | undefined>,
  id: MaybeSignal<string | undefined>
) {
  const removeIdEffect = createEffect(() => (element.id = get(id) ?? ""));
  const removeClassNameEffect = createEffect(
    () => (element.className = get(className) ?? "")
  );
  return () => {
    removeIdEffect();
    removeClassNameEffect();
  };
}

export function renderChildren(
  parent: HTMLElement,
  children: YapElement[] | MaybeSignal<string>
) {
  if (Array.isArray(children)) {
    const childrenEffects: (() => void)[] = [];
    for (const child of children) {
      childrenEffects.push(child(parent));
    }

    return () => {
      for (const removeChild of childrenEffects) {
        removeChild();
      }
    };
  } else {
    return textNode(children)(parent);
  }
}

export function textNode(text: MaybeSignal<string>) {
  return (parent: HTMLElement) => {
    const element = document.createTextNode("");

    const destoryTextEffect = createEffect(() => {
      element.data = get(text);
    });
    parent.appendChild(element);

    return () => {
      destoryTextEffect();
      element.remove();
    };
  };
}
