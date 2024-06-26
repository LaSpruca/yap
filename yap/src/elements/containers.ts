import type { MaybeSignal } from "../signals";
import type { YapElement } from "./core";
import { addClassAndId, renderChildren } from "./core";

export type DivProps = {
  class?: MaybeSignal<string>;
  id?: MaybeSignal<string>;
};

export function div(children: YapElement[], options?: DivProps) {
  return (parent: HTMLElement) => {
    const element = document.createElement("div");
    const removeStyleStuff = addClassAndId(
      element,
      options?.["class"],
      options?.id
    );
    const removeChildren = renderChildren(element, children);
    parent.appendChild(element);

    return () => {
      removeChildren();
      removeStyleStuff();
      element.remove();
    };
  };
}

export function fragment(children: YapElement[]) {
  return (parent: HTMLElement) => {
    const remove = children.map((child) => child(parent));
    return () => remove.forEach((fn) => fn());
  };
}
