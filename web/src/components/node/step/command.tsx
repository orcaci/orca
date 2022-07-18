import React, { useState, useCallback } from "react";
import { ArrowsExpandIcon } from "@heroicons/react/outline";
import { Handle, Position } from "react-flow-renderer";


const command = "click";
const value = "\\id=summit";
const desc = "Set Password";

export const CommandNode = () => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="bg-sky-400 p-4">
      <Handle type="target" position={Position.Left} id="_input" />
      <ArrowsExpandIcon
        className="h-4 w-4"
        aria-hidden="true"
        onClick={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="flex flex-col">
          Command : <input value={command} />
          Value : <input value={value} />
          Description : <input value={desc || ""} />
        </div>
      )}
      {!isExpanded && (desc ? desc : `${command} ( ${value} )`)}
      <Handle type="source" position={Position.Right} id="_output" />
    </div>
  );
};
