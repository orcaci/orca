import React, { MouseEvent, ChangeEvent } from "react";

import { Modal, Button, Input } from "antd";

import style from "./datatable.module.css";

interface ModalProps {
  handleColumnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleOnSubmit: (event: MouseEvent<HTMLElement>) => void;
  showModal: (event: MouseEvent<HTMLElement>) => void;
  isModalVisible: boolean;
  handleCancel: (event: MouseEvent<HTMLElement>) => void;
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
        key="cancel"
        onClick={(event: MouseEvent<HTMLElement>) => handleCancel(event)}
      >
        Cancel
      </Button>,
      <Button
        type="primary"
        key="add"
        onClick={(event: MouseEvent<HTMLElement>) => handleOnSubmit(event)}
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
        onClick={(event: MouseEvent<HTMLElement>) => showModal(event)}
      >
        +
      </Button>
      <Modal
        title="Column Name"
        visible={isModalVisible}
        onOk={(event: MouseEvent<HTMLElement>) => handleOnSubmit(event)}
        onCancel={(event: MouseEvent<HTMLElement>) => handleCancel(event)}
        footer={customFooter()}
      >
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleColumnChange(event)
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
