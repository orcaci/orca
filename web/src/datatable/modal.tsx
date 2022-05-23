import { Modal, Button, Input } from "antd";

import style from "./datatable.module.css";

interface ModalProps {
  handleColumnChange: any;
  handleOnSubmit: any;
  showModal: any;
  isModalVisible: any;
  handleCancel: any;
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
      <Button type="primary" onClick={handleCancel}>
        Cancel
      </Button>,
      <Button
        type="primary"
        onClick={handleOnSubmit}
        disabled={columnError.length >= 1}
      >
        Add
      </Button>
    ];
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        +
      </Button>
      <Modal
        title="Column Name"
        visible={isModalVisible}
        onOk={handleOnSubmit}
        onCancel={handleCancel}
        footer={customFooter()}
      >
        <Input onChange={handleColumnChange} value={columnName} />
        {columnError.length >= 1 && (
          <p className={style.columnError}>{columnError}</p>
        )}
      </Modal>
    </>
  );
};
