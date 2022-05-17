import React, { useState } from "react";
import { Modal, Button } from "antd";

interface ModalProps {
  handleColumnChange: any;
  handleOnSubmit: any;
  showModal: any;
  isModalVisible: any;
  handleCancel: any;
}

export const DataModal = (props: ModalProps) => {
  const {
    handleColumnChange,
    handleOnSubmit,
    showModal,
    isModalVisible,
    handleCancel
  } = props;

  return (
    <>
      <Button type="primary" onClick={showModal}>
        +
      </Button>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOnSubmit}
        onCancel={handleCancel}
      >
        <input onChange={handleColumnChange} />
      </Modal>
    </>
  );
};
