import { PencilIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@radix-ui/themes";
import React from "react";

export interface ColumnField {
  key: string;
  label: string;
  render?: (value: any, record: any, index?: number) => React.ReactNode;
  isHeadCell?: boolean;
  className?: string;
}

interface TableProps {
  className?: string;
  column?: Array<ColumnField>;
  data?: Array<any>;
  addColumn?: () => void;
  addRow?: () => void;
}

const EditableTable: React.FC<TableProps> = ({
  column = [],
  data = [],
  addColumn,
  addRow,
  className = "mx-auto p-4 overflow-y-visible",
  ...restProps
}) => {
  return (
    <div className={className}>
      <table className="w-full h-full border rounded-lg overflow-x-hidden overflow-y-visible ">
        <thead className="bg-indigo-700 text-white">
          <tr>
            {column.map((item, index) => (
              <th key={item["key"]} className="py-2 px-4 border">
                {item["label"]}
              </th>
            ))}
            {addColumn != undefined ? (
              <th className="p-2 border">
                <div className="flex gap-4">
                  <IconButton
                    className="cursor-pointer bg-transparent"
                    onClick={() => addColumn()}
                  >
                    <PencilIcon width="18" height="18" />
                  </IconButton>
                </div>
              </th>
            ) : (
              ""
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={
                rowIndex % 2 === 0 ? "bg-indigo-50/50" : "bg-sky-50/50"
              }
            >
              {column.map((col, colIndex) =>
                col.render != undefined ? (
                  <td key={colIndex} className={col.className}>
                    {col.render(row[col.key], row, rowIndex)}
                  </td>
                ) : (
                  <td key={colIndex} className="p-0 border">
                    row[col.key]
                  </td>
                )
              )}
            </tr>
          ))}
          <tr>
            <td
              key="footer"
              colSpan={column.length + 1}
              className="p-3 border "
            >
              <div className="flex">
                <button
                  onClick={addRow}
                  className="p-2 text-green-500 bg-green-200 hover:bg-green-300 rounded"
                >
                  Add Row
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EditableTable;
