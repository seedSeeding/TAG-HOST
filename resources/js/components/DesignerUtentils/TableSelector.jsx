import React, { useState } from 'react';
export default function TableSelector(props){

    const { values, setValue, value } = props;
    const [isOpen, setIsOpen] = useState(false); 

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev); 
    };

    return (
        <div className="table-selector">
            <div className="table-selector-header">
                <div className="table-selector-title">{value}</div>
                <button className="table-arrow-btn" onClick={toggleDropdown}>
                    <div className={`table-selector-arrow ${!isOpen ? 'open' : ''}`}></div>
                </button>
            </div>
            
            {isOpen && (
                <div className="table-selector-con" >
                    {values.map((val, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setValue(val);
                                setIsOpen(false); 
                            }}
                            className="table-selector-btn"
                        >
                            {val}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}