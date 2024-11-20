import { useState } from "react";
import StatusModal from "./StatusModal";
import PartModal from "../MakerModals/PartModal";
import { useStateContext } from "../Providers/ContextProvider";
import { dateFormatter } from "../dataTools";
export default function StatusHatModal(props) {
    const { patternData, sizeData, onClose } = props;
    //salert(patternData.evaluated_by);
    const [statusModal, setStatusModal] = useState(false);
    const parseSizeLW = (data) => {
        return data ? JSON.parse(data) : { length: '', width: '' };
    };
    const parseSizeCD = (data) => {
        return data ? JSON.parse(data) : { circumference: '', diameter: '' };
    };
    const parseSizeHW = (data) => {
        return data ? JSON.parse(data) : { height: '', width: '' };
    };

    return (
        <>
            <div className="maker-modal-overlay">
                <div className="maker-create-modal">
                    <div className="modal-pattern-content">
                        <div className="modal-pattern-image">
                            {patternData.image && (<img src={`/storage/${patternData.image}`} alt="Scarf" />)}
                            <input type="file" />
                        </div>
                        <div className="modal-pattern-controls">
                            <div className="modal-control-box">
                                <input type="text" value={patternData.pattern_number} disabled />
                                <span>Pattern Number</span>
                            </div>
                            <div className="modal-control-box">
                                <input type="text" value={patternData.category} disabled />
                                <span>Category</span>
                            </div>
                            <div className="modal-control-box">
                                <input type="text" value={patternData.brand} disabled />
                                <span>Brand</span>
                            </div>
                            <div className="modal-control-box">
                                <input type="text" value={patternData.name} disabled />
                                <span>Name</span>
                            </div>
                            <div className="modal-control-box">
                                <input type="text" value={patternData.outer_material} disabled />
                                <span>Outer Material</span>
                            </div>
                            <div className="modal-control-box">
                                <input type="text" value={patternData.lining_material} disabled />
                                <span>Lining Material</span>
                            </div>
                        </div>

                    </div>

                    <div className="modal-right-content">
                        <div className="close-modal">
                            <button onClick={onClose}>
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
                            <span className="text-orange title " >Approval Pattern</span>
                            <span className="rounded-label orange p-2 min-w-[140px]">{sizeData.size_id === 1 ? "Small" :
                                sizeData.size_id === 2 ? "Medium" :
                                    sizeData.size_id === 3 ? "Large" : "X-Large"}</span>
                            <button onClick={() => setStatusModal(prev => !prev)}>Status</button>
                            <div></div>
                        </div>
                        {statusModal && (
                            <StatusModal category={patternData.category} pattern_number={patternData.pattern_number} size_id={sizeData.size_id} maker_id={patternData.maker_id} pattern_id={patternData.id} onClose={setStatusModal} />
                        )}
                        <div className="modal-pattern-measurement">
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
                                            <span>Length (inches)</span>
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
                                                    value={parseSizeHW(sizeData.strap).height} disabled />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={parseSizeHW(sizeData.strap).width} disabled
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
                                                    value={parseSizeHW(sizeData.body_crown).height} disabled
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={parseSizeHW(sizeData.body_crown).width} disabled
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
                                                    value={parseSizeCD(sizeData.crown).circumference} disabled
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Diameter"
                                                    value={parseSizeCD(sizeData.crown).diameter} disabled
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
                                                    value={parseSizeCD(sizeData.brim).circumference} disabled
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Diameter"
                                                    value={parseSizeCD(sizeData.brim).diameter} disabled
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
                                                    value={parseSizeLW(sizeData.bill).length} disabled
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Width"
                                                    value={parseSizeLW(sizeData.bill).width} disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="status-bottom-date">
                            <div>
                                    <span>{dateFormatter(sizeData.submit_date)[1]}</span>
                                    <span>Submitted date</span>
                                </div>
                                <div>
                                    <span>{dateFormatter(sizeData.approval_time)[1]}</span>
                                    <span>Approve Date</span>
                                </div>
                                
                            </div>
                            <div className="modal-corp-logo scarves-modal-corp hats">
                                <img src="/Images/tag-logo1.png" alt="Logo" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
