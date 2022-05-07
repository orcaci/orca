import React from "react";
import { Modal, Input, Button, Checkbox } from "antd";

import styles from "./profile.module.css";

export function CreateProfileModal(props: any) {
  const { onClose, onCreate, shouldIncludeCheckbox = false } = props;
  const [name, setName] = React.useState("");
  const [value, setValue] = React.useState("");
  const [isDefault, setDefault] = React.useState(false);

  function onSubmit() {
    onCreate({ name, value, isDefault });
  }

  return (
    <Modal
      title="Create profile"
      centered
      visible={true}
      footer={null}
      closable
      onCancel={onClose}
    >
      <div className={styles.inputcontainer}>
        <Input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      </div>
      <div className={styles.inputcontainer}>
        <Input placeholder="Value" onChange={(e) => setValue(e.target.value)} />
      </div>
      {shouldIncludeCheckbox && (
        <div className={styles.inputcontainer}>
          <Checkbox onChange={(e) => setDefault(e.target.checked)}>
            Is default
          </Checkbox>
        </div>
      )}
      <div className={styles.buttoncontainer}>
        <Button type="primary" onClick={onSubmit}>
          Create
        </Button>
      </div>
    </Modal>
  );
}
