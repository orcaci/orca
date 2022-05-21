export interface IColumn {
  name?: String;
  columnName?: String;
  description?: String;
  column?: String;
}

export interface IColumnItems extends Array<IColumn> {
  [idx: string]: any;
}
