import { conditions, div } from "yap";
import "./style.css";
import { currentTeleform } from "./stores";
import teleform from "./components/teleform";
import selectTeleform from "./components/selectTeleform";

function root() {
  return div(
    [
      div(
        [
          conditions(
            [[() => currentTeleform() == undefined, selectTeleform()]],
            teleform(),
          ),
        ],
        {
          class: "max-w-4xl",
        },
      ),
    ],
    { class: "flex items-center justify-center p-10" },
  );
}

root()(document.getElementById("app")!);
