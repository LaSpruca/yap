import { button, div, forEach, h2, untracked } from "yap";
import { currentTeleform, setTeleform, teleforms } from "../stores";

export default function selectTeleform() {
  return div(
    [
      forEach(
        teleforms,
        (name) => name,
        (teleform) =>
          div(
            [
              div(
                [
                  h2(teleform, { class: "card-title" }),
                  div(
                    [
                      button("Goto", {
                        class: "btn btn-primary",
                        onClick: () => {
                          setTeleform(teleform);
                        },
                      }),
                    ],
                    {
                      class: "card-actions justify-end",
                    },
                  ),
                ],
                { class: "card-body items-center text-center" },
              ),
            ],
            { class: "card w-96 bg-neutral text-neutral-content" },
          ),
      ),
      button("Create new", {
        class: "btn",
        onClick: () => {
          const name = prompt("Enter name for teleform");
          if (!name) {
            return;
          }

          const tels = untracked(() => teleforms());
          tels.push(name);
          teleforms(tels);

          currentTeleform({
            name,
            items: [],
            answers: [],
          });
        },
      }),
    ],
    {
      class: "flex flex-row flex-wrap items-center justify-center gap-10",
    },
  );
}
