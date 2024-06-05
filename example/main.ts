import "./style.css";
import {
  conditions,
  div,
  input,
  text,
  MaybeSignal,
  createStore,
  get,
  forEach,
} from "$yap";

const Windows32 = (name: MaybeSignal<string>) =>
  text(() => "Hello " + get(name));

const FormElement = () => {
  const name = createStore("");

  return div(
    [
      text("Hello, what is your name"),
      input({
        type: "text",
        onInput() {
          name(this.value);
        },
        class: "input",
      }),
      conditions(
        [
          [() => name() == "a", text("A")],
          [() => name() == "aab", text("AAB")],
          [() => name() == "aa", text("AA")],
        ],
        Windows32(name),
      ),
    ],
    { class: "" },
  );
};

const Root = () => {
  let things = Array(5).map((_, i) => i);

  return forEach(
    things,
    () => FormElement(),
    (_, i) => `${i}`,
  );
};

Root()(document.getElementById("app")!);
