import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Badge, Link, Text } from "@radix-ui/themes";
import { ColumnField, ReadOnlyTable } from "core/components/table";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Service } from "service";
import { Endpoint } from "service/endpoint";

const TYPE_MAPPING: any = {
  TestCase: (
    <Badge size="1" color="green">
      Test Case
    </Badge>
  ),
  TestSuite: (
    <Badge size="1" color="blue">
      Test Suite
    </Badge>
  )
};

export const ExecutionHistory: React.FC = () => {
  const navigate = useNavigate();
  /**
   * onHandleClick - Handle the Test case redirect
   * @param record
   */
  const onHandleClick = (record: any) => {
    navigate(`${record.id}`);
  };
  const columns: Array<ColumnField> = [
    {
      key: "id",
      label: "Execution No",
      className: "flex-auto ",
      render: (text, record) => (
        <Link size="2" onClick={() => onHandleClick(record)}>
          {text}
        </Link>
      )
    },
    {
      key: "description",
      label: "Description",
      className: "flex-auto ",
      render: (text, record) => (
        <Link
          size="2"
          onClick={() => onHandleClick(record)} //
        >
          {text} ({record["reference"]})
        </Link>
      )
    },
    {
      key: "type",
      label: "Type",
      className: "flex-auto",
      render: (text: string, record) => (
        <div className="flex gap-2">
          {TYPE_MAPPING[text]}
          {record["is_dry_run"] ? (
            <Badge size="1" color="red">
              Dry run
            </Badge>
          ) : (
            ""
          )}
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      className: "flex-auto ",
      render: (text, record) => (
        <div className="flex gap-2">
          {text === "Completed" ? (
            <Badge size="1" color="green">
              <span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-green-900 content-['']" />{" "}
              Completed
            </Badge>
          ) : text === "Failed" ? (
            <Badge size="1" color="red">
              <span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-red-900 content-['']" />{" "}
              Failed
            </Badge>
          ) : text === "Running" ? (
            <Badge size="1" color="orange">
              <span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-orange-900 content-['']" />{" "}
              Running
            </Badge>
          ) : (
            ""
          )}
        </div>
      )
    }
  ];

  const { appId = "" } = useParams();
  const [dataSource, setDataSource] = useState([] as any);
  const fetchActions = async () => {
    await Service.get(`${Endpoint.v1.history.list(appId)}`)
      .then((history) => {
        setDataSource(history);
      })
      .finally(() => {});
  };

  useEffect(() => {
    fetchActions();
  }, []);
  return (
    // <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
    //   <CardHeader
    //     floated={false}
    //     shadow={false}
    //     color="transparent"
    //     className="m-0 flex items-center justify-between p-6"
    //   >
    //     <div>
    //       <Typography variant="h6" color="blue-gray" className="mb-1">
    //         Execution History
    //       </Typography>
    //       <Typography
    //         variant="small"
    //         className="flex items-center gap-1 font-normal text-blue-gray-600"
    //       >
    //         <CheckCircleIcon
    //           strokeWidth={3}
    //           className="h-4 w-4 text-blue-gray-200"
    //         />
    //         last <strong>30</strong> days
    //       </Typography>
    //     </div>
    //     <Menu placement="left-start">
    //       <MenuHandler>
    //         <IconButton size="sm" variant="text" color="blue-gray">
    //           <EllipsisVerticalIcon
    //             strokeWidth={3}
    //             fill="currenColor"
    //             className="h-6 w-6"
    //           />
    //         </IconButton>
    //       </MenuHandler>
    //       <MenuList>
    //         <MenuItem>Action</MenuItem>
    //         <MenuItem>Another Action</MenuItem>
    //         <MenuItem>Something else here</MenuItem>
    //       </MenuList>
    //     </Menu>
    //   </CardHeader>
    //   <CardBody className="overflow-x-scroll px-0 pt-0 pb-0">
    //     <ReadOnlyTable column={columns} data={dataSource}></ReadOnlyTable>
    //   </CardBody>
    // </Card>
    <>
      <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border">
        <div className="flex items-center justify-between gap-8 mb-8">
          <div>
            <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Execution History
            </h5>
            <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
              <Text>
                <CheckCircleIcon
                  strokeWidth={3}
                  className="h-4 w-4 text-blue-gray-200"
                />
                last <strong>30</strong> days
              </Text>
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
            <button
              className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              view all
            </button>
            <button
              className="flex select-none items-center gap-3 rounded-lg bg-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Add member
            </button>
          </div>
        </div>
      </div>
      <ReadOnlyTable column={columns} data={dataSource}></ReadOnlyTable>
    </>
  );
};
