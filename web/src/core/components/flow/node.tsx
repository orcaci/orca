import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { NodeProps } from "reactflow";

export type CounterData = {
  initialCount?: number;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const handleStyle = { left: 10 };

export const StartNode: React.FC<NodeProps<CounterData>> = ({
  data,
  isConnectable,
  ...restProps
}) => {
  const [count, setCount] = useState(data?.initialCount ?? 0);

  return (
    <button className="relative rounded-full p-1 text-green-700 hover:text-green-900 border-2">
      <ArrowDownCircleIcon
        width="25"
        height="25"
        className="self-center px-auto"
      />
    </button>
  );
};
