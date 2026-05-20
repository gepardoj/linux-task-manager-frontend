export interface IHeader {
  id: string;
  name: string;
  visible: boolean;
  order: "asc" | "desc" | null;
}
