// import { ReadOnlyTable } from "./v1";
import { ReadOnlyTable, ReadOnlyTable as ReadOnlyTableV2 } from "./v2";

export interface ColumnField {
  key: string;
  label: string;
  render?: (value: any, record: any, index?: number) => React.ReactNode;
  isHeadCell?: boolean;
  className?: string;
}

interface ReadOnlyTableProps {
  column: Array<ColumnField>;
  data: Array<any>;
  actions?: Array<any>;
  isEditable?: boolean;
  addColumn?: boolean;
  footer?: React.ReactNode;
  title?: string;
  desc?: string;
  onCreate?: () => {};
  extra?: Array<React.ReactNode>;
}

export { ReadOnlyTable, ReadOnlyTableV2 };
export type { ReadOnlyTableProps };
