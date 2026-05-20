import { IHeader } from "@/abstract/IHeader";
import { ProcessInfo } from "./Process";
import { createTableStore } from "@/stores/table.store";

export type Header = IHeader & { id: keyof ProcessInfo };

export const defaultHeaders: Header[] = [
  { id: "pid", name: "PID", order: "asc", visible: true },
  { id: "name", name: "Name", order: null, visible: true },
  { id: "cmdline", name: "Command Line", order: null, visible: true },
  { id: "memory", name: "Memory", order: null, visible: true },
];

export const useProcessesTableStore = createTableStore(
  "processes-table-store",
  defaultHeaders,
);
