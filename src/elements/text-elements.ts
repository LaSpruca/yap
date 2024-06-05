import { MaybeSignal, get, createEffect } from "$yap/signals";
import { addClassAndId } from "./core";

export function text(text: MaybeSignal<string>) {
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
