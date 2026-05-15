import { HTMLAttributes } from "preact";
import { AbstractPopup } from "../../../components/AbstractPopup";
import { terminateProcess, killProcess } from "../api";

const elements = [
  { name: "Kill (forced)", action: killProcess },
  { name: "Terminate (safe)", action: terminateProcess },
];

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
          onClick={() => el.action(pid).then(onClose)}
        >
          {el.name}
        </button>
      ))}
    </AbstractPopup>
  );
}
