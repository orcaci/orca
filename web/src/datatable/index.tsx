import React, { useState } from "react";
import { IColumnItems } from "../interface/datatable";
import { DataModal } from "./modal";
import { Button } from "antd";
import styles from "./datatable.module.css";
import { Input } from "antd";
export function DataTable() {
  const [rows, setRows] = useState<IColumnItems>([]);
  const [columnName, setColumnName] = useState<IColumnItems>("");
  const [initialColumns, setIntialColumns] = useState<IColumnItems>([
    { name: "S.NO" }
  ]);
  const [columns, setColumns] = useState<IColumnItems>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [columnError, setColumnError] = useState("");

  const showModal = () => {
    setColumnName("");
    setIsModalVisible(true);
    setColumnError("");
  };

  const handleAddRow = () => {
    let empty = {};
    setRows([...rows, empty]);
  };

  const handleAddColumn = () => {
    const item = {
      name: columnName
    };
    if (columnName.length > 0) {
      setIntialColumns([...initialColumns, item]);
      setColumns([...columns, item]);
      handleCancel();
      setColumnName("");
    }
    return;
  };

  const updateState = (e: React.ChangeEvent) => {
    let target = e.target.attributes as any;
    let prope = target.column.value;
    let index = target.index.value;
    let fieldValue = e.target.value as any;
    const tempObj = rows[index] as any;
    tempObj[prope] = fieldValue;
    rows[index] = tempObj;
    setRows(rows);
  };

  const postResults = () => {
    console.log(rows);
  };

  const handleColumnChange = (e) => {
    const name = e.target.value.toLowerCase();
    var nospecial = /^[^*|\":<>[\]{}`\\()';@&$=+]+$/;
    initialColumns.map((column) => {
      if (column.name !== name) {
        setColumnName(name);
        setColumnError("Duplicate column found");
      } else {
        setColumnError("");
      }
      return null;
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setColumnName("");
    setColumnError("");
  };

  const handleOnSubmit = () => {
    handleAddColumn();
  };

  return (
    <div>
      <div className="container">
        <div>
          <div>
            <div className={styles.columnHeader}>
              <table className={styles.customers}>
                <thead>
                  <tr>
                    {initialColumns.map((column, index) => (
                      <th
                        className={index !== 0 ? styles.initialHeader : ""}
                        key={index}
                      >
                        {column.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      {columns.map((column, index) => (
                        <td key={index}>
                          <Input
                            type="text"
                            column={column.name}
                            index={idx}
                            value={rows[idx][column]}
                            onChange={(e) => updateState(e)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {
                <DataModal
                  handleColumnChange={handleColumnChange}
                  handleOnSubmit={handleOnSubmit}
                  showModal={showModal}
                  isModalVisible={isModalVisible}
                  handleCancel={handleCancel}
                  columnName={columnName}
                  columnError={columnError}
                />
              }
            </div>
          </div>
          <Button onClick={handleAddRow} type="primary">
            +
          </Button>
          <div onClick={postResults}>save</div>
        </div>
      </div>
    </div>
  );
}
