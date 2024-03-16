import {
  ArrowPathRoundedSquareIcon,
  CodeBracketSquareIcon,
  HashtagIcon
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { BaseEdge, EdgeProps, getSmoothStepPath } from "reactflow";

// export default function CustomEdge() {
export const DefaultEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition
}) => {
  let options = [
    {
      key: "loop",
      label: "Loop",
      icon: <ArrowPathRoundedSquareIcon className="h-5 w-5 text-gray-400" />
    },
    {
      key: "ifcondition",
      label: "If Condidion",
      icon: <HashtagIcon className="h-5 w-5 text-gray-400" />
    },
    {
      key: "block",
      label: "Block",
      icon: <CodeBracketSquareIcon className="h-5 w-5 text-gray-400" />
    }
  ];
  const [open, setOpen] = useState(false);
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY
    // sourcePosition,
    // targetPosition
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ backgroundColor: "black" }} />
      {/* <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: "all"
          }}
          className="nodrag nopan"
        >
          <Listbox>
            <Listbox.Button
              className="relative rounded-full p-1 text-blue-600 shadow-sm hover:shadow-md bg-white font-bold"
              onMouseOver={() => setOpen(true)}
              onMouseOut={() => setOpen(false)}
            >
              <PlusIcon
                width="20"
                height="20"
                className="self-center px-auto"
              />
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                onMouseOver={() => setOpen(true)}
                onMouseOut={() => setOpen(false)}
                className={
                  "absolute z-10000 mt-1 max-h-56 w-40 -left-16 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                }
              >
                {options.map((item) => (
                  <Listbox.Option
                    key={item["key"]}
                    className={
                      "text-gray-900 relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                    }
                    value={item}
                  >
                    <div className="flex items-center">
                      {item["icon"]}
                      <span className="ml-3 block truncate">
                        {item["label"]}
                      </span>
                    </div>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        </div>
      </EdgeLabelRenderer> */}
    </>
  );
};
