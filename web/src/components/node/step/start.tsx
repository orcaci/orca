import React, { useCallback } from "react";
import { Handle, Position } from "react-flow-renderer";



export const StartNode = () => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
  return (
    <div className="w-20 h-20 rounded-full flex justify-center items-center bg-lime-400 hover:text-sky-400">
      <p>start</p>
      <Handle type="source" position={Position.Right} id="_output" />
    </div>
  );
};
