import React, { MouseEvent, ChangeEvent } from "react";

import { Modal, Button, Input } from "antd";

import style from "./datatable.module.css";

interface ModalProps {
  handleColumnChange: Function;
  handleOnSubmit: Function;
  showModal: Function;
  isModalVisible: boolean;
  handleCancel: Function;
  columnName: string;
  columnError: string;
}

export const DataModal = (props: ModalProps) => {
  const {
    handleColumnChange,
    handleOnSubmit,
    showModal,
    isModalVisible,
    handleCancel,
    columnName,
    columnError
  } = props;

  const customFooter = () => {
    return [
      <Button
        type="primary"
        onClick={(event: MouseEvent<HTMLElement>) => handleCancel}
      >
        Cancel
      </Button>,
      <Button
        type="primary"
        onClick={(event: MouseEvent<HTMLElement>) => handleOnSubmit}
        disabled={columnError.length >= 1}
      >
        Add
      </Button>
    ];
  };

  return (
    <React.Fragment>
      <Button
        type="primary"
        onClick={(event: MouseEvent<HTMLElement>) => showModal}
      >
        +
      </Button>
      <Modal
        title="Column Name"
        visible={isModalVisible}
        onOk={(event: MouseEvent<HTMLElement>) => handleOnSubmit}
        onCancel={(event: MouseEvent<HTMLElement>) => handleCancel}
        footer={customFooter()}
      >
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleColumnChange
          }
          value={columnName}
        />
        {columnError.length >= 1 && (
          <p className={style.columnError}>{columnError}</p>
        )}
      </Modal>
    </React.Fragment>
  );
};
