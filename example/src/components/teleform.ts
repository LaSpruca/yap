import {
  CallableStore,
  button,
  createEffect,
  createStore,
  div,
  forEach,
  fragment,
  h1,
  p,
} from "yap";
import { TeleformAnswer, currentTeleform, teleforms } from "../stores";
import { untracked } from "yap";

export default function teleform() {
  const name = () => currentTeleform()!.name;
  const answers = () => currentTeleform()!.answers;
  const items = createStore(
    (currentTeleform()?.items ?? []).map((item) => createStore(item)),
  );
  const showAnswers = createStore(false);

  const answerButton = (
    index: number,
    item: CallableStore<TeleformAnswer | undefined>,
    value: TeleformAnswer,
  ) => {
    const answer = () => answers()[index];
    return button(value.toUpperCase(), {
      class: () =>
        "btn " +
        (item() == value
          ? answer()
            ? answer() == value
              ? "btn-success"
              : "btn-error"
            : "btn-primary"
          : ""),
      onClick: () => {
        if (item() == value) {
          item(undefined);
        } else {
          item(value);
        }
      },
    });
  };

  const itemSyncEffect = createEffect(() => {
    let current = untracked(() => currentTeleform())!;
    if (current) {
      current.items = items().map((item) => item());
      currentTeleform(current);
    }
  });

  const addRows = () => {
    const s_nRows = prompt("How many rows should be added?");
    const nRows = s_nRows ? parseInt(s_nRows) : undefined;
    if (!nRows || isNaN(nRows)) {
      alert("Invalid input for number of rows");
      return;
    }

    const currentItems = items();

    items(
      currentItems.concat([...Array(nRows)].map(() => createStore(undefined))),
    );

    itemSyncEffect.sync();
  };

  const loadAnswers = () => {
    const answers = prompt("Enter CSV seperated answers here");
    if (!answers) {
      alert("No answers provided");
      return;
    }

    try {
      const current = currentTeleform()!;

      current.answers = answers.split(",").map((maybeAnswer, index) => {
        const answer = maybeAnswer.toLowerCase().trim();
        if (
          answer == "a" ||
          answer == "b" ||
          answer == "c" ||
          answer == "d" ||
          answer == "e"
        ) {
          return answer;
        }

        alert("Answer " + index + " is invalid");
        throw new Error();
      });

      currentTeleform(current);
    } catch (ex) {}
  };

  const toggleAnswers = () => {
    showAnswers(!showAnswers());
  };

  const goBack = () => {
    currentTeleform(undefined);
  };

  const remove = () => {
    itemSyncEffect();

    const allTeleforms = teleforms();
    allTeleforms.splice(allTeleforms.indexOf(name()), 1);
    teleforms(allTeleforms);
    localStorage.removeItem(name());
    currentTeleform(undefined);
  };

  return (parent: HTMLElement) => {
    const unmount = fragment([
      h1(name, { class: "pb-10 text-center text-2xl font-bold" }),
      div(
        [
          div(
            [
              forEach(
                items,
                (_, index) => "" + index,
                (item, index) =>
                  fragment([
                    p(`${index + 1}`),
                    answerButton(index, item, "a"),
                    answerButton(index, item, "b"),
                    answerButton(index, item, "c"),
                    answerButton(index, item, "d"),
                    answerButton(index, item, "e"),
                    button("Remove", {
                      class: "btn btn-error",
                      onClick: () => {
                        const x = items();
                        x.splice(index, 1);
                        items(x);
                      },
                    }),
                  ]),
              ),
            ],
            { class: "max-full grid grid-cols-7 gap-4" },
          ),
          div(
            [
              button("Add Rows", {
                class: "btn btn-primary",
                onClick: addRows,
              }),
              button("Load Answers", { class: "btn", onClick: loadAnswers }),
              button("Toggle Answers", {
                class: "btn btn-success",
                onClick: toggleAnswers,
              }),
              button("Go Back", { class: "btn", onClick: goBack }),
              button("Remove", { class: "btn btn-error", onClick: remove }),
            ],
            {
              class: "flex w-full items-center justify-around",
            },
          ),
        ],
        {
          class: "flex flex-col items-center justify-center gap-5",
        },
      ),
    ])(parent);

    return () => {
      unmount();
      itemSyncEffect();
    };
  };
}
