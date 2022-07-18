import {MouseEvent} from "react";

interface ButtonInterface {
    value: string;
    className?: string;
    type?: string;
    onClick?: (event: MouseEvent) => void;
}
const PRIMARY = "PRIMARY";

const colorMapping: { [id: string]: string; } = {
    PRIMARY: "bg-indigo-500 hover:bg-indigo-700"
}

export function Button(props: ButtonInterface) {
    const {type=PRIMARY, value, className, onClick} = props;
    const styleClass = `${colorMapping[type]}  text-white font-bold py-2 px-4 rounded ${className}`
    return (
        <>
            <button className={styleClass} onClick={onClick}>
                {value}
            </button>
        </>
    );
}
