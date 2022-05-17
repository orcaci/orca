import React, { useState } from "react";
import { IColumnItems } from "../interface/datatable";
import { DataModal } from "./modal";
import styles from "./datatable.module.css";

export function DataTable() {
  const [rows, setRows] = useState<IColumnItems>([]);
  const [columnName, setColumnName] = useState<IColumnItems>("");
  const [initialColumns, setIntialColumns] = useState<IColumnItems>([
    { name: "S.NO" }
  ]);
  const [columns, setColumns] = useState<IColumnItems>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
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
    }
    return;
  };

  const updateState = (e: React.ChangeEvent) => {
    let target = e.target.attributes as any;
    let prope = target.column.value;
    let index = (e.target.attributes as any).index.value;
    let fieldValue = target.value;
    const tempRows = rows as any;
    const tempObj = rows[index] as any;
    tempObj[prope] = fieldValue;

    tempRows[index] = tempObj;
    setRows(tempRows);
  };

  const postResults = () => {
    console.log(rows);
  };

  const handleColumnChange = (e) => {
    console.log(e.target.value, columns, "handleColumnChange");
    // columns.map((column) => {
    // if (column.name !== e.target.value) {
    setColumnName(e.target.value);
    // }
    // });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOnSubmit = () => {
    handleAddColumn();
  };

  return (
    <div>
      <div className="container">
        <div className="row clearfix">
          <div className="col-md-12 column">
            <table className="table table-bordered table-hover" id="tab_logic">
              <div className={styles.columnHeader}>
                <thead>
                  <tr>
                    {initialColumns.map((column, index) => (
                      <th className="text-center" key={index}>
                        {column.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                {
                  <DataModal
                    handleColumnChange={handleColumnChange}
                    handleOnSubmit={handleOnSubmit}
                    showModal={showModal}
                    isModalVisible={isModalVisible}
                    handleCancel={handleCancel}
                  />
                }
              </div>
              <tbody>
                {rows.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    {columns.map((column, index) => (
                      <td key={index}>
                        <input
                          type="text"
                          data-column={column.name}
                          data-index={idx}
                          className="form-control"
                          value={rows[idx][column]}
                          onChange={(e) => updateState(e)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleAddRow} className="btn btn-primary">
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
