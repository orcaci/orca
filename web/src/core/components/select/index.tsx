import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface SelectProps {
  label?: string;
  className?: string;
  buttonClassName?: string;
  optionClassName?: string;
  placeholder?: string;
  dataIndex?: string;
  options: Array<any>;
  defaultValue?: any;
  render?: (row: any) => React.ReactNode;
  onSelect?: (value: any) => void;
  onChange?: (value: any) => {};
}
export const Select: React.FC<SelectProps> = ({
  label,
  options,
  defaultValue,
  className = "relative",
  buttonClassName = "relative w-full cursor-default rounded-md ring-gray-300 shadow-sm ring-1 bg-transparent py-1.5 pl-3 pr-10 text-left text-gray-900  ring-inset  focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6",
  optionClassName = "absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
  placeholder,
  dataIndex = "key",
  render,
  onSelect,
  ...restProps
}) => {
  let initValue = {};
  options.map((item) => {
    if (defaultValue == item[dataIndex]) {
      initValue = item;
    }
  });
  const [selected, setValueSelected] = useState(initValue as any);

  const setSelected = (value: any) => {
    setValueSelected(value);
    if (onSelect != undefined) {
      onSelect(value);
    }
  };

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          {label ? (
            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
              {label}
            </Listbox.Label>
          ) : (
            ""
          )}

          <div className={className}>
            <Listbox.Button className={buttonClassName}>
              <span className="flex items-center min-h-7">
                {render ? (
                  render(selected)
                ) : (
                  <>
                    <span className="ml-3 block truncate">
                      {selected["label"]}
                    </span>
                  </>
                )}
              </span>

              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className={optionClassName}>
                {options.map((item) => {
                  return (
                    <Listbox.Option
                      key={item[dataIndex]}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-indigo-600 text-white" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={item}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            {render ? (
                              render(item)
                            ) : (
                              <span
                                className={classNames("ml-3 block truncate")}
                              >
                                {item["label"]}
                              </span>
                            )}
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};
