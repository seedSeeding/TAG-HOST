import { useEffect, useState } from "react";

export default function PartModal(props) {
    const { partName, image } = props;
    const [open, setOpen] = useState(false);

    return (
        <>
            <button onClick={() => setOpen(true)}>
                <img src="/Images/image-logo.png" alt="" className="part-image" />
            </button>
            {open && (
                <div className="overlay flex items-center justify-center relative cursor-pointer" onClick={() => setOpen(false)}>
                    <div
                        className="bg-[#D9D9D9] rounded-3xl max-w-[600px] max-h-[600px] w-[90%] shadow-lg relative"
                        
                    >
                        <div className="part-modal-header rounded-t-3xl">
                            <p>
                                <strong>{partName}</strong>
                            </p>
                        </div>
                        <div className="w-full h-full relative   flex items-top justify-center overflow-hidden p-2 object-contain">
                            <img
                                className="w-full h-[78%] rounded-xl bg-white object-contain"
                                src={image}
                                alt={partName}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
