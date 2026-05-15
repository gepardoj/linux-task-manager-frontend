import { HTMLAttributes } from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";

export function AbstractPopup(
  params: HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean;
    onClose: () => void;
    children: preact.ComponentChildren;
  },
) {
  const { isOpen, onClose, children, ...rest } = params;

  const divRef = useRef<HTMLDivElement>(null);

  const onCloseHandler = useCallback(() => {
    onClose();
    console.log("on close");
  }, [isOpen]);

  useEffect(() => {
    divRef.current?.addEventListener("click", onCloseHandler);
    return () => divRef.current?.removeEventListener("click", onCloseHandler);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={divRef}
      class="flex justify-center items-center w-screen h-screen absolute left-0 top-0 z-10 bg-purple-50/30"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex flex-col items-stretch gap-1 bg-purple-300 border-purple-500 rounded border-2 p-4 z-10 }`}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
}
