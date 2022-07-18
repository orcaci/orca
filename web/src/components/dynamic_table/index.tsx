import {useState} from "react";
import {Table} from "../../core/table";
import {Button} from "../../core/button";
import {Modal} from "../../core/modal";

interface DynamicColumnItem {
    key: string;
    name: string;
    width?: number;
}


export function DynamicTable() {
    const [isGetColumnOpen, setGetColumnOpen] = useState(true);
    const [columns, setColumns] = useState<Array<DynamicColumnItem>>([
        { key: "id", name: "S.No" }
    ]);
    const [rows, setRows] = useState<Array<unknown>>([]);
    const extra = [
        <Button key={"NewRow"} value={"Add Row"} onClick={() => setRows([...rows, {}])}/>,
        <Button key={"NewColumn"} value={"Add Column"} onClick={() => setGetColumnOpen(true)}/>
    ]
    return (
        <>
            <Modal isOpen={isGetColumnOpen} onExit={() => setGetColumnOpen(false)} header={"Add New Column"}
                   extra={[<Button key={"CreateModel"} value={"Add Column"} className={"rounded-full"}/>]}>
                <input />
            </Modal>
            <Table  column={columns} source={rows} defaultKey={"id"} extra={extra}/>
        </>
    );
}