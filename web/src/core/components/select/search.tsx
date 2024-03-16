interface SelectSearchProps {
  label?: string;
  className?: string;
}
export const SearchSelect: React.FC<SelectSearchProps> = ({
  label,
  className
}) => {
  return (
    <div className="relative">
      <select
        data-hs-select='{
              "hasSearch": true,
              "searchPlaceholder": "Search...",
              "searchClasses": "block w-full text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-[1] dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 py-2 px-3",
              "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0 dark:bg-slate-900",
              "placeholder": "Select country...",
              "toggleTag": "<button type=\"button\"><span className=\"me-2\" data-icon></span><span className=\"text-gray-800 dark:text-gray-200\" data-title></span></button>",
              "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 px-4 pe-9 flex text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-[1] dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600",
              "dropdownClasses": "mt-2 max-h-72 pb-1 px-1 space-y-0.5 z-20 w-full bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto dark:bg-slate-900 dark:border-gray-700",
              "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-gray-200 dark:focus:bg-slate-800",
              "optionTemplate": "<div><div className=\"flex items-center\"><div className=\"me-2\" data-icon></div><div className=\"text-gray-800 dark:text-gray-200\" data-title></div></div></div>"
            }'
        className="hidden"
      >
        <option value="">Select Option</option>
        <option
          value="AF"
          data-hs-select-option='{
              "icon": "<img className=\"inline-block size-4 rounded-full\" src=\"../assets/vendor/svg-country-flags/png100px/af.png\" alt=\"Afghanistan\" />"}'
        >
          Afghanistan
        </option>
      </select>

      <div className="absolute top-1/2 end-3 -translate-y-1/2">
        <svg
          className="flex-shrink-0 size-3.5 text-gray-500 dark:text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m7 15 5 5 5-5" />
          <path d="m7 9 5-5 5 5" />
        </svg>
      </div>
    </div>
  );
};
