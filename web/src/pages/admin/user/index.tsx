import { Table } from "../../../core/table";

const COLUMNS = [
  {
    key: "no",
    name: "S.No"
  },
  {
    key: "name",
    name: "Name"
  },
  {
    key: "age",
    name: "age"
  },
  {
    key: "gender",
    name: "gender"
  },
  {
    key: "Qualification",
    name: "Qualification"
  },
  {
    key: "Desigination",
    name: "Desigination"
  }
];
const SOUCE = [
  {
    no: 1,
    name: "vasanth",
    age: 34,
    gender: "Male",
    Qualification: "BE",
    Desigination: "SSE"
  },
  {
    no: 2,
    name: "vasanth",
    age: 34,
    gender: "Male",
    Qualification: "BE",
    Desigination: "SSE"
  },
  {
    no: 3,
    name: "vasanth",
    age: 34,
    gender: "Male",
    Qualification: "BE",
    Desigination: "SSE"
  }
];

export function UserManagement() {
  return (
      <div className={"flex-auto"}>
        <Table
          column={COLUMNS}
          source={SOUCE}
          pageSizeOption={[10, 25, 50]}
          defaultPageSize={1}
          defaultKey={"no"}
        />
      </div>
  );
}
