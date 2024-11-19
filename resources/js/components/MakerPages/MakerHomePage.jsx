import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGear, faDoorClosed, faDoorOpen, faL, faBell } from '@fortawesome/free-solid-svg-icons';
import { json, Link } from "react-router-dom";
import GlovesModal from '../MakerModals/GlovesModal';
import ScarvesModal from '../MakerModals/ScarvesModal';
import HatsModal from '../MakerModals/Hats.Modal';
import { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import ViewGlovesModal from '../MakerModals/ViewGloveModal';
import ViewScarfModal from '../MakerModals/ViewScarfModal';
import ViewHatModal from '../MakerModals/ViewHatModal';
import { NotificationAPi } from '../Api/notificationApi';
import MakerNotificationBox from '../Notifications/MakerNotificationBox';
import { useStateContext } from '../Providers/ContextProvider';
import LogoutModal from '../Notifications/LogoutModal';
import { capitalizeWords } from '../dataTools';
// import { getDataFromExcelGloves, getExcelDataGloves } from '../../convertTools';
// import { GloveAPI } from '../Api/GLoveApi';
// import UpdateImage from '../UpdateTools/UpdateImage';
// import { getImage } from '../dataTools';
// import { PatternApi } from '../Api/PatternService';
// import { pattern_numbers } from '../UpdateTools/patterns';
// import LogoutModal from '../Notifications/LogoutModal';
// import { ScarfAPI } from '../Api/ScarfApi';
// import { getHatsDataFromExcelScarves } from '../../getScarvesData';
// import { scarvesDatSet } from '../DataSets/scarves';
// import { HatAPI } from '../Api/HatApi';
// import { getHatsData } from '../../getHatsData';
// import { glovesDatSetList } from '../UpdateTools/DataSetList';

export default function MakerHomePage() {
    const { user, token, reload } = useStateContext();
    const notificationApi = new NotificationAPi();
    const [searchVal, setSearchVal] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [newNotifications, setNewNotifications] = useState(false);
    const [logout, setLogout] = useState(false);
    const [activeCreateModal, setActiveCreateModal] = useState("Gloves");
    const [openCreateModal, setCreateOpenModal] = useState(false);
    const [activeViewModal, setViewModal] = useState("Gloves");
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedData, setSelectedData] = useState(null);


    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const [load, setLoad] = useState(false);

    useEffect(() => setActiveCreateModal('Gloves'), [openCreateModal]);

    useEffect(() => {
        apiService.get(`patterns/maker/${user?.id}`)
            .then((response) => {
                if (response.status === 200) {
                    setData(response.data);
                    setLoad(false);
                }
            }).catch((error) => {
                alert(error.error);
            });

    }, [user,reload])
    const handleOpenView = (item) => {

        setOpenViewModal(true)
        setSelectedData(item)
    };
    const loadNotifications = async () => {
        try {
            const res = await notificationApi.getALlNotificationsByID(user?.id);
            if (res) {
                const sortedData = res.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setNotifications(sortedData);
                res.map((notif) => {
                    if (!notif.is_read) {
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
    }, [user]);

    useEffect(() => {
        //alert(token);
        // alert(storage)
        loadNotifications();

        const interval = setInterval(() => {
            loadNotifications();
        }, 60000);

        return () => clearInterval(interval);
    }, []);


    const handleNotifToggle = () => {
        setIsNotifOpen(prev => !prev);


        if (!isNotifOpen) {

            notificationApi.markAllAsReadByID(1).catch(error => console.error('Error marking notifications as read:', error));
            setNewNotifications(false)
        }
    };

    useEffect(() => {
        if (searchVal !== '') {
            const filtered = data
                .filter((item) => String(item.pattern_number).includes(searchVal));
            //console.log(filtered);
            setFilteredData(filtered);
        } else {
            setFilteredData([]);
        }
    }, [searchVal]);
    const handleSearchChange = (e) => {
        setSearchVal(e.target.value);
        console.log(e.target.value);
    };
    return (
        <>
            {openCreateModal &&
                activeCreateModal === "Gloves" ? (<GlovesModal setCreateOpenModal={setCreateOpenModal}
                    setActiveCreateModal={setActiveCreateModal}
                    activeCreateModal={activeCreateModal} />) :
                activeCreateModal === "Scarves" ? (<ScarvesModal setCreateOpenModal={setCreateOpenModal}
                    setActiveCreateModal={setActiveCreateModal}
                    activeCreateModal={activeCreateModal} />) :
                    activeCreateModal === "Hats" ? (<HatsModal setCreateOpenModal={setCreateOpenModal}
                        setActiveCreateModal={setActiveCreateModal}
                        activeCreateModal={activeCreateModal} />) :
                        (<></>)
            }
            <section className="maker-page section">
                <header className="maker-header">

                    <img src={`/Images/maker-header-bg.png`} alt="" className="maker-bg-image" />
                    <div className="maker-header-top">
                        <div className="maker-search">
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
                                <path d="M11 3a8 8 0 1 0 0 16 8 8 0 1 0 0-16z" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <input type="text" placeholder='Type here..' value={searchVal} onChange={handleSearchChange} />
                            {filteredData.length !== 0 && (
                                <div className='search-box'>

                                    <div >
                                        {filteredData && filteredData?.map((item, index) => (
                                            <button key={index} onClick={() => handleOpenView(item)} className='tooltip'>
                                                  <span class="tooltiptext">{capitalizeWords(item.category)}</span>
                                                {String(item.pattern_number)}
                                               
                                            </button>
                                        ))}
                                        
                                    </div>
                                 
 


                                </div>
                            )}
                        </div>

                        {/* <Link className="maker-user-btn">
                            <FontAwesomeIcon icon={faUser} />
                            <span>USER</span>
                        </Link> */}
                        <div className={newNotifications && "maker-new-notifications "}>
                            <FontAwesomeIcon icon={faBell} className="request-notif-icon " onClick={handleNotifToggle} />
                        </div>
                        <Link className="maker-logout-btn" >
                            <FontAwesomeIcon icon={faDoorOpen} onClick={() => setLogout(true)} />
                        </Link>
                        {logout && <LogoutModal setLogout={setLogout} />}
                    </div>
                    <div className='maker-header-middle '  >
                        <img src={`/Images/tag-logo1.png `} alt="tag_logo" />
                    </div>

                </header>
                {isNotifOpen && <MakerNotificationBox notifications={notifications} />}
                <div className="maker-header-bottom">

                    <div className='header-content'>
                        <div className='maker-user'>
                            <img src={`/storage/${user?.image}`} alt="" className="maker-profile" />
                            <div className="maker-info">
                                <span className="maker-user-name">{user?.first_name} {user?.last_name}</span>
                                <span className="maker-user-email">{user?.email}</span>
                            </div>
                        </div>
                        <div className="maker-create-record">
                            <button className="maker-btn " onClick={() => setCreateOpenModal(true)}>
                                <img src="/Images/create-pattern-logo.png" alt="" />
                                Create Pattern Record
                            </button>
                            <Link className="maker-btn" to="/maker/records">
                                <img src="/Images/box.svg" alt="" />
                                Pattern Status
                            </Link>
                        </div>
                    </div>

                </div>
                <main className='maker-main'>
                    <div className='maker-cards'>
                        <div className='maker-cards-title'>
                            <span>Design Pattern</span>
                        </div>
                        <div className='maker-cards-container'>
                            {
                                data.map((item) => (
                                    <div className='maker-pattern-card' key={item.id}>
                                        <div className='maker-card-img'>
                                            {item.image && (<img src={`/storage/${item.image}`} alt="" />)}
                                            <div ></div>
                                        </div>
                                        <div className='maker-card-info'>
                                            <div>
                                                <span>Pattern # {item.pattern_number}</span>
                                                <span>Category: {String(item.category).toUpperCase()}</span>
                                                <span>Brand: {String(item.brand).toUpperCase()}</span>
                                            </div>
                                            <div>
                                                <button onClick={() => handleOpenView(item)}>View</button>
                                            </div>
                                        </div>



                                    </div>

                                ))
                            }

                            {openViewModal && selectedData && (
                                selectedData.category === "gloves" ? (
                                    <ViewGlovesModal setOpenViewModal={setOpenViewModal} data={selectedData} />
                                ) : selectedData.category === "scarves" ? (
                                    <ViewScarfModal setOpenViewModal={setOpenViewModal} data={selectedData} />
                                ) : selectedData.category === "hats" ? (
                                    <ViewHatModal setOpenViewModal={setOpenViewModal} data={selectedData} />
                                ) : null
                            )}


                            {data.length <= 0 && (<h1 className='text-[#A9A0A0BD] bold text-2xl'>You haven't Created any Patterns yet!</h1>)}
                        </div>
                    </div>
                </main>
            </section>
        </>
    );
}