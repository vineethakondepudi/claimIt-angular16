export interface TableColumn {
  label: string;
  name: string;
  type: "text" | "number" | "boolean" | "date" | "image" | "action" | "qrcode";
  isSortable?: boolean;
  position?: "right" | "left";
  isChecked: boolean;
  index: number;
}
