import { useState } from "react";
import { PatternApi } from "../Api/PatternService";
import './modals.css';
import NotifCard from "../Notifications/NotifCard";
import { useStateContext } from "../Providers/ContextProvider";
const allowedMeasures = {
    "Palm Shell":['Length','Width'], "Back Shell":['Length','Width'], "Palm Thumb":['Length','Width'],
    "Back Thumb":['Length','Width'], "Index Finger":['Length','Width'], "Middle Finger":['Length','Width'],
    "Ring Finger":['Length','Width'], "Little Finger":['Length','Width'], "Wrist":['Length','Width']
    ,
    'Strap':['Height','Width'], 'Body Crown':['Height','Width'], 'Crown':['Circumference','Diameter'],
    'Brim':['Diameter','Inside Diameter','Outside Diameter'], 'Bill':['Diameter','Inside Diameter','Outside Diameter']
    ,
    'Body':['Length','Width'], 'Fringers':['Length','Width'], 'Edges':['Length','Width']
}
const  radioDisable = (part,measure) => { 
    return !allowedMeasures[part]?.includes(measure);

}
const allowedIssues = {
    "Palm Shell": ["Too Tight", "Too Loose", "Uneven Sizing", "Length Mismatch", "Width Mismatch"],
    "Back Shell": ["Too Tight", "Too Loose", "Uneven Sizing", "Length Mismatch", "Width Mismatch"],
    "Palm Thumb": ["Too Tight", "Too Loose", "Uneven Sizing", "Height Discrepancy"],
    "Back Thumb": ["Too Tight", "Too Loose", "Asymmetrical Fit", "Height Discrepancy"],
    "Index Finger": ["Too Small", "Too Large", "Uneven Sizing", "Asymmetrical Fit"],
    "Middle Finger": ["Too Narrow", "Too Wide", "Length Mismatch"],
    "Ring Finger": ["Too Tight", "Too Short", "Width Mismatch"],
    "Little Finger": ["Too Tight", "Too Short", "Uneven Sizing"],
    "Wrist": ["Height Discrepancy", "Too Narrow"],
    "Strap": ["Too Tight", "Asymmetrical Fit"],
    "Body Crown": ["Uneven Sizing", "Height Discrepancy"],
    "Crown": ["Circumference Mismatch", "Asymmetrical Fit"],
    "Brim": ["Width Mismatch", "Too Wide"],
    "Bill": ["Length Mismatch", "Width Mismatch"],
    "Body": ["Too Short", "Width Mismatch"],
    "Fringers": ["Too Short", "Too Narrow"],
    "Edges": ["Asymmetrical Fit", "Width Mismatch"]
};

const issueAllowed = (part, issue) => {
    return allowedIssues[part]?.includes(issue);
};

