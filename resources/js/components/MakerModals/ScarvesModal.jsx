import { useEffect, useRef, useState } from "react";
import {
    materialList,
    updateLengthWidth,
    getMaterialAdjusment,
    updateByMaterial_LW,
    check_HW,
    check_LW,
    inputChangeColor
} from "../dataTools";
import { ScarfAPI } from "../Api/ScarfApi";
import NotifCard from "../Notifications/NotifCard";
import PartModal from "./PartModal";
import {  getStandardMeasurements_LW } from "../StandardMeasurements/StandardMeasures";
import { useStateContext } from "../Providers/ContextProvider";

export default function ScarvesModal(props) {
    const {user,setLoad} = useStateContext();
    const { setActiveCreateModal, activeCreateModal, setCreateOpenModal } = props;
    const [size, setSize] = useState("Medium");
    const [outerMaterialAdj, setOuterMaterialAdj] = useState(0);
    const [liningMaterialAdj, setLiningMaterialAdj] = useState(0);
    const [materialAdjustment, setMaterialAdjustment] = useState(0);
    const [error, setError] = useState('');
    const [success, setSucess] = useState('');

    const [patternNumber, setPatternNumber] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('scarves');
    const [brand, setBrand] = useState('');
    const [liningMaterial, setLiningMaterial] = useState("Lining Material");
    const [outerMaterial, setOuterMaterial] = useState("Outer Material");

    const [image, setImage] = useState('');
    const fileInputRef = useRef(null);
    const [imageView, setImageView] = useState('');

    const [body, setBody] = useState(getStandardMeasurements_LW(size,"Body"));
    const [fringers, setFringers] = useState(getStandardMeasurements_LW(size,"Fringers"));
    const [edges, setEdges] = useState(getStandardMeasurements_LW(size,"Edges"));

    const scarfApi = new ScarfAPI();

    const handleSave = (submit) => {
        const validateFields = () => {

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

            for (const [partName, measurement] of Object.entries(parts)) {
                if (!measurement || measurement.length === 0) {
                    alert(partName);
                    return `Measurements for ${partName} must be provided.`;
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

        const partsToSave = {
            body: body,
            fringers: fringers,
            edges: edges,
        };


        const create = async () => {
            try {
                const response = await scarfApi.createScarf(
                    pattern, partsToSave, size, submit, image
                );
                setSucess(response);
                setLoad();
            } catch (error) {
                console.log("Error:", error.message);
                setError("Error: " + error.message);
            }
        };

        create();
    };

    const handleSizeChange = (e) => {
        const selectedSize = e.target.value;
        const difference = 0.25;
        const bodyDifference = 15.25;
        const fix = 1;
        setBody(prev => updateLengthWidth(size, selectedSize, prev, bodyDifference, fix));
        setFringers(prev => updateLengthWidth(size, selectedSize, prev, difference, fix));
        setEdges(prev => updateLengthWidth(size, selectedSize, prev, difference, fix));
        setSize(selectedSize);
    };


    const updateMeasurements = (newAdj) => {
        const fix = 1;
        setBody(prev => updateByMaterial_LW(prev, materialAdjustment, newAdj, fix));
        setFringers(prev => updateByMaterial_LW(prev, materialAdjustment, newAdj, fix));
        setEdges(prev => updateByMaterial_LW(prev, materialAdjustment, newAdj, fix));
        setMaterialAdjustment(newAdj);
    };


    const handleLiningChange = (e) => {
        const selectedMaterial = e.target.value;
        setLiningMaterial(selectedMaterial);
        const newLiningAdj = getMaterialAdjusment(selectedMaterial);
        setLiningMaterialAdj(newLiningAdj);
        const newAdj = newLiningAdj + outerMaterialAdj;
        updateMeasurements(newAdj);
    };


    const handleOuterChange = (e) => {
        const selectedMaterial = e.target.value;
        setOuterMaterial(selectedMaterial);
        const newOuterAdj = getMaterialAdjusment(selectedMaterial);
        setOuterMaterialAdj(newOuterAdj);
        const newAdj = newOuterAdj + liningMaterialAdj;
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
    //     setBody((prev) => (check_LW(prev)));
    //     setFringers((prev) => (check_LW(prev)));
    //     setEdges((prev) => (check_LW(prev)));
    // }, [body, fringers, edges]);

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
                                    <option value="Outer Materrial">Outer Materrial</option>
                                    {materialList.map((value, index) => (
                                        <option value={value} key={index}>{value}</option>
                                    ))}
                                </select>
                                <span>Outer Material</span>
                            </div>
                            <div className="modal-control-box">
                                <select name="" id="" onChange={handleLiningChange}>
                                    <option value="Lining Materrial">Lining Materrial</option>
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
                            </div>
                        </div>
                        <div className="modal-pattern-messurement">
                            <div className="modal-table-con">
                                <div className="modal-table-header">
                                    <div className="parts-images">
                                        <span>Scarves Parts</span>
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
                                        <div className="messure-row-inputs standard">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Length"
                                                    value={body.length}
                                                    onClick={inputChangeColor}
                                                    onChange={(e) => setBody({ ...body, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    onClick={inputChangeColor}
                                                    placeholder="Width"
                                                    value={body.width}
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
                                        <div className="messure-row-inputs standard">
                                            <div>
                                                <input
                                                    type="text"
                                                    onClick={inputChangeColor}
                                                    placeholder="Length"
                                                    value={fringers.length}
                                                    onChange={(e) => setFringers({ ...fringers, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    onClick={inputChangeColor}
                                                    value={fringers.width}
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
                                        <div className="messure-row-inputs standard">
                                            <div>
                                                <input
                                                    type="text"
                                                    onClick={inputChangeColor}
                                                    placeholder="Length"
                                                    value={edges.length}
                                                    onChange={(e) => setEdges({ ...edges, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    onClick={inputChangeColor}
                                                    value={edges.width}
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
