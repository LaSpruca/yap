import { MaybeSignal } from "$yap/signals";
import { YapElement, addClassAndId, renderChildren } from "./core";

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
      options?.id,
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
