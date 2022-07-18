import {ChevronLeftIcon, ChevronRightIcon, SelectorIcon} from "@heroicons/react/outline";

export interface ColumnInterface {
  key: string;
  name: string;
  width?: number;
  isResize?: boolean;
  isFilter?: boolean;
}

export interface DataTableInterface {
  column: Array<ColumnInterface>;
  source: Array<unknown>;
  defaultKey: string;
  loading?: boolean;
  defaultPageSize?: number;
  pageSizeOption?: Array<number>;
  fullSize?: number;
  onPageChange?: (pageNumber: number, limit: number) => void;
  newItem?: unknown;
  extra?: Array<unknown>;
}

export function Table(props: DataTableInterface) {
  const {
    source,
    column,
    // pageSizeOption = [10, 25, 50, 100],
    defaultPageSize = 10,
    // loading = false,
    fullSize,
    defaultKey,
    extra = []
  } = props;

  let size = fullSize
  const currentPage = 1;
  if (!size) size = source.length;
  return (
      <>
        <div className={"max-w-12xl mx-auto px-2 sm:px-6 lg:px-8"}>
          <div className="relative flex items-center justify-between h-10">
            <div className={"flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"} />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 space-x-4">
              {/* New Item code Goes here for the View*/}
              {extra.map(item=>{
                return item;
              })}
            </div>
          </div>
        </div>
        <div className="overflow-auto max-h mx-6">
          <table className="table-auto w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                {column.map((item) => {
                  return (
                    <th scope="col" className="py-3 px-6" key={item.key}>
                      <div className="flex items-center">
                        {item.name}
                        {item.isFilter ? (
                          <SelectorIcon className="h-4 w-4" aria-hidden="true" />
                        ) : null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {source.map((row: any, index: number) => {
                return (
                  <tr className="bg-white border-b" key={`tr-${index}`}>
                    {column.map((item) => {
                      return (
                        <td
                          className="py-4 px-6"
                          key={`${item.key}-`}
                        >
                          {row[item.key]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                href="#"
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </a>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                {size > 1 ? (
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {defaultPageSize * (currentPage - 1) + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {size < defaultPageSize * currentPage
                        ? size
                        : defaultPageSize * currentPage}
                    </span>{" "}
                    of <span className="font-medium">{size}</span> results
                  </p>
                ) : null}
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </a>
                  {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
                  <a
                    href="#"
                    aria-current="page"
                    className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    2
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
                  >
                    3
                  </a>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
                  >
                    8
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    9
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    10
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}
