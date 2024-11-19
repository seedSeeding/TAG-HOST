import { faCancel, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { capitalizeWords, dateFormatter } from "../dataTools";
import { useEffect, useState } from "react";
const formatSizeData = (size, setSizeFunction, sizeLabel) => {
    if (size) {
        const formattedData = [
            size.approval_state === 'revision' ? String(size.reason).replace(",", ' ') : size.approval_state,
            dateFormatter(size.approval_time)[1]
        ];
        setSizeFunction(formattedData);
    } else {
        setSizeFunction('');
        console.log(`${sizeLabel} size data is missing.`);
    }
}

export default function MakerViewStatus(prop) {
    const { data, onCLose } = prop;
    const [small, setSmall] = useState();
    const [medium, setMedium] = useState();
    const [large, setLarge] = useState();
    const [xLarge, setXLarge] = useState();



    useEffect(() => {
        try {
            const categoryData = data?.[data.category];

            if (categoryData) {

                const s = categoryData.find(item => item.size_id === 1);
                const m = categoryData.find(item => item.size_id === 2);
                const l = categoryData.find(item => item.size_id === 3);
                const xl = categoryData.find(item => item.size_id === 4);


                if (categoryData) {
                    formatSizeData(s, setSmall, "Small");
                    formatSizeData(m, setMedium, "Medium");
                    formatSizeData(l, setLarge, "Large");
                    formatSizeData(xl, setXLarge, "X-Large");
                } else {
                    console.log("categoryData is undefined");
                }
            } else {
                console.log("categoryData is undefined");
            }
        } catch (error) {
            console.error("Error in MakerViewStatus useEffect:", error);
        }
    }, [data]);
    return (
        <>
            <div className="maker-modal-overlay">
                <div className="maker-view-status">
                    <div className="view-status-header">
                        <img src="/Images/tag-logo1.png" alt="" />
                        <button onClick={() => onCLose(false)}><img src="/Images/x-image.png" alt="" /></button>
                    </div>
                    <div className="view-status-content">
                        <div className="top-view-content">
                            <div>
                                <span className="view-orange-text">Pattern No:</span><span>{data?.pattern_number || ''}</span>
                                <span>Pattern Name:</span> <span>{data?.name || ''}</span>
                                <span>Category:</span> <span>{capitalizeWords(data?.category || '') || ''}</span>
                                <span>Brand:</span> <span>{data?.brand}</span>
                                <span>Lining Material:</span> <span>{data?.lining_material || ''}</span>
                                <span>Outer Material: </span><span>{data?.outer_material || ''}</span>
                                {/* <span>Craeted Date: </span><span>{dateFormatter(data?.created_at)[2

                                ] || ''}</span> */}

                            </div>
                            <div className="view-image-box">
                                {data.image && (<img src={`/Storage/${data.image}`} alt="" />)}
                            </div>
                        </div>
                        <div className="bottom-view-content">
                            <div>Evaluation Status:</div>
                            <div className="view-size-status">
                                <span>Small:</span><span>{small && small[0]}</span><span>{small && small[1]}</span>
                                <span>Medium:</span> <span>{medium && medium[0]}</span><span>{ medium && medium[1]}</span>
                                <span>Large:</span> <span>{large && large[0]}</span><span>{large && large[1] }</span>
                                <span>X-Large:</span> <span>{xLarge && xLarge[0]}</span><span>{xLarge && xLarge[1] }</span>
                            </div>
                            <div>
                                Approved By: {data?.evaluated_by || 'unknown'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
