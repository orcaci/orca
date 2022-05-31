import { useEffect, useMemo, useRef } from "react";
import Editor from "jsoneditor";
import { nanoid } from "nanoid";
import debounce from "lodash/debounce";

import "jsoneditor/dist/jsoneditor.css";

export function JSONEditor(props: any) {
  const { json = {}, className, onChange } = props;

  const uniqueElementId = useMemo(() => nanoid(), []);
  const editorRef = useRef<any>(null);

  useEffect(function initEditor() {
    const element = document.getElementById(uniqueElementId) as any;
    editorRef.current = new Editor(element, {
      mode: "code",
      onError: function (err) {
        alert(err.toString());
      },
      onChangeText: debounce((text: string) => {
        onChange(text);
      }, 1000),
      mainMenuBar: false
    });

    editorRef.current.set(json);
  }, []);

  useEffect(
    function updateEditor() {
      editorRef.current.update(json);
    },
    [json]
  );

  return <div id={uniqueElementId} className={className} />;
}
