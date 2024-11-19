import { useEffect, useState } from "react";

import {
    materialList,
    safeParse,
    getSizeID,
    check_LW
} from "../dataTools";
import NotifCard from "../Notifications/NotifCard";
import { GloveAPI } from "../Api/GLoveApi";
import PartModal from "./PartModal";
import HistoryBox from "./HistoryBox";
import { useStateContext } from "../Providers/ContextProvider";
export default function ViewGlovesModal(props) {
    const { setOpenViewModal, data } = props;
    const [size, setSize] = useState("Medium");
    const [error, setError] = useState('');
    const [succes, setSuccess] = useState('');
    const [pattern,setPattern] =useState(null);
    const [sizeID, setSizeID] = useState();
    const [sizeSubmmited,setSizeSubmmited] = useState(false);
    const [historyData,setHistoryData] = useState();
    const [showHistory,setShowHistory] = useState(false);
    const {setLoad} = useStateContext();

    const [patternNumber, setPatternNumber] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('gloves');
    const [brand, setBrand] = useState('');
    const [liningMaterial, setLiningMaterial] = useState("Lining Material");
    const [outerMaterial, setOuterMaterial] = useState("Outer Material");

    // Parts state
    const [palmShell, setPalmShell] = useState({ length: '', width: '' });
    const [backShell, setBackShell] = useState({ length: '', width: '' });
    const [palmThumb, setPalmThumb] = useState({ length: '', width: '' });
    const [backThumb, setBackThumb] = useState({ length: '', width: '' });
    const [indexFinger, setIndexFinger] = useState({ length: '', width: '' });
    const [middleFinger, setMiddleFinger] = useState({ length: '', width: '' });
    const [ringFinger, setRingFinger] = useState({ length: '', width: '' });
    const [littleFinger, setLittleFinger] = useState({ length: '', width: '' });
    const [wrist, setWrist] = useState({ length: '', width: '' });

    useEffect(() => {
        if (data && data.gloves && data.gloves.length) {
            setPattern(data.gloves);
            setOuterMaterial(data.outer_material || "Outer Material");
            setLiningMaterial(data.lining_material || "Lining Material");
            setBrand(data.brand || "");
            setName(data.name || "");
            setPatternNumber(data.pattern_number || "");
            setCategory(data.category || "gloves");
        }
    }, [data]);

    useEffect(() => {
        if(historyData){
             setPalmShell(safeParse(historyData.palm_shell || { length: '', width: '' }));
                setBackShell(safeParse(historyData.black_shell || { length: '', width: '' }));
                setPalmThumb(safeParse(historyData.palm_thumb || { length: '', width: '' }));
                setBackThumb(safeParse(historyData.back_thumb || { length: '', width: '' }));
                setIndexFinger(safeParse(historyData.index_finger || { length: '', width: '' }));
                setMiddleFinger(safeParse(historyData.middle_finger || { length: '', width: '' }));
                setRingFinger(safeParse(historyData.ring_finger || { length: '', width: '' }));
                setLittleFinger(safeParse(historyData.little_finger || { length: '', width: '' }));
                setWrist(safeParse(historyData.wrist || { length: '', width: '' }));
        }
    },[historyData]);

    useEffect(() => {
        if (data && data.gloves) {
            const record = data.gloves.find(item => item.size_id === getSizeID(size));
            if (record) {
                setSizeID(record.id)
                setSizeSubmmited(record.submitted)
                setPalmShell(safeParse(record.palm_shell || { length: '', width: '' }));
                setBackShell(safeParse(record.black_shell || { length: '', width: '' }));
                setPalmThumb(safeParse(record.palm_thumb || { length: '', width: '' }));
                setBackThumb(safeParse(record.back_thumb || { length: '', width: '' }));
                setIndexFinger(safeParse(record.index_finger || { length: '', width: '' }));
                setMiddleFinger(safeParse(record.middle_finger || { length: '', width: '' }));
                setRingFinger(safeParse(record.ring_finger || { length: '', width: '' }));
                setLittleFinger(safeParse(record.little_finger || { length: '', width: '' }));
                setWrist(safeParse(record.wrist || { length: '', width: '' }));
            }
        }
    }, [size, data]);


    const gloveApi = new GloveAPI();

    const handleUpdate = (submit) => {
        const validateFields = () => {
            if (!data?.id) return "Pattern ID is required.";
            if (!patternNumber) return "Pattern number is required.";
            if (!name) return "Name is required.";
            if (!category) return "Category is required.";
            if (!brand) return "Brand is required.";
            if (outerMaterial === "Outer Material") return "Outer material is required.";
            if (liningMaterial === "Lining Material") return "Lining material is required.";

            const parts = {
                palm_shell: palmShell,
                back_shell: backShell,
                palm_thumb: palmThumb,
                back_thumb: backThumb,
                index_finger: indexFinger,
                middle_finger: middleFinger,
                ring_finger: ringFinger,
                little_finger: littleFinger,
                wrist: wrist,
            };

            for (const [partName, measurements] of Object.entries(parts)) {

                for (const [key, value] of Object.entries(measurements)) {
                    if (!value) {
                        return `Measurement for ${partName.replace(/_/g, ' ')} (${key}) must be provided.`;
                    }
                }
            }

            return null;
        };

        const validationError = validateFields();
        if (validationError) {
            setError(validationError);
            return;
        }

        const pattern = {
            id: data.id,
        };

        const partsToUpdate = {
            palm_shell: palmShell,
            black_shell: backShell,
            palm_thumb: palmThumb,
            back_thumb: backThumb,
            index_finger: indexFinger,
            middle_finger: middleFinger,
            ring_finger: ringFinger,
            little_finger: littleFinger,
            wrist: wrist,
        };
        const isSubmit = sizeSubmmited ? true : submit;
        const update = async () => {
            try {
                const response = await gloveApi.updateGlove(pattern, partsToUpdate, size, isSubmit,sizeID);
                setSuccess(`Pattern ${response} successfully.`);
                setLoad();

                setTimeout(() => {
                    window.location.reload(); // Reload the page after submission
                }, 1000);
                
            } catch (error) {
                setError("Error: " + error.message);
            }
        };

        update();
    };
    // useEffect(() => {

    //     setPalmShell((prev) => (check_LW(prev)));
    //     setBackShell((prev) => (check_LW(prev)));
    //     setPalmThumb((prev) => (check_LW(prev)));
    //     setBackThumb((prev) => (check_LW(prev)));
    //     setIndexFinger((prev) => (check_LW(prev)));
    //     setMiddleFinger((prev) => (check_LW(prev)));
    //     setRingFinger((prev) => (check_LW(prev)));
    //     setLittleFinger((prev) => (check_LW(prev)));
    //     setWrist((prev) => (check_LW(prev)));
    // }, [palmShell, backShell, palmThumb, backThumb, indexFinger, middleFinger, ringFinger, littleFinger, wrist]);

    return (
        <>
            <div className="maker-modal-overlay">
                {succes && (<NotifCard type={'s'} message={succes} setMessage={setSuccess} />)}
                {error && (<NotifCard type={'e'} message={error} setMessage={setError} />)}
                <div className="maker-create-modal">
                    <div className="modal-pattern-content">
                        <div className="modal-pattern-image">
                            {data.image && (<img src={`/Storage/${data.image}`} alt="Glove" />)}
                            <input type="file" />
                        </div>
                        <div className="modal-pattern-controls">
                            <div className="modal-control-box">
                                <input type="text" placeholder="24314" disabled value={patternNumber} onChange={(e) => setPatternNumber(e.target.value)} />
                                <span>Pattern Number</span>
                            </div>
                            <div className="modal-control-box">
                                <select name="" id="" value={category} disabled>
                                    <option value="Gloves">Gloves</option>
                                    <option value="Scarves">Scarves</option>
                                    <option value="Hats">Hats</option>
                                </select>
                                <span>Category</span>
                            </div>
                            <div className="modal-control-box">
                                <input type="text" placeholder="UGG" value={brand || ''} disabled onChange={(e) => setBrand(e.target.value)} />
                                <span>Brand</span>
                            </div>
                            <div className="modal-control-box">
                                <input type="text" placeholder="Leather Gloves" disabled value={name || ''} onChange={(e) => setName(e.target.value)} />
                                <span>Name</span>
                            </div>
                            <div className="modal-control-box">
                                <select name="" id="" value={outerMaterial || ''} disabled>
                                    <option value="Outer Materrial">Outer Materrial</option>
                                    {materialList.map((value, index) => (
                                        <option value={value} key={index}>{value}</option>
                                    ))}
                                </select>
                                <span>Outer Material</span>
                            </div>
                            <div className="modal-control-box">
                                <select name="" id="" value={liningMaterial || ''} disabled>
                                    <option value="Lining Materrial" >Lining Materrial</option>
                                    {materialList.map((value, index) => (
                                        <option value={value} key={index}>{value}</option>
                                    ))}
                                </select>
                                <span>Lining Material</span>
                            </div>
                        </div>
                        <div className="modal-corp-logo">
                            <img src="/Images/tag-logo1.png" alt="Logo" />
                        </div>
                    </div>

                    <div className="modal-right-content">
                        <div className="close-modal">
                            <button onClick={() => setOpenViewModal(false)}>
                                <svg
                                    width={46}
                                    height={46}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M18 6L6 18" />
                                    <path d="M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="modal-buttons">
                        <button onClick={() => setShowHistory(prev => !prev)}>View Previous  Record</button>
                            <button onClick={() => handleUpdate(false)}>Save Record</button>
                            <button onClick={() => handleUpdate(true)}>Submit Record</button>
                            <div>
                                <select value={size} onChange={(e) => {
                                    setSize(e.target.value)
                                    setShowHistory(false);
                                }}>
                                    <option value="Small">Small</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Large">Large</option>
                                    <option value="X-Large">X-Large</option>
                                </select>
                                <span>Size</span>
                            </div>
                        </div>
                        {showHistory && (<HistoryBox category={"gloves"} setData={setHistoryData} size_id={getSizeID(size)} pattern_id={data.id}/>)}
                        <div className="modal-pattern-messurement">
                            <div className="modal-table-con">
                                <div className="modal-table-header">
                                    <div className="parts-images">
                                        <span>Glove Parts</span>
                                    </div>
                                    <div className="pattern-mess-header">
                                        <div>
                                            <span>Measurement</span>
                                        </div>
                                        <div>
                                            <span>Length (Inches)</span>
                                            <span>Width (Inches)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-table">
                                    {/* Palm Shell */}
                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/palmshell.png"} partName={"Palm Shell"} />
                                            <span>Palm Shell</span>
                                        </div>
                                        <div className="messure-row-inputs">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    value={palmShell.length || ''}
                                                    
                                                    onChange={(e) => setPalmShell({ ...palmShell, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={palmShell.width || ''}
                                                    onChange={(e) => setPalmShell({ ...palmShell, width: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Back Shell */}
                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/backshell.png"} partName={"Back Shell"} />
                                            <span>Back Shell</span>
                                        </div>
                                        <div className="messure-row-inputs">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    value={backShell.length || ''}
                                                    onChange={(e) => setBackShell({ ...backShell, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={backShell.width || ''}
                                                    onChange={(e) => setBackShell({ ...backShell, width: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Palm Thumb */}
                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/palmthumb.png"} partName={"Palm Thumb"} />
                                            <span>Palm Thumb</span>
                                        </div>
                                        <div className="messure-row-inputs">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    value={palmThumb.length || ''}
                                                    onChange={(e) => setPalmThumb({ ...palmThumb, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={palmThumb.width || ''}

                                                    onChange={(e) => setPalmThumb({ ...palmThumb, width: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Back Thumb */}
                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/backthumb.png"} partName={"Back Thumb"} />
                                            <span>Back Thumb</span>
                                        </div>
                                        <div className="messure-row-inputs">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    value={backThumb.length || ''}
                                                    onChange={(e) => setBackThumb({ ...backThumb, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={backThumb.width || ''}
                                                    onChange={(e) => setBackThumb({ ...backThumb, width: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Index Finger */}
                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/indexfinger.png"} partName={"Index Finger"} />
                                            <span>Index Finger</span>
                                        </div>
                                        <div className="messure-row-inputs">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    value={indexFinger.length || ''}
                                                    onChange={(e) => setIndexFinger({ ...indexFinger, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={indexFinger.width || ''}
                                                    onChange={(e) => setIndexFinger({ ...indexFinger, width: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Middle Finger */}
                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/middlefinger.png"} partName={"Middle Finger"} />
                                            <span>Middle Finger</span>
                                        </div>
                                        <div className="messure-row-inputs">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    value={middleFinger.length || ''}
                                                    onChange={(e) => setMiddleFinger({ ...middleFinger, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={middleFinger.width || ''}
                                                    onChange={(e) => setMiddleFinger({ ...middleFinger, width: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Ring Finger */}
                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/ringfinger.png"} partName={"Ring Finger"} />
                                            <span>Ring Finger</span>
                                        </div>
                                        <div className="messure-row-inputs">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    value={ringFinger.length || ''}
                                                    onChange={(e) => setRingFinger({ ...ringFinger, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={ringFinger.width || ''}
                                                    onChange={(e) => setRingFinger({ ...ringFinger, width: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Little Finger */}
                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/littlefinger.png"} partName={"Little Finger"} />
                                            <span>Little Finger</span>
                                        </div>
                                        <div className="messure-row-inputs">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    value={littleFinger.length || ''}
                                                    onChange={(e) => setLittleFinger({ ...littleFinger, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={littleFinger.width || ''}
                                                    onChange={(e) => setLittleFinger({ ...littleFinger, width: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Wrist */}
                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/wrist.png"} partName={"Wrist"} />
                                            <span>Wrist</span>
                                        </div>
                                        <div className="messure-row-inputs">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    value={wrist.length || ''}
                                                    onChange={(e) => setWrist({ ...wrist, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={wrist.width || ''}
                                                    onChange={(e) => setWrist({ ...wrist, width: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

