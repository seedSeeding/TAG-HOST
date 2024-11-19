import { useState } from "react";
import StatusModal from "./StatusModal";
import PartModal from "../MakerModals/PartModal";
import { useStateContext } from "../Providers/ContextProvider";
import { dateFormatter } from "../dataTools";
export default function StatusGLoveModal(prop) {
    const { patternData, sizeData, onClose } = prop;
    const [statusModal, setStatusModal] = useState(false);
    const parseSizeData = (data) => {
        return data ? JSON.parse(data) : { length: '', width: '' };
    };
    console.log(patternData);
    return (
        <>
            <div className="maker-modal-overlay">
                <div className="maker-create-modal">
                    <div className="modal-pattern-content">
                        <div className="modal-pattern-image">
                            {patternData.image && (<img src={`/storage/${patternData.image}`} alt="Glove" />)}
                            <input type="file" disabled />
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
                        <div className="modal-corp-logo">
                            <img src="/Images/tag-logo1.png" alt="Logo" />
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
                        <div className="modal-pattern-messurement">
                            <div className="modal-table-con designer">
                                <div className="modal-table-header">
                                    <div className="parts-images">
                                        <span>Glove Parts</span>
                                    </div>
                                    <div className="pattern-mess-header">
                                        <div>
                                            <span>Measurement</span>
                                        </div>
                                        <div>
                                            <span>Length Inches</span>
                                            <span>Width Inches</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-table designer">
                                    {/* Palm Shell */}
                                    <div className="messure-row">
                                        <div className="modal-part-view">
                                            <PartModal image={"/partsImages/palmshell.png"} partName={"Palm Shell"} />
                                            <span>Palm Shell</span>
                                        </div>
                                        <div className="messure-row-inputs">
                                            <div>
                                                <input type="text" placeholder="Length" value={parseSizeData(sizeData.palm_shell).length} disabled />
                                            </div>
                                            <div>
                                                <input type="text" placeholder="Width" value={parseSizeData(sizeData.palm_shell).width} disabled />
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
                                                <input type="text" placeholder="Length" value={parseSizeData(sizeData.black_shell).length} disabled />
                                            </div>
                                            <div>
                                                <input type="text" placeholder="Width" value={parseSizeData(sizeData.black_shell).width} disabled />
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
                                                <input type="text" placeholder="Length" value={parseSizeData(sizeData.palm_thumb).length} disabled />
                                            </div>
                                            <div>
                                                <input type="text" placeholder="Width" value={parseSizeData(sizeData.palm_thumb).width} disabled />
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
                                                <input type="text" placeholder="Length" value={parseSizeData(sizeData.back_thumb).length} disabled />
                                            </div>
                                            <div>
                                                <input type="text" placeholder="Width" value={parseSizeData(sizeData.back_thumb).width} disabled />
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
                                                <input type="text" placeholder="Length" value={parseSizeData(sizeData.index_finger).length} disabled />
                                            </div>
                                            <div>
                                                <input type="text" placeholder="Width" value={parseSizeData(sizeData.index_finger).width} disabled />
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
                                                <input type="text" placeholder="Length" value={parseSizeData(sizeData.middle_finger).length} disabled />
                                            </div>
                                            <div>
                                                <input type="text" placeholder="Width" value={parseSizeData(sizeData.middle_finger).width} disabled />
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
                                                <input type="text" placeholder="Length" value={parseSizeData(sizeData.ring_finger).length} disabled />
                                            </div>
                                            <div>
                                                <input type="text" placeholder="Width" value={parseSizeData(sizeData.ring_finger).width} disabled />
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
                                                <input type="text" placeholder="Length" value={parseSizeData(sizeData.little_finger).length} disabled />
                                            </div>
                                            <div>
                                                <input type="text" placeholder="Width" value={parseSizeData(sizeData.little_finger).width} disabled />
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
                                                <input type="text" placeholder="Length" value={parseSizeData(sizeData.wrist).length} disabled />
                                            </div>
                                            <div>
                                                <input type="text" placeholder="Width" value={parseSizeData(sizeData.wrist).width} disabled />
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
