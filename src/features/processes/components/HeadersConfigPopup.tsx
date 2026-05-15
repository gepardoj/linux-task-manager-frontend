import { HTMLAttributes } from "preact";
import { Dispatch, StateUpdater } from "preact/hooks";
import { AbstractPopup } from "../../../components/AbstractPopup";
import { Header } from "./ProcessesTable";

type Element = Header; //{ name: string; enabled: boolean };

export const HeadersConfigPopup = (
  params: HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean;
    onClose: () => void;
    elementsState: [Element[], Dispatch<StateUpdater<Element[]>>];
  },
) => {
  const { elementsState, isOpen, onClose, ...rest } = params;
  const [elements, setElements] = elementsState;
  return (
    <AbstractPopup isOpen={isOpen} onClose={onClose} {...rest}>
      {elements.map((el, i) => (
        <div key={i} class="self-start">
          <input
            class="mr-2"
            type="checkbox"
            checked={el.visible}
            onChange={(e) => {
              const newElements = [...elements];
              newElements[i] = { ...el, visible: e.currentTarget.checked };
              setElements(newElements);
            }}
          />
          <label>{el.name}</label>
        </div>
      ))}
    </AbstractPopup>
  );
};
