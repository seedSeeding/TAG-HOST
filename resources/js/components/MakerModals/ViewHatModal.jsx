import { useEffect, useState } from "react";
import {
    materialList,
    safeParse,
    getSizeID,
    isNumeric,
    check_HW,
    check_CD,
    check_LW
} from "../dataTools";
import { HatAPI } from "../Api/HatApi";
import NotifCard from "../Notifications/NotifCard";
import PartModal from "./PartModal";
import HistoryBox from "./HistoryBox";
import { useStateContext } from "../Providers/ContextProvider";
export default function ViewHatModal(props) {
    const { setOpenViewModal, data } = props;
    const [pattern, setPattern] = useState(null);
    const {setLoad} = useStateContext();
    const [size, setSize] = useState("Medium");
    const [error, setError] = useState('');
    const [succes, setSuccess] = useState('');
    const [sizeSubmmited,setSizeSubmmited] = useState(false);
    const [sizeID, setSizeID] = useState();
    const [historyData,setHistoryData] = useState();
    const [showHistory,setShowHistory] = useState(false);

    const [patternNumber, setPatternNumber] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Hats');
    const [brand, setBrand] = useState('');
    const [liningMaterial, setLiningMaterial] = useState("Lining Material");
    const [outerMaterial, setOuterMaterial] = useState("Outer Material");


    const [strap, setStrap] = useState({ height: '', width: '' });
    const [bodyCrown, setBodyCrown] = useState({ height: '', width: '' });
    const [crown, setCrown] = useState({ circumference: '', diameter: '' });
    const [brim, setBrim] = useState({ circumference: '', diameter: '' });
    const [bill, setBill] = useState({ length: '', width: '' });
    
    useEffect(() => {
            if(historyData){
                setStrap(safeParse(historyData.strap || { height: '', width: '' }));
                setBodyCrown(safeParse(historyData.body_crown || { height: '', width: '' }));
                setCrown(safeParse(historyData.crown || { circumference: '', diameter: '' }));
                setBrim(safeParse(historyData.brim || { circumference: '', diameter: '' }));
                setBill(safeParse(historyData.bill || { length: '', width: '' }));
            }
    },[historyData]);

    useEffect(() => {
        if (data && data.hats) {
            setPattern(data.hats);
            setOuterMaterial(data.outer_material || "Outer Material");
            setLiningMaterial(data.lining_material || "Lining Material");
            setBrand(data.brand || "");
            setName(data.name || "");
            setPatternNumber(data.pattern_number || "");
            setCategory(data.category);
           

        }
    }, [data]);
  
    useEffect(() => {
        if (data && data.hats) {
            const record = data.hats.find(item => item.size_id === getSizeID(size));
            if (record) {
                setSizeID(record.id)
                setSizeSubmmited(record.submitted)
                setStrap(safeParse(record.strap || { height: '', width: '' }));
                setBodyCrown(safeParse(record.body_crown || { height: '', width: '' }));
                setCrown(safeParse(record.crown || { circumference: '', diameter: '' }));
                setBrim(safeParse(record.brim || { circumference: '', diameter: '' }));
                setBill(safeParse(record.bill || { length: '', width: '' }));
            }
        }
    }, [size, data]);


    const hatApi = new HatAPI();
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
                strap: strap,
                body_crown: bodyCrown,
                crown: crown,
                brim: brim,
                bill: bill,
            };

            for (const [partName, measurements] of Object.entries(parts)) {
                // Check that each required measurement property is filled
                for (const [key, value] of Object.entries(measurements)) {
                    if (!value) {
                        return `Measurement for ${partName.replace(/_/g, ' ')} (${key}) must be provided.`;
                    }
                }
            }

            return null; // No validation errors
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
            strap: strap,
            body_crown: bodyCrown,
            crown: crown,
            brim: brim,
            bill: bill,
        };
        const isSubmit = sizeSubmmited ? true : submit;
        const update = async () => {
            try {
                const response = await hatApi.updateHat(pattern, partsToUpdate, size, isSubmit,sizeID);
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
    //     setStrap((prev) => (check_HW(prev)));
    //     setBodyCrown((prev) => (check_HW(prev)));
    //     setCrown((prev) => (check_CD(prev)));
    //     setBrim((prev) => (check_CD(prev)));
    //     setBill((prev) => (check_LW(prev)));
    // }, [strap, bodyCrown, crown, brim, bill]);

    const handleClose = () => {
        setOpenViewModal(false);
    };

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
                                <select name="" id="" value={'Hats'} disabled>
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
                                <select name="" id="" value={outerMaterial || ''}  disabled>
                                    <option value="Outer Materrial" >Outer Materrial</option>
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
                            <button onClick={handleClose}>
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
                                <select value={size} onChange={(e) =>  {
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
                        {showHistory && (<HistoryBox category={"hats"} setData={setHistoryData} size_id={getSizeID(size)} pattern_id={data.id}/>)}
                        <div className="modal-pattern-measurement">
                            <div className="modal-table-con">
                                <div className="modal-table-header">
                                    <div className="parts-images">
                                        <span>Hat Parts</span>
                                    </div>
                                    <div className="pattern-mess-header">
                                        <div>
                                            <span>Measurement</span>
                                        </div>
                                        <div>
                                            <span>Heigth (inches)</span>
                                            <span>Width (inches)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-table">
                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/strap.png"} partName={"Strap"} />
                                            <span>Strap</span>
                                        </div>
                                        <div className="messure-row-inputs">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Height"
                                                    value={strap.height || ''}
                                                    onChange={(e) => setStrap({ ...strap, height: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={strap.width || ''}
                                                    onChange={(e) => setStrap({ ...strap, width: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/bodyCrown.jpg"} partName={"Body Crown"} />
                                            <span>Body Crown</span>
                                        </div>
                                        <div className="messure-row-inputs">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Height"
                                                    value={bodyCrown.height || ''}
                                                    onChange={(e) => setBodyCrown({ ...bodyCrown, height: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={bodyCrown.width || ''}
                                                    onChange={(e) => setBodyCrown({ ...bodyCrown, width: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="messure-row hats-mesure-label">
                                        <div className="modal-part-view"></div>
                                        <div className="messure-row-inputs">
                                            <div>Circumference(inches)</div>
                                            <div>Diameter(inches)</div>
                                        </div>
                                    </div>

                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/crown.png"} partName={"Crown"} />
                                            <span>Crown</span>
                                        </div>
                                        <div className="messure-row-inputs">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Circumference"
                                                    value={crown.circumference || ''}
                                                    onChange={(e) => setCrown({ ...crown, circumference: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Diameter"
                                                    value={crown.diameter || ''}
                                                    onChange={(e) => setCrown({ ...crown, diameter: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/brim.jpg"} partName={"Brim"} />
                                            <span>Brim</span>
                                        </div>
                                        <div className="messure-row-inputs">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Circumference"
                                                    value={brim.circumference || ''}
                                                    onChange={(e) => setBrim({ ...brim, circumference: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Diameter"
                                                    value={brim.diameter || ''}
                                                    onChange={(e) => setBrim({ ...brim, diameter: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="messure-row hats-mesure-label">
                                        <div className="modal-part-view"></div>
                                        <div className="messure-row-inputs">
                                            <div>Length(inches)</div>
                                            <div>Width(inches)</div>
                                        </div>
                                    </div>

                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/bill.png"} partName={"Bill"} />
                                            <span>Visor</span>
                                        </div>
                                        <div className="messure-row-inputs">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    value={bill.length || ''}
                                                    onChange={(e) => setBill({ ...bill, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={bill.width || ''}
                                                    onChange={(e) => setBill({ ...bill, width: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="modal-corp-logo scarves-modal-corp">
                                <img src="/Images/tag-logo1.png" alt="Logo" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