export default function StatusModal(props) {
    const { category, pattern_number, size_id, onClose ,pattern_id,maker_id} = props;
    const [openRevision, setOpenRevision] = useState(false);
    const [openSubmitModal, setOpenSubmitModal] = useState(false);
    const [selectedPart, setSelectedPart] = useState("");
    const [selectedMeasurement, setSelectedMeasurement] = useState("");
    const [selectedIssue, setSelectedIssue] = useState("");
    const patternService = new PatternApi();
    const [state, setState] = useState('');

    const {user,setLoad} = useStateContext();
    const [success, setSucess] = useState('');
    const [error, setError] = useState('');

    const glovesParts = ["Palm Shell", "Back Shell", "Palm Thumb", "Back Thumb", "Index Finger",
        "Middle Finger", "Ring Finger", "Little Finger", "Wrist"
    ];
    

    const hatsParts = ['Strap', 'Body Crown', 'Crown', 'Brim', 'Bill'];
    const scarvesParts = ['Body', 'Fringers', 'Edges'];
    const parts = category === 'gloves' ? glovesParts : category === 'hats' ? hatsParts : scarvesParts;
    const measurements = [
        'Diameter', 
        'Length', 
        'Width', 
        'Height', 
        'Inside Diameter',
        'Outside Diameter'
    ];
    const issues = [
        "Too Tight",
        "Too Loose",
        "Uneven Sizing",
        "Length Mismatch",
        "Width Mismatch",
        "Height Discrepancy",
        "Asymmetrical Fit",
        "Too Small",
        "Too Large",
        "Improper Curve",
        "Too Narrow",
        "Too Short",
        "Too Wide"
    ];

    const handleSubmit = () => {
        const update = async (data) => {
            try {
                const response = await patternService.setSizeStatus(data);
                if (response) {
                    setSucess(response);
                    setLoad();
                    setTimeout(() => {
                        window.location.reload(); // Reloads the page after successful submission
                    }, 1500); // Delays the reload slightly to show the notification
                }
            } catch (error) {
                setError(error);
            }
        };
        const data = {
            evaluated_by:String(user.last_name + " " + user.first_name),
            pattern_number: pattern_number,
            size_id: size_id,
            pattern_id:pattern_id,
            user_id:maker_id,
            approval_state: state,
            reason: `${selectedPart},${selectedMeasurement},${selectedIssue}`
        };
        //console.log("data::::",data);
        update(data);
    };

    const handleSetStatus = (status) => {
        if (status === 'revision') {
            setOpenRevision(prev => !prev);
            setOpenSubmitModal(false);
        }
        else {
            setOpenSubmitModal(prev => !prev);
            setOpenRevision(false);
        }
        if(status === "dropped"){
            setState("drop");
        }else{
            setState(status);
        }
            };

    return (
        <>
            <div className="overlay status-modal">
                {success && (<NotifCard type={"s"} message={success} setMessage={setSucess} />)}
                {error && (<NotifCard type={"e"} message={error} setMessage={setError} />)}
                {
                    openRevision === false && openSubmitModal === false && (
                        <div className="status-btn-selector">
                            <div>Status</div>
                            <div onClick={() => handleSetStatus('approved')}>Approved</div>
                            <div onClick={() => handleSetStatus('dropped')}>Dropped</div>
                            <div onClick={() => handleSetStatus('revision')}>Revision</div>
                            <div onClick={() => onClose(prev => !prev)}>Close</div>
                        </div>
                    )
                }
                {openSubmitModal && (
                    <div className="confirmation-change-state-modal">
                        <div>Are you sure you want to {state}?</div>
                        <div>
                            <button onClick={() => setOpenSubmitModal(false)}>No</button>
                            <button onClick={handleSubmit}>Yes</button>
                        </div>
                    </div>
                )}

                {openRevision && (
                    <div className="revision-box-modal">
                        <div className="revision-box-modal-title">Reason For Revision</div>
                        <div className="revision-box-modal-con">
                            <div className="revision-box-modal-row">
                                <div className="radio-title">Parts</div>
                                <div className="revision-radio-con">
                                    {parts.map((value, index) => (
                                        <label key={index}>
                                            <input
                                                type="radio"
                                                name="parts"
                                                value={value}
                                                checked={selectedPart === value}
                                                onChange={() => setSelectedPart(value)}
                                            />
                                            {value}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="revision-box-modal-row">
                                <div className="radio-title">Measurements</div>
                                <div className="revision-radio-con">
                                    {measurements.map((value, index) => (
                                        <label key={index}>
                                            <input
                                                type="radio"
                                                disabled={radioDisable(selectedPart,value)}
                                                name="measurements"
                                                value={value}
                                                checked={selectedMeasurement === value}
                                                onChange={() => setSelectedMeasurement(value)}
                                            />
                                            {value}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="revision-box-modal-row">
                                <div className="radio-title">Issue</div>
                                <div className="revision-radio-con">
                                    {issues.map((value, index) => (
                                        <label key={index}>
                                            <input
                                                type="radio"
                                                name="issues"
                                                disabled={issueAllowed(selectedPart,value)}
                                                value={value}
                                                checked={selectedIssue === value}
                                                onChange={() => setSelectedIssue(value)}
                                            />
                                            {value}
                                        </label>
                                    ))}
                                </div>
                            </div>

                        </div>
                        <div className="revision-submit-btn">
                            <button onClick={() => setOpenRevision(false)}>Cancel</button>
                            <button onClick={handleSubmit}>Submit Reason</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
