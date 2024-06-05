import {
  conditions,
  div,
  input,
  text,
  MaybeSignal,
  create_store,
  get,
} from "./lib/yap";

const windows32 = (name: MaybeSignal<string>) =>
  text(() => "Hello " + get(name));

const Root = () => {
  const name = create_store("");

  return div([
    text("Hello, what is your name"),
    input({
      type: "text",
      onInput() {
        name(this.value);
      },
    }),
    conditions(
      [
        [() => name() == "a", text("A")],
        [() => name() == "aab", text("AAB")],
        [() => name() == "aa", text("AA")],
      ],
      windows32(name),
    ),
  ]);
};

Root()(document.getElementById("app")!);
