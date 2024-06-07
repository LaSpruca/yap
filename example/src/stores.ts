import { createEffect, createStore } from "yap";

export type TeleformAnswer = "a" | "b" | "c" | "d" | "e";

export type Teleform = {
  name: string;
  items: (TeleformAnswer | undefined)[];
  answers: (TeleformAnswer | undefined)[];
};

export const currentTeleform = createStore<Teleform | undefined>(undefined);
createEffect(() => {
  const teleform = currentTeleform();
  if (teleform) {
    localStorage.setItem(teleform.name, JSON.stringify(teleform));
  }
});

export const teleforms = createStore<string[]>(
  JSON.parse(localStorage.getItem("teleforms") ?? "[]"),
);
createEffect(() => {
  localStorage.setItem("teleforms", JSON.stringify(teleforms()));
});

export function setTeleform(name: string) {
  currentTeleform(
    JSON.parse(
      localStorage.getItem(name) ??
        `{ \"name\": ${JSON.stringify(name)}, items: [], answers: [] }`,
    ),
  );
}
