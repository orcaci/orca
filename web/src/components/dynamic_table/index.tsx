import {useState} from "react";
import {Table} from "../../core/table";
import {Button} from "../../core/button";
import {Modal} from "../../core/modal";
import {Input} from "../../core/input";

interface DynamicColumnItem {
    key: string;
    name: string;
    width?: number;
}


export function DynamicTable() {
    const [isGetColumnOpen, setGetColumnOpen] = useState(false);
    const [columnName, setColumnName] = useState("true");
    const [columns, setColumns] = useState<Array<DynamicColumnItem>>([
        { key: "id", name: "S.No" }
    ]);
    const [rows, setRows] = useState<Array<unknown>>([]);
    const extra = [
        <Button key={"NewRow"} value={"Add Row"} onClick={() => setRows([...rows, {}])}/>,
        <Button key={"NewColumn"} value={"Add Column"} onClick={() => setGetColumnOpen(true)}/>
    ]
    const onCreateColumn = () => {
        setColumns([...columns, {key: columnName, "name": columnName}]);
        setGetColumnOpen(false);
    }
    return (
        <>
            <Modal isOpen={isGetColumnOpen} onExit={() => setGetColumnOpen(false)}
                   extra={[<Button key={"CreateModel"} value={"Add Column"} className={"rounded-full"} onClick={onCreateColumn}/>]}>
                <Input key={"CreateNewColumns"} title={"New Column Name"} onChange={(e)=> setColumnName(e.target.value)}/>
            </Modal>
            <Table  column={columns} source={rows} defaultKey={"id"} extra={extra}/>
        </>
    );
}