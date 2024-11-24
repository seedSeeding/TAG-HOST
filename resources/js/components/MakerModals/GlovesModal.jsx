import { useEffect, useRef, useState } from "react";
import { materialList, updateLengthWidth, getMaterialAdjusment, updateByMaterial_LW, check_LW, getSizeID, inputChangeColor } from "../dataTools";
import { GloveAPI } from "../Api/GLoveApi";
import NotifCard from "../Notifications/NotifCard";
import PartModal from "./PartModal";
import { getStandardMeasureLarge, getStandardMeasureMedium, getStandardMeasurements_LW, getStandardMeasureSmall, getStandardMeasureXLarge } from "../StandardMeasurements/StandardMeasures";
import { useStateContext } from "../Providers/ContextProvider";
export default function GlovesModal(props) {
    const {user,setLoad}  = useStateContext();
    const { setActiveCreateModal, activeCreateModal, setCreateOpenModal } = props;
    const [error, setError] = useState('');
    const [success, setSucess] = useState('');
    const [size, setSize] = useState("Medium");
    const [outerMaterialAdj, setOuterMaterialAdj] = useState(0);
    const [liningMaterialAdj, setLiningMaterialAdj] = useState(0);
    const [materialAdjusment, setMaterialAdjusment] = useState(0);

    const [patternNumber, setPatternNumber] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('gloves');
    const [brand, setBrand] = useState('');
    const [liningMaterial, setLiningMaterial] = useState("Lining Material");
    const [outerMaterial, setOuterMaterial] = useState("Outer Material");

    const [image, setImage] = useState('');
    const fileInputRef = useRef(null);
    const [imageView, setImageView] = useState('');

    const [palmShell, setPalmShell] = useState(getStandardMeasurements_LW(size,"Palm Shell"));
    const [backShell, setBackShell] = useState(getStandardMeasurements_LW(size,"Black Shell"));
    const [palmThumb, setPalmThumb] = useState(getStandardMeasurements_LW(size,"Palm Thumb"));
    const [backThumb, setBackThumb] = useState(getStandardMeasurements_LW(size,"Back Thumb"));
    const [indexFinger, setIndexFinger] = useState(getStandardMeasurements_LW(size,"Index Finger"));
    const [middleFinger, setMiddleFinger] = useState(getStandardMeasurements_LW(size,"Middle Finger"));
    const [ringFinger, setRingFinger] = useState(getStandardMeasurements_LW(size,"Ring Finger"));
    const [littleFinger, setLittleFinger] = useState(getStandardMeasurements_LW(size,"Little Finger"));
    const [wrist, setWrist] = useState(getStandardMeasurements_LW(size,"Wrist"));


    const gloveApi = new GloveAPI();

    const handleSave = (submit) => {

        const validateFields = () => {
            if (!patternNumber) return "Pattern number is required.";
            if (!name) return "Name is required.";
            if (!category) return "Category is required.";
            if (!brand) return "Brand is required.";
            if (outerMaterial === "Outer Material") return "Outer material is required.";
            if (liningMaterial === "Lining Material") return "Lining material is required.";


            const parts = {
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


            for (const [partName, measurements] of Object.entries(parts)) {
                if (!measurements.length || !measurements.width) {
                    return `Measurements for ${partName.replace(/_/g, ' ')} must be provided.`;
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
            maker_id: user.id,
            pattern_number: patternNumber,
            name: name,
            category: category,
            brand: brand,
            outer_material: outerMaterial,
            lining_material: liningMaterial,
        };
       // alert(backShell.length);
        const partsToSave = {
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

        const create = async () => {
            try {
                const response = await gloveApi.createGlove(pattern, partsToSave, size, submit, image);
                  
                        setSucess(response);
                        setLoad();
               
                    
                
            } catch (error) {
                setError( error.message);
            }
        };

        create();
    };


    const handleSizeChange = (e) => {
        const selectedSize = e.target.value;
        const difference = 0.25;
        const fix = 2;

        setPalmShell(prev => updateLengthWidth(size, selectedSize, prev, difference, fix));
        setBackShell(prev => updateLengthWidth(size, selectedSize, prev, difference, fix));
        setPalmThumb(prev => updateLengthWidth(size, selectedSize, prev, difference, fix));
        setBackThumb(prev => updateLengthWidth(size, selectedSize, prev, difference, fix));
        setIndexFinger(prev => updateLengthWidth(size, selectedSize, prev, difference, fix));
        setMiddleFinger(prev => updateLengthWidth(size, selectedSize, prev, difference, fix));
        setRingFinger(prev => updateLengthWidth(size, selectedSize, prev, difference, fix));
        setLittleFinger(prev => updateLengthWidth(size, selectedSize, prev, difference, fix));
        setWrist(prev => updateLengthWidth(size, selectedSize, prev, difference, fix));

        setSize(selectedSize);
    };

    const updateMeasurements = (newAdj) => {
        const fix = 2;
        setPalmShell(prev => updateByMaterial_LW(prev, materialAdjusment, newAdj, fix));
        setBackShell(prev => updateByMaterial_LW(prev, materialAdjusment, newAdj, fix));
        setPalmThumb(prev => updateByMaterial_LW(prev, materialAdjusment, newAdj, fix));
        setBackThumb(prev => updateByMaterial_LW(prev, materialAdjusment, newAdj, fix));
        setIndexFinger(prev => updateByMaterial_LW(prev, materialAdjusment, newAdj, fix));
        setMiddleFinger(prev => updateByMaterial_LW(prev, materialAdjusment, newAdj, fix));
        setRingFinger(prev => updateByMaterial_LW(prev, materialAdjusment, newAdj, fix));
        setLittleFinger(prev => updateByMaterial_LW(prev, materialAdjusment, newAdj, fix));
        setWrist(prev => updateByMaterial_LW(prev, materialAdjusment, newAdj, fix));

        setMaterialAdjusment(newAdj);
    };
    const handleLiningChange = (e) => {
        const selectedMaterial = e.target.value;
        setLiningMaterial(e.target.value);
        setLiningMaterialAdj(getMaterialAdjusment(selectedMaterial));
        let newAdj = getMaterialAdjusment(e.target.value) + outerMaterialAdj;
        updateMeasurements(newAdj);

    };
    const handleOuterChange = (e) => {
        const selectedMaterial = e.target.value;
        setOuterMaterial(e.target.value);
        setOuterMaterialAdj(getMaterialAdjusment(selectedMaterial));
        let newAdj = getMaterialAdjusment(e.target.value) + liningMaterialAdj;
        updateMeasurements(newAdj);
    };
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImageView(URL.createObjectURL(file));
        }
    };
    const handleSelectImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
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
                {success && (<NotifCard type={"s"} message={success} setMessage={setSucess} />)}
                {error && (<NotifCard type={"e"} message={error} setMessage={setError} />)}
                <div className="maker-create-modal">
                    <div className="modal-pattern-content">
                        <div className="modal-pattern-image" onClick={handleSelectImage} style={{ cursor: 'pointer' }}>
                            {image ? (
                                <img src={imageView} alt="Selected" />
                            ) : (
                                <img src="/Images/upload-img.png" alt="Upload Placeholder" />
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <div className="modal-pattern-controls">
                            <div className="modal-control-box">
                                <input type="text" placeholder="Enter Pattern Number" value={patternNumber} onChange={(e) => setPatternNumber(e.target.value)} />
                                <span>Pattern Number</span>
                            </div>
                            <div className="modal-control-box">
                                <select name="" id="" value={activeCreateModal} onChange={(e) => setActiveCreateModal(e.target.value)}>
                                    <option value="Gloves">Gloves</option>
                                    <option value="Scarves">Scarves</option>
                                    <option value="Hats">Hats</option>
                                </select>
                                <span>Category</span>
                            </div>
                            <div className="modal-control-box">
                                <input type="text" placeholder="Enter Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
                                <span>Brand</span>
                            </div>
                            <div className="modal-control-box">
                                <input type="text" placeholder="Enter Design Name" value={name} onChange={(e) => setName(e.target.value)} />
                                <span>Name</span>
                            </div>
                            <div className="modal-control-box">
                                <select name="" id="" onChange={handleOuterChange}>
                                    <option value="Outer Material">Outer Material</option>
                                    {materialList.map((value, index) => (
                                        <option value={value} key={index}>{value}</option>
                                    ))}
                                </select>
                                <span>Outer Material</span>
                            </div>
                            <div className="modal-control-box">
                                <select name="" id="" onChange={handleLiningChange}>
                                    <option value="Lining Material">Lining Material</option>
                                    {materialList.map((value, index) => (
                                        <option value={value} key={index}>{value}</option>
                                    ))}
                                </select>
                                <span>Lining Material</span>
                            </div>
                        </div>
                        <div className="modal-corp-logo">
                            <img src="/Images/tag-logo1.png" alt="" />
                        </div>
                    </div>

                    <div className="modal-right-content">
                        <div className="close-modal">
                            <button onClick={() => setCreateOpenModal(false)}>
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
                            <button onClick={() => handleSave(false)}>Save Record</button>
                            <button onClick={() => handleSave(true)}>Submit Record</button>
                            <div>
                                <select value={size} onChange={handleSizeChange}>
                                    <option value="Small">Small</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Large">Large</option>
                                    <option value="X-Large">X-Large</option>
                                </select>
                                <span>Size</span>
                            </div>
                        </div>
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
                                            <span>Length (inches)</span>
                                            <span>Width (inches)</span>
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
                                        <div className="messure-row-inputs standard">
                                            <div>
                                                <input
                                                    type="text"
                                                    onClick={inputChangeColor}
                                                    placeholder="Length"
                                                    value={palmShell.length}
                                                    onChange={(e) => setPalmShell({ ...palmShell, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    onClick={inputChangeColor}
                                                    value={palmShell.width}
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
                                        <div className="messure-row-inputs standard">
                                            <div>
                                                <input
                                                    type="text"
                                                    onClick={inputChangeColor}
                                                    placeholder="Length"
                                                    value={backShell.length}
                                                    onChange={(e) => setBackShell({ ...backShell, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    onClick={inputChangeColor}
                                                    value={backShell.width}
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
                                        <div className="messure-row-inputs standard">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    onClick={inputChangeColor}
                                                    value={palmThumb.length}
                                                    onChange={(e) => setPalmThumb({ ...palmThumb, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    onClick={inputChangeColor}
                                                    value={palmThumb.width}
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
                                        <div className="messure-row-inputs standard">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    onClick={inputChangeColor}
                                                    value={backThumb.length}
                                                    onChange={(e) => setBackThumb({ ...backThumb, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={backThumb.width}
                                                    onClick={inputChangeColor}
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
                                        <div className="messure-row-inputs standard" >
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    onClick={inputChangeColor}
                                                    value={indexFinger.length}
                                                    onChange={(e) => setIndexFinger({ ...indexFinger, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    onClick={inputChangeColor}
                                                    value={indexFinger.width}
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
                                        <div className="messure-row-inputs standard">
                                            <div>
                                                <input
                                                    type="text"
                                                    onClick={inputChangeColor}
                                                    placeholder="Length"
                                                    value={middleFinger.length}
                                                    onChange={(e) => setMiddleFinger({ ...middleFinger, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    onClick={inputChangeColor}
                                                    value={middleFinger.width}
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
                                        <div className="messure-row-inputs standard">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    onClick={inputChangeColor}
                                                    value={ringFinger.length}
                                                    onChange={(e) => setRingFinger({ ...ringFinger, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={ringFinger.width}
                                                    onClick={inputChangeColor}
                                                    onChange={(e) => setRingFinger({ ...ringFinger, width: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Little Finger */}
                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                            <PartModal image={"/partsImages/littlefinger.png"} partName={"Little Finger"} />
                                            <span>Pinky Finger</span>
                                        </div>
                                        <div className="messure-row-inputs standard">
                                            <div>
                                                <input
                                                    type="text"
                                                    onClick={inputChangeColor}
                                                    placeholder="Length"
                                                    value={littleFinger.length}
                                                    onChange={(e) => setLittleFinger({ ...littleFinger, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={littleFinger.width}
                                                    onClick={inputChangeColor}
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
                                        <div className="messure-row-inputs standard">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    onClick={inputChangeColor}
                                                    value={wrist.length}
                                                    onChange={(e) => setWrist({ ...wrist, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    onClick={inputChangeColor}
                                                    value={wrist.width}
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