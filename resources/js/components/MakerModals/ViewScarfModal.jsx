import { useEffect, useState } from "react";
import {
    materialList,
    safeParse,
    getSizeID,
    check_LW
} from "../dataTools";
import { ScarfAPI } from "../Api/ScarfApi";
import NotifCard from "../Notifications/NotifCard";
import PartModal from "./PartModal";
import HistoryBox from "./HistoryBox";
import { useStateContext } from "../Providers/ContextProvider";
export default function ViewScarfModal(props) {
    const { setOpenViewModal, data } = props;
    const {setLoad} = useStateContext();
    const [pattern, setPattern] = useState(null);
    const [size, setSize] = useState("Medium");
    const [error, setError] = useState('');
    const [succes, setSuccess] = useState('');
    const [sizeID, setSizeID] = useState();
    const [sizeSubmmited,setSizeSubmmited] = useState(false);
    const [historyData,setHistoryData] = useState();
    const [showHistory,setShowHistory] = useState(false);

    const [patternNumber, setPatternNumber] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('scarves');
    const [brand, setBrand] = useState('');
    const [liningMaterial, setLiningMaterial] = useState("Lining Material");
    const [outerMaterial, setOuterMaterial] = useState("Outer Material");

    const [body, setBody] = useState({ length: '', width: '' });
    const [fringers, setFringers] = useState({ length: '', width: '' });
    const [edges, setEdges] = useState({ length: '', width: '' });


    useEffect(() => {
        if (data && data.scarves) {
            setPattern(data.scarves);
            setOuterMaterial(data.outer_material || "Outer Material");
            setLiningMaterial(data.lining_material || "Lining Material");
            setBrand(data.brand || "");
            setName(data.name || "");
            setPatternNumber(data.pattern_number || "");
            setCategory(data.category);
            
        }
    }, [data]);

    useEffect(() => {
        if (data && data.scarves) {
            const record = data.scarves.find(item => item.size_id === getSizeID(size));
            if (record) {
                setSizeID(record.id)
                setSizeSubmmited(record.submitted)
                setBody(safeParse(record.body || { length: '', width: '' }));
                setFringers(safeParse(record.fringers || { length: '', width: '' }));
                setEdges(safeParse(record.edges || { length: '', width: '' }));
 
            }
        }
    }, [size, data]);
    useEffect(() => {
            if(historyData){
                setBody(safeParse(historyData.body || { length: '', width: '' }));
                setFringers(safeParse(historyData.fringers || { length: '', width: '' }));
                setEdges(safeParse(historyData.edges || { length: '', width: '' }));
            }
    },[historyData]);
    
    const scarfApi = new ScarfAPI();
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
                body: body,
                fringers: fringers,
                edges: edges,
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
            body: body,
            fringers: fringers,
            edges: edges,
        };
        const isSubmit = sizeSubmmited ? true : submit;
        const update = async () => {
            try {
                const response = await scarfApi.updateScarf(pattern, partsToUpdate, size, isSubmit,sizeID);
                setSuccess(`Scarf pattern ${response} successfully.`);
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

    useEffect(() => {

    }, [body, fringers, edges]);
    // useEffect(() => {
    //     setBody((prev) => (check_LW(prev)));
    //     setFringers((prev) => (check_LW(prev)));
    //     setEdges((prev) => (check_LW(prev)));
    // }, [body, fringers, edges]);

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
                                <select name="" id="" value={"Scarves"} disabled>
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

                    </div>

                    <div className="modal-right-content">
                        <div className="close-modal">
                            <button onClick={() => {
                                setOpenViewModal(false)

                            }}>
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
                        {showHistory && (<HistoryBox category={"scarves"} setData={setHistoryData} size_id={getSizeID(size)} pattern_id={data.id}/>)}
                        <div className="modal-pattern-messurement">
                            <div className="modal-table-con">
                                <div className="modal-table-header">
                                    <div className="parts-images">
                                        <span>Scarf Parts</span>
                                    </div>
                                    <div className="pattern-mess-header">
                                        <div>
                                            <span>Measurement</span>
                                        </div>
                                        <div>
                                            <span>Length (inches)</span>
                                            <span>Width (inches)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-table">
                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/body.jpg"} partName={"Body"} />
                                            <span>Body</span>
                                        </div>
                                        <div className="messure-row-inputs">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    value={body.length || ''}
                                                    onChange={(e) => setBody({ ...body, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={body.width || ''}
                                                    onChange={(e) => setBody({ ...body, width: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/fringes.jpg"} partName={"Fringes"} />
                                            <span>Fringes</span>
                                        </div>
                                        <div className="messure-row-inputs">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    value={fringers.length || ''}
                                                    onChange={(e) => setFringers({ ...fringers, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={fringers.width || ''}
                                                    onChange={(e) => setFringers({ ...fringers, width: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/egds.jpg"} partName={"Egds"} />
                                            <span>Edges</span>
                                        </div>
                                        <div className="messure-row-inputs">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    value={edges.length || ''}
                                                    onChange={(e) => setEdges({ ...edges, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={edges.width || ''}
                                                    onChange={(e) => setEdges({ ...edges, width: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-corp-logo scarves-modal-logo">
                                <img src="/Images/tag-logo1.png" alt="" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
