import { HTMLAttributes } from "preact";
import { Dispatch, StateUpdater } from "preact/hooks";
import { Header } from "../pages/Home";

type Element = Header; //{ name: string; enabled: boolean };

export const Popup = (
  params: HTMLAttributes<HTMLDivElement> & {
    display: boolean;
    elementsState: [Element[], Dispatch<StateUpdater<Element[]>>];
  },
) => {
  const { elementsState, display, ...rest } = params;
  const [elements, setElements] = elementsState;
  return (
    <div
      className={`flex flex-col items-start gap-1 bg-purple-300 border-purple-500 rounded border-2 p-4 z-10 absolute ${display ? "block" : "hidden"}`}
      {...rest}
    >
      {elements.map((el, i) => (
        <div key={i}>
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
    </div>
  );
};
