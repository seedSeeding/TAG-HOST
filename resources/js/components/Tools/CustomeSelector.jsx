import React, { useState } from 'react';

export default function CustomSelector(props) {
    const { values, setValue, value, theme } = props;
    const [isOpen, setIsOpen] = useState(false);
    //console.log(values);
    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="custom-selector"
            onClick={toggleDropdown}
            style={
                theme !== 1 ? { backgroundColor: "#ECB22E", color: "#2D3748" } :
                    { backgroundColor: "#2D3748", color: "white" }
            }>
            <div className="custom-selector-header">
                <div className="custom-selectorc-title">{value}</div>
                <button className="custom-arrow-btn" onClick={toggleDropdown}>
                    <div className={`custom-selector-arrow ${!isOpen ? 'open' : ''}`}
                        style={
                            theme !== 1 ? { borderTop: "5px solid #2D3748" } :
                                { borderTop: "5px solid #ECB22E" }
                        }></div>
                </button>
            </div>

            {isOpen && (
                <div className="custom-selector-con"
                    style={
                        theme !== 1 ? { backgroundColor: "#ECB22E", color: "#2D3748" } :
                            { backgroundColor: "#2D3748", color: "white" }
                    }>
                    {values.map((val, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setValue(val);
                                setIsOpen(false);
                                toggleDropdown();
                            }}
                            className="custom-selector-btn"
                        >
                            {val}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
