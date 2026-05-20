import { IHeader } from "@/abstract/IHeader";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ITableState {
  visibleColumns: IHeader[];
  setVisibleColumns: (columns: IHeader[]) => void;
}

export const createTableStore = (
  tableStoreName: string,
  initialHeaders: IHeader[],
) =>
  create<ITableState>()(
    persist(
      (set) => ({
        visibleColumns: initialHeaders,
        setVisibleColumns: (columns: IHeader[]) =>
          set({ visibleColumns: columns }),
      }),
      {
        name: tableStoreName,
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );
