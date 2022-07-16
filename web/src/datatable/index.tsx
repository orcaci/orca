import React, { useState, ChangeEvent } from "react";
import { Button, notification, Input } from "antd";
import { IColumnItems } from "../interface/datatable";
import { DataModal } from "./modal";
import styles from "./datatable.module.css";

export function DataTable() {
  const [rows, setRows] = useState<IColumnItems>([]);
  const [columnName, setColumnName] = useState("");
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
    const empty = {};
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

  const updateState = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target.attributes as any;
    const prope = target["data-column"].value;
    const index = target["data-index"].value;
    const fieldValue = e.target.value;
    const tempObj = rows[index] as any;
    tempObj[prope] = fieldValue;
    rows[index] = tempObj;
    setRows(rows);
  };

  const postResults = () => {
    let isToast = false;
    rows.map((each) => {
      const rowLength = Object.keys(each).length >= 1;
      if (!rowLength) {
        isToast = true;
      }
      return null;
    });

    if (isToast)
      notification.open({
        message: "Please updated atleast one cell in all rows"
      });
  };

  const handleColumnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value.toLowerCase();
    initialColumns.map((column) => {
      if (column.name === name) {
        setColumnError("Duplicate column found");
      } else {
        setColumnName(name);
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
    <React.Fragment>
      <div>
        <div className={styles.columnHeader}>
          <table className={styles.tableHead}>
            <thead>
              <tr>
                {initialColumns.map((column, index) => (
                  <th
                    className={index !== 0 && styles.initialHeader}
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
                        data-column={column.name}
                        data-index={idx}
                        value={rows.idx?.column}
                        onChange={updateState}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <DataModal
            handleColumnChange={handleColumnChange}
            handleOnSubmit={handleOnSubmit}
            showModal={showModal}
            isModalVisible={isModalVisible}
            handleCancel={handleCancel}
            columnName={columnName}
            columnError={columnError}
          />
        </div>
        <Button onClick={handleAddRow} type="primary">
          +
        </Button>
      </div>
      <Button
        onClick={postResults}
        type="primary"
        className={styles.saveButton}
      >
        Save
      </Button>
    </React.Fragment>
  );
}
