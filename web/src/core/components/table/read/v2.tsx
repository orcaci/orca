import { NotFound } from "assert/svg";
import { ColumnField, ReadOnlyTableProps } from ".";
import { Text } from "@radix-ui/themes";

export const ReadOnlyTable: React.FC<ReadOnlyTableProps> = ({
  column,
  data,
  footer,
  addColumn,
  extra,
  title = "",
  desc = "",
  ...restProps
}) => {
  return (
    <>
      <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
        <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border">
          <div className="flex items-center justify-between gap-8">
            <div>
              <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                {title}
              </h5>
              <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                <Text>{desc}</Text>
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
              {extra ? extra.map((item) => item) : ""}
            </div>
          </div>
        </div>
        <div className="p-0 px-0 overflow-scroll">
          <table className="w-full mt-4 text-left table-auto min-w-max">
            <thead>
              <tr>
                {column.map((item) => (
                  <th
                    key={item["key"]}
                    className="p-4 transition-colors cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 hover:bg-blue-gray-50"
                  >
                    <Text>{item["label"]}</Text>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((rowItem: any, index: number) => {
                  const isLast = index === rowItem.length - 1;
                  const classes = isLast
                    ? "p-2"
                    : "p-2 border-b border-blue-gray-50";
                  let id = rowItem["id"];
                  return (
                    <tr key={id}>
                      {column.map((colItem: ColumnField, index: number) => {
                        let childRender = rowItem[colItem.key];
                        if (colItem.render) {
                          childRender = colItem.render(childRender, rowItem);
                        }
                        return (
                          <td
                            key={`${id}-${index}`}
                            className={`${classes} ${colItem.className}`}
                          >
                            {childRender}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    key="nodata"
                    colSpan={column.length}
                    className="p-0 border-b border-blue-gray-50"
                  >
                    <div className="max-w-4xl mx-auto px-4 py-0 text-center">
                      <div className="flex justify-center items-center mx-auto mb-8">
                        <NotFound width={150} height={150} />
                      </div>

                      <h2 className="text-xl font-bold mb-4">
                        No Data Not Found
                      </h2>

                      <p className="text-gray-700 mb-4">
                        We couldn't find any data for your request. Please try
                        again later or contact support for assistance.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-4 border-t border-blue-gray-50">
          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
            Page 1 of 10
          </p>
          <div className="flex gap-2">
            <button
              className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Previous
            </button>
            <button
              className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
