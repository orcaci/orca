import React, { useCallback } from "react";
import { Handle, Position } from "react-flow-renderer";


export const EndNode = () => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
  return (
    <div className="w-20 h-20 rounded-full flex justify-center items-center bg-red-700 text-white-400 hover:text-sky-400">
      <Handle type="target" position={Position.Left} id="a" />
      <p>End</p>
    </div>
  );
};
