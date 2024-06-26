import type { MaybeSignal } from "../signals";
import type { YapElement } from "./core";
import { addClassAndId, renderChildren } from "./core";

export type TextElementProps = {
  class?: MaybeSignal<string>;
  id?: MaybeSignal<string>;
};
export function h1(
  children: YapElement[] | MaybeSignal<string>,
  { id, class: className }: TextElementProps = {}
) {
  return (parent: HTMLElement) => {
    const element = document.createElement("h1");
    const removeClasses = addClassAndId(element, className, id);

    let remove = renderChildren(element, children);

    parent.appendChild(element);

    return () => {
      remove();
      removeClasses();
      element.remove();
    };
  };
}

export function h2(
  children: YapElement[] | MaybeSignal<string>,
  { id, class: className }: TextElementProps = {}
) {
  return (parent: HTMLElement) => {
    const element = document.createElement("h2");
    const removeClasses = addClassAndId(element, className, id);

    let remove = renderChildren(element, children);

    parent.appendChild(element);

    return () => {
      remove();
      removeClasses();
      element.remove();
    };
  };
}

export function p(
  children: YapElement[] | MaybeSignal<string>,
  { id, class: className }: TextElementProps = {}
) {
  return (parent: HTMLElement) => {
    const element = document.createElement("p");
    const removeClasses = addClassAndId(element, className, id);

    let remove = renderChildren(element, children);

    parent.appendChild(element);

    return () => {
      remove();
      removeClasses();
      element.remove();
    };
  };
}
