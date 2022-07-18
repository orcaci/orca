
interface Input {
    key: string;
    name: string;
    width?: number;
}

export function Input() {
    return (
        <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
            </label>
            <input
                className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password" type="password" placeholder="******************" />
                <p className="text-red-500 text-xs italic">Please choose a password.</p>
        </div>
    );

}