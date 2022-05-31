import { Fragment, useRef, useState } from "react";
import { Button, Upload } from "antd";
import isEqual from "lodash/isEqual";

import { JSONEditor } from "../components/json_editor";

import styles from "./suite.module.css";

interface File {
  name: string;
  size: number;
  type: string;
  text?: string;
}

export function TestSuite() {
  const [file, setFile] = useState<File>({
    name: "",
    size: 0,
    type: "",
    text: ""
  });
  const fileText = useRef("");

  function onFileSelect(file: any) {
    const { name, size, type } = file;
    setFile({ name, size, type });
    file
      .text()
      .then((text: string) => {
        fileText.current = text;
        setFile((state: File) => ({ ...state, text }));
      })
      .catch((err: any) => console.log(err));
    return false;
  }

  function onJsonChange(text: string) {
    setFile((state: File) => ({ ...state, text }));
  }

  function isJSONsEqual() {
    return isEqual(
      JSON.parse((file.text as any) || "{}"),
      JSON.parse(fileText.current || "{}")
    );
  }

  return (
    <div className={styles.suitecontainer}>
      <Upload
        accept=".json"
        maxCount={1}
        beforeUpload={onFileSelect}
        showUploadList={false}
      >
        <Button>Upload test case</Button>
      </Upload>
      {file && (
        <Fragment>
          <div className={styles.filename}>{file.name}</div>
          {file.text && (
            <JSONEditor
              json={JSON.parse(file.text)}
              className={styles.editor}
              onChange={onJsonChange}
            />
          )}
        </Fragment>
      )}
      {!isJSONsEqual() && file.text && (
        <div className={styles.footerbutton}>
          <Button type="primary">Run & submit</Button>
        </div>
      )}
    </div>
  );
}
