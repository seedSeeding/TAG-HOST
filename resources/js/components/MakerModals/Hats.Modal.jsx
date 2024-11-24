import { useRef, useState, useEffect } from "react";
import {
    materialList
    , updateLengthWidth
    , getMaterialAdjusment
    , updateByMaterial_HW
    , updateByMaterial_CD
    , updateByMaterial_LW
    , updateCircumDiam
    , updateHeightWidth,
    check_CD,
    check_LW,
    check_HW,
    inputChangeColor
} from "../dataTools";
import HistoryBox from "./HistoryBox";
import NotifCard from "../Notifications/NotifCard";
import { HatAPI } from "../Api/HatApi";
import PartModal from "./PartModal";
import { getStandardMeasurements_CD, getStandardMeasurements_HW, getStandardMeasurements_LW } from "../StandardMeasurements/StandardMeasures";
import { useStateContext } from "../Providers/ContextProvider";

export default function HatsModal(props) {
    const  {user,setLoad} = useStateContext();
    const { setActiveCreateModal, activeCreateModal, setCreateOpenModal } = props;
    const [size, setSize] = useState("Medium");
    const [outerMaterialAdj, setOuterMaterialAdj] = useState(0);
    const [liningMaterialAdj, setLiningMaterialAdj] = useState(0);
    const [materialAdjustment, setMaterialAdjustment] = useState(0);

    const [patternNumber, setPatternNumber] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('hats');
    const [brand, setBrand] = useState('');
    const [liningMaterial, setLiningMaterial] = useState("Lining Material");
    const [outerMaterial, setOuterMaterial] = useState("Outer Material");

    const [image, setImage] = useState('');
    const fileInputRef = useRef(null);
    const [imageView, setImageView] = useState('');
    const [error, setError] = useState('');
    const [success, setSucess] = useState('');


    const [strap, setStrap] = useState(getStandardMeasurements_HW(size,"Strap"));
    const [bodyCrown, setBodyCrown] = useState(getStandardMeasurements_HW(size,"Crown"));
    const [crown, setCrown] = useState(getStandardMeasurements_CD(size,"Crown"));
    const [brim, setBrim] = useState(getStandardMeasurements_CD(size,"Brim"));
    const [bill, setBill] = useState(getStandardMeasurements_LW(size,"Bill"));

    const hatApi = new HatAPI();

    const handleSave = (submit) => {
        const validateFields = () => {
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
                if (!measurements) {
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

        const partsToSave = {
            strap: strap,
            body_crown: bodyCrown,
            crown: crown,
            brim: brim,
            bill: bill,
        };

        const create = async () => {
            try {
                const response = await hatApi.createHat(pattern, partsToSave, size, submit, image);
              
                    setSucess(response);
                    setLoad();
              
            } catch (error) {
                console.log("Error:", error);
                setError( error.message);
            }
        };

        create();
    };

    const handleSizeChange = (e) => {
        const selectedSize = e.target.value;
        const difference = 0.78;
        const fix = 2;

        setBrim(prev => updateCircumDiam(size, selectedSize, prev, difference, fix));
        setCrown(prev => updateCircumDiam(size, selectedSize, prev, difference, fix));

        setStrap(prev => updateHeightWidth(size, selectedSize, prev, difference, fix));
        setBodyCrown(prev => updateHeightWidth(size, selectedSize, prev, difference, fix));

        setBill(prev => updateLengthWidth(size, selectedSize, prev, difference, fix));

        setSize(selectedSize);
    };


    const updateMeasurements = (newAdj) => {
        const fix = 2;
        setBrim(prev => updateByMaterial_CD(prev, materialAdjustment, newAdj, fix));
        setCrown(prev => updateByMaterial_CD(prev, materialAdjustment, newAdj, fix));
        setStrap(prev => updateByMaterial_HW(prev, materialAdjustment, newAdj, fix));
        setBodyCrown(prev => updateByMaterial_HW(prev, materialAdjustment, newAdj, fix));
        setBill(prev => updateByMaterial_LW(prev, materialAdjustment, newAdj, fix));
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
    //     setStrap((prev) => (check_HW(prev)));
    //     setBodyCrown((prev) => (check_HW(prev)));
    //     setCrown((prev) => (check_CD(prev)));
    //     setBrim((prev) => (check_CD(prev)));
    //     setBill((prev) => (check_LW(prev)));
    // }, [strap, bodyCrown, crown, brim, bill]);

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
                                <input type="text" placeholder="Enter Desig Name" value={name} onChange={(e) => setName(e.target.value)} />
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
                                        <span>Hats Parts</span>
                                    </div>
                                    <div className="pattern-mess-header">
                                        <div>
                                            <span>Measurement</span>
                                        </div>
                                        <div>
                                            <span>Height (inches)</span>
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
                                        <div className="messure-row-inputs standard">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Height"
                                                    value={strap.height}
                                                    onClick={inputChangeColor}
                                                    onChange={(e) => setStrap({ ...strap, height: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={strap.width}
                                                    onClick={inputChangeColor}
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
                                        <div className="messure-row-inputs standard">
                                            <div>
                                                <input
                                                    type="text"
                                                    onClick={inputChangeColor}
                                                    placeholder="Height"
                                                    value={bodyCrown.height}
                                                    onChange={(e) => setBodyCrown({ ...bodyCrown, height: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    onClick={inputChangeColor}
                                                    value={bodyCrown.width}
                                                    onChange={(e) => setBodyCrown({ ...bodyCrown, width: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="messure-row hats-mesure-label">
                                        <div className="modal-part-view"></div>
                                        <div className="messure-row-inputs standard">
                                            <div>Circumference(inches)</div>
                                            <div>Diameter(inches)</div>
                                        </div>
                                    </div>

                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/crown.png"} partName={"Crown"} />
                                            <span>Crown</span>
                                        </div>
                                        <div className="messure-row-inputs standard">
                                            <div>
                                                <input
                                                    type="text"
                                                    onClick={inputChangeColor}
                                                    placeholder="Circumference"
                                                    value={crown.circumference}
                                                    onChange={(e) => setCrown({ ...crown, circumference: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Diameter"
                                                    value={crown.diameter}
                                                    onClick={inputChangeColor}
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
                                        <div className="messure-row-inputs standard">
                                            <div>
                                                <input
                                                    type="text"
                                                    onClick={inputChangeColor}
                                                    placeholder="Circumference"
                                                    value={brim.circumference}
                                                    onChange={(e) => setBrim({ ...brim, circumference: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Diameter"
                                                    value={brim.diameter}
                                                    onClick={inputChangeColor}
                                                    onChange={(e) => setBrim({ ...brim, diameter: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="messure-row hats-mesure-label">
                                        <div className="modal-part-view"></div>
                                        <div className="messure-row-inputs standard">
                                            <div>Length(inches)</div>
                                            <div>Width(inches)</div>
                                        </div>
                                    </div>

                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                        <PartModal image={"/partsImages/bill.png"} partName={"Bill"} />
                                            <span>Visor</span>
                                        </div>
                                        <div className="messure-row-inputs standard">
                                            <div>
                                                <input
                                                    type="text"
                                                    onClick={inputChangeColor}
                                                    placeholder="Length"
                                                    value={bill.length}
                                                    onChange={(e) => setBill({ ...bill, length: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={bill.width}
                                                    onClick={inputChangeColor}
                                                    onChange={(e) => setBill({ ...bill, width: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className="modal-corp-logo hats-modal-logo">
                                <img src="/Images/tag-logo1.png" alt="" />
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </>
    );
}
