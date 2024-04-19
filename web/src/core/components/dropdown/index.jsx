import {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import "./dropdown.css";


export const SearchableDropdown = ({
                                       options,
                                       label,
                                       id,
                                       selectedValue,
                                       handleChange
                                   }) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        document.addEventListener("click", toggle);
        return () => document.removeEventListener("click", toggle);
    }, []);

    const selectOption = (option) => {
        setQuery(() => "");
        handleChange(option);
        setIsOpen((isOpen) => !isOpen);
    };

    function toggle(e) {
        setIsOpen(e && e.target === inputRef.current);
    }

    const getDisplayValue = () => {
        if (query) return query;
        if (selectedValue) return selectedValue[label] || "";

        return "";
    };

    const filter = (options) => {
        return options.filter(
            (option) => option[label] && option[label].toLowerCase().indexOf(query.toLowerCase()) > -1
        );
    };

    return (
        <div className="dropdown">
            <div className="control">
                <div className="selected-value">
                    <input
                        ref={inputRef}
                        className="input"
                        type="text"
                        value={getDisplayValue()}
                        name="searchTerm"
                        onChange={(e) => {
                            setQuery(e.target.value);
                            handleChange(null);
                        }}
                        onClick={toggle}
                    />
                </div>
                {selectedValue[label] && <div className="close" onClick={() => handleChange({})}/>}
                <div className={`arrow ${isOpen ? "open" : ""}`}></div>
            </div>

            <div className={`options ${isOpen ? "open" : ""}`}>
                {filter(options).map((option, index) => {
                    return (
                        <div
                            role="option"
                            onClick={() => selectOption(option)}
                            className={`option ${
                                option === selectedValue ? "selected" : ""
                            }`}
                            key={`${id}-${index}`}
                        >
                            {option[label]}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

SearchableDropdown.propTypes = {
    options: PropTypes.arrayOf(PropTypes.object),
    label: PropTypes.string,
    id: PropTypes.string,
    selectedValue: PropTypes.object,
    handleChange: PropTypes.func
};



