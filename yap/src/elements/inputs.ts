import { MaybeSignal } from "$yap/signals";
import { YapElement, addClassAndId, renderChildren } from "./core";

export type InputProps = {
  onInput: (this: HTMLInputElement, ev: Event) => any;
  type: HTMLInputElement["type"];
  id?: MaybeSignal<string>;
  class?: MaybeSignal<string>;
};

export function input({ onInput, type, class: className, id }: InputProps) {
  return (parent: HTMLElement) => {
    const element = document.createElement("input");
    element.type = type;
    element.addEventListener("input", onInput);
    const removeStyleEffects = addClassAndId(element, className, id);

    parent.appendChild(element);

    return () => {
      removeStyleEffects();
      element.remove();
    };
  };
}

export type ButtonProps = {
  class?: MaybeSignal<string>;
  id?: MaybeSignal<string>;
  onClick?: (this: HTMLButtonElement, event: MouseEvent) => void;
};

export function button(
  children: MaybeSignal<string> | YapElement[],
  { class: className, id, onClick }: ButtonProps = {},
) {
  return (parent: HTMLElement) => {
    const element = document.createElement("button");
    if (onClick) {
      element.addEventListener("click", onClick);
    }

    const removeClasses = addClassAndId(element, className, id);
    const remove = renderChildren(element, children);
    parent.appendChild(element);

    return () => {
      remove();
      removeClasses();
      element.remove();
    };
  };
}
