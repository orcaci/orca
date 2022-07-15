import React, { useState } from "react";
import { ArrowsExpandIcon } from "@heroicons/react/outline";

const command = "click";
const value = "\\id=summit";
const desc = "Set Password";

export const CommandNode = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="bg-sky-400 p-4">
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
    </div>
  );
};
