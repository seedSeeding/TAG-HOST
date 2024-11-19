import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { capitalizeWords } from '../dataTools';

const SearchPattern = (props) => {
    const { value, setValue, patterns } = props;
    const [filtered, setFiltered] = useState([]);
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        if (Array.isArray(patterns) && patterns.length > 0) {
            const filteredPattern = patterns.filter((pattern) => {
                return value && String(pattern.pattern_number).includes(value);
            });
            setFiltered(filteredPattern);
        }
    }, [value, patterns]);

    const selectID = (val) => {
        setSelected(true);
        setValue(val);
    };

    return (
        <div className="relative">
            <div className="flex items-center border border-gray-300 rounded-2xl p-1 bg-[#373839] w-[200px]  relative">
                <FontAwesomeIcon icon={faSearch} className="text-gray-500 text-l mr-2" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        setSelected(false);
                    }}
                    placeholder="Search patterns..."
                    className="flex-1 outline-none text-base text-[.75rem] max-w-[150px] bg-[#373839] text-white"
                />
            </div>
            {filtered.length > 0 && !selected && (
                <div className="mt-2 z-10 absolute w-full max-h-[150px] max-w-[160px] shadow-lg bg-[#373839] text-white">
                    <ul className="mt-2 rounded-lg p-2 w-full max-h-[150px] overflow-y-auto">
                        {filtered.map((pattern, index) => (
                          <li
                          key={index}
                          className="py-1 raindbow-li px-2 hover:bg-[#ECB22E] hover:text-white cursor-pointer text-[.9rem] w-full text-black"
                          onClick={() => selectID(pattern.pattern_number)}
                      >
                          <span>{capitalizeWords(pattern.category)}</span>
                          <span>{pattern.pattern_number}</span>
                      </li>
                      
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchPattern;
