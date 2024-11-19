import React, { useEffect, useState } from 'react';

export default function Selector(props) {
    const { children, title , fixedOpen ,auto} = props;
    const [isOpen, setIsOpen] = useState(false); 

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev); 
    };
    useEffect(() => {
        if(fixedOpen){
            setIsOpen(true);
        }

    },[]);

    return (
        <>
            <div className={`selector-div ${auto && 'max-h-[500px] min-h-[500px] overflow-auto relative bg-red-500'}`}>
            <div className="selector-header">
                <span className="selector-title">{title}</span>
               {fixedOpen !== true && (
                 <button className="selector-arrow" onClick={toggleDropdown}>
                     <img src="/Images/selector-arrow.png" alt="selector_arrow" className={`arrow-icon ${isOpen ? 'open' : ''}`} />
                 </button>
               )}
            </div>
            <div className='selector-line'></div>
            {isOpen && (
                <div className="selector-content">
                    {children} 
                </div>
            )}
        </div>
        </>
    );
}
