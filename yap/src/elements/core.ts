import { MaybeSignal, createEffect, get } from "$yap/signals";

export type YapElement = (parent: HTMLElement) => () => void;

export function addClassAndId(
  element: HTMLElement,
  className: MaybeSignal<string | undefined>,
  id: MaybeSignal<string | undefined>,
) {
  const removeIdEffect = createEffect(() => (element.id = get(id) ?? ""));
  const removeClassNameEffect = createEffect(
    () => (element.className = get(className) ?? ""),
  );
  return () => {
    removeIdEffect();
    removeClassNameEffect();
  };
}

export function renderChildren(parent: HTMLElement, children: YapElement[]) {
  const childrenEffects: (() => void)[] = [];

  for (const child of children) {
    childrenEffects.push(child(parent));
  }

  return () => {
    for (const removeChild of childrenEffects) {
      removeChild();
    }
  };
}
