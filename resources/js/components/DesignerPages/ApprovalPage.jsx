import { faGear, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { PatternApi } from "../Api/PatternService";
import { useEffect, useState } from "react";
import StatusGLoveModal from "../DesignerUtentils/StatusGLoveModal";
import StatusHatModal from "../DesignerUtentils/StatusHatModal";
import { capitalizeWords, getSizeName, getSizeNameByID, getStatusColor } from "../dataTools";
import StatusScarfModal from "../DesignerUtentils/StatusScarfModal";
import SearchPattern from "../DesignerUtentils/SearchPattern";
import NotificationBox from "../Notifications/NotificationBox";
import { NotificationAPi } from "../Api/notificationApi";
import { getExcelDataRevisons } from "../getRevisions";
import { revisionsData } from "../UpdateTools/revisionsUpdate";
import { useStateContext } from "../Providers/ContextProvider";
import NotifCard from "../Notifications/NotifCard";

export default function ApprovalPage() {
    const patternService = new PatternApi();
    const {user,reload} = useStateContext();
    const [info,setInfo] = useState('');
    const notificationApi = new NotificationAPi();
    const [notifications, setNotifications] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false); 
    const [newNotifications,setNewNotifications] = useState(false);
    
    const [patterns, setPatterns] = useState([]);
    const [filteredPatterns, setFilteredPatterns] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [category, setCategory] = useState("All");
    const [modalData, setModalData] = useState(null);
    const [modal, setModal] = useState('');
    const [searchValue, setSearchValue] = useState('');

    



    const fetchPatterns = async () => {
        try {
            const response = await patternService.getPatternRequests();
            setPatterns(response);
            setFilteredPatterns(response);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchPatterns();
    }, [reload]);

    const handleModalOpen = (data, category) => {
        if (data.submitted) {
            setModal(category);
            setModalData(data);
            setIsModalOpen(true);
        } else {
            setInfo("No records have been submitted yet.");
            return;
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(prev => !prev);
    };

    const applyFilters = () => {
        let updatedPatterns = patterns;

        if (category !== "All") {
            updatedPatterns = updatedPatterns.filter((pattern) => pattern.category === category);
        }

        if (searchValue !== "") {
            updatedPatterns = updatedPatterns.filter((pattern) =>
                String(pattern.pattern_number).includes(searchValue)
            );
        }

        setFilteredPatterns(updatedPatterns);
    };

    useEffect(() => {
        applyFilters();
    }, [category, searchValue]);

    const loadNotifications = async () => {
        try {
            const res = await notificationApi.getALlNotifications();
            if (res) {
                setNotifications(res);
                res.map((notif) => {
                    if(!notif.is_read){
                        setNewNotifications(true);
                    }
                })
                //console.log(res);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadNotifications();

        const interval = setInterval(() => {
            loadNotifications();
        }, 10000); 

        return () => clearInterval(interval);
    }, []);

  
    const handleNotifToggle = () => {
        setIsNotifOpen(prev => !prev);
        
        
        if (!isNotifOpen) {

            notificationApi.markAllAsRead().catch(error => console.error('Error marking notifications as read:', error));
            setNewNotifications(false)
        }
    };

    return (
        <div

            className="requests-section designer-content"
            style={{ backgroundImage: "url('/Images/ribon-2.png'),url('Images/ribon-3.png')" }}>
              {info &&   <NotifCard type={'i'} message={info} setMessage={setInfo}/>}
            <div className="request-page-header">
                <div className="request-header-con">
                    <h1 className="request-header-title">Pattern Approval</h1>

                    <div className="request-control-con">
                        <div className="request-search">
                            <FontAwesomeIcon icon={faSearch} />
                            <input type="text" placeholder="Search Pattern" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                        </div>
                        <div className="designer-info">
                            {user?.image ? (
                                <img src={`/storage/${user?.image}`} className="designer-prorile" alt={`${user?.first_name} profile`} />
                            ) : (
                                <FontAwesomeIcon icon={faUser} className="request-user-icon" />
                            )}
                            
                            
                            <span>{user?.last_name || ''}</span>
                        </div>
                        <div>
                            {/* <FontAwesomeIcon icon={faGear} className="request-setting-icon" /> */}
                            <FontAwesomeIcon icon={faBell} className="request-notif-icon" onClick={handleNotifToggle} />
                            { newNotifications && (<div className=" new-notifications"></div>)}
                        </div>
                    </div>
                </div>
            </div>

            {isNotifOpen && <NotificationBox notifications={notifications} />}
            
            <div className="request-main-content">
                <div className="request-table-filter">
                    <select name="" id="" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="All">All</option>
                        <option value="gloves">Gloves</option>
                        <option value="hats">Hats</option>
                        <option value="scarves">Scarves</option>
                    </select>
                </div>

                <div className="designer-rec-main">
                    {filteredPatterns.map((pattern, index) => (
                        <div className="designer-rec-plate" key={index}>
                            <div className="designer-rec-img">
                                {pattern.image && (<img src={`/storage/${pattern.image}`} alt={`Pattern ${pattern.patternNo}`} />)}
                            </div>
                            <div className="designer-rec-info">
                                <span>Pattern No.: {pattern.pattern_number}</span>
                                <span>Category: {capitalizeWords(pattern.category)}</span>
                                <span>Brand: {pattern.brand}</span>
                                {/* <span>Submitted on: {pattern.submittedOn}</span> */}
                            </div>
                            <div className="designer-rec-status">
                                {pattern[pattern.category].map((size, sizeIndex) => (
                                    <div
                                        onClick={() => handleModalOpen(size, pattern)}
                                        className="designer-rec-status-box"
                                        key={sizeIndex}
                                        style={{
                                            backgroundColor: size.submitted ? getStatusColor(size.approval_state) : "white"
                                        }}
                                    >{getSizeNameByID(size.size_id)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                modal.category === "gloves" ? (
                    <StatusGLoveModal patternData={modal} sizeData={modalData} onClose={handleModalClose} />
                ) : modal.category === "hats" ? (
                    <StatusHatModal patternData={modal} sizeData={modalData} onClose={handleModalClose} />
                ) : modal.category === "scarves" ? (
                    <StatusScarfModal patternData={modal} sizeData={modalData} onClose={handleModalClose} />
                ) : null
            )}

        </div>
    );
}
