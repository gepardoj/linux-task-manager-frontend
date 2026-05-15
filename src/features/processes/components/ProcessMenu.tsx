import { HTMLAttributes } from "preact";
import { AbstractPopup } from "../../../components/AbstractPopup";

const elements = [{ name: "Kill" }, { name: "Terminate" }];

export function ProcessMenu(
  params: HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean;
    pid: number;
    onClose: () => void;
  },
) {
  const { isOpen, onClose, pid, ...rest } = params;

  return (
    <AbstractPopup isOpen={isOpen} onClose={onClose} {...rest}>
      {elements.map((el, i) => (
        <button
          key={i}
          class="cursor-pointer text-left hover:bg-purple-400 rounded px-2 py-1"
          onClick={() => console.log(pid)}
        >
          {el.name}
        </button>
      ))}
    </AbstractPopup>
  );
}
