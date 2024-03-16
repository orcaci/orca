import React from "react";
import { ExecutionHistory } from "../history/historys";

export function AppDashboard() {
  return (
    <div className="mb-4 py-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="col-span-2">
        <ExecutionHistory></ExecutionHistory>{" "}
      </div>
      {/* <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 p-6"
        >
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Execution Overview
          </Typography>
          <Typography
            variant="small"
            className="flex items-center gap-1 font-normal text-blue-gray-600"
          >
            <ArrowUpIcon
              strokeWidth={3}
              className="h-3.5 w-3.5 text-green-500"
            />
            <strong>24%</strong> this month
          </Typography>
        </CardHeader>
        <CardBody className="pt-0">
          {[].map(({ icon, color, title, description }, key) => (
            <div key={title} className="flex items-start gap-4 py-3">
              <div
                className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                  key === [].length - 1 ? "after:h-0" : "after:h-4/6"
                }`}
              >
                {React.createElement(icon, {
                  className: `!w-5 !h-5 ${color}`
                })}
              </div>
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="block font-medium"
                >
                  {title}
                </Typography>
                <Typography
                  as="span"
                  variant="small"
                  className="text-xs font-medium text-blue-gray-500"
                >
                  {description}
                </Typography>
              </div>
            </div>
          ))}
        </CardBody>
      </Card> */}
    </div>
  );
}
