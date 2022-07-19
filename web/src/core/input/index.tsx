import {ChangeEvent} from "react";

interface InputInterface {
    key: string;
    title: string;
    helpText?: string;
    onChange?: (event: any) => void;
}

export function Input(props: InputInterface) {
    const {key, title, helpText, onChange} = props;
    return (
        <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                {title}
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id={`id${key}`} type="text" placeholder="" onChange={onChange}/>
            {helpText? <p className="text-red-500 text-xs italic">{helpText}</p>: null}

        </div>
    );

}