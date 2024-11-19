
import { faBookOpen, faCartShopping, faFile, faFileAlt, faGear, faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PieChart from "../Charts/PieChart";
import LineChartData from "../Charts/LineChartData";
import { faFileCircleExclamation } from "@fortawesome/free-solid-svg-icons/faFileCircleExclamation";
import MixBar from "../Charts/MixBar";
import LineBarChart from "../Charts/LineBarChart";
import RainbowChart from "../Charts/RainbowChart";
import { DataApi } from "../Api/dataService";
import { useEffect, useState } from "react";
import NotificationBox from "../Notifications/NotificationBox";
import { NotificationAPi } from "../Api/notificationApi";
import { useStateContext } from "../Providers/ContextProvider";
export default function Dashboard() {
    const notificationApi = new NotificationAPi();
    const {user} = useStateContext();
    const [totalRecords, setTotalRecords] = useState({});
    const [totalStates, setTotalStates] = useState([]);
    const {token} = useStateContext();
    const [gloveStateData, setGloveStateData] = useState([]);
    const [hatStateData, setHatStateData] = useState([]);
    const [scarfStateData, setScarfStateData] = useState([]);

    const [notifications, setNotifications] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [newNotifications, setNewNotifications] = useState(false);
    const dataApi = new DataApi();

    const loadNotifications = async () => {
        try {
            const res = await notificationApi.getALlNotifications();
            if (res) {
                setNotifications(res);
                res.map((notif) => {
                    if (!notif.is_read) {
                        setNewNotifications(true);
                    }
                })
                console.log(res);
            }
        } catch (error) {
            //console.log("")
            
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
    useEffect(() => {

        const getRecords = async () => {
            try {
                const response = await dataApi.getAllDataRecords();
                setTotalRecords(response);
            } catch (error) {
                console.log("error",error);
            }
        };

        const getTotalStates = async () => {
            try {
                const response = await dataApi.getTotalStates();
                setTotalStates(response);
                console.log(response)
            } catch (error) {
                console.log(error);
            }
        };
        //alert(token)
        getRecords();
        getTotalStates();
    }, []);


    useEffect(() => {
        const getCategoryStateTotal = () => {
            setGloveStateData(totalStates.filter((elem) => elem.category === "gloves")[0]);
            setHatStateData(totalStates.filter((elem) => elem.category === "hats")[0]);
            //console.log("hats data ::",totalStates.filter((elem) => elem.category === "hats")[0])
            setScarfStateData(totalStates.filter((elem) => elem.category === "scarves")[0]);
        };

        if (totalStates.length) {
            getCategoryStateTotal();
            //    / console.log("gloves::", gloveStateData );
        }

    }, [totalStates]);


    return (
        <>
            <section className="dashboard-page">
                <div className="dashboard-header">
                <div className="designer-info">
                            {user?.image ? (
                                <img src={`/storage/${user?.image}`} className="designer-prorile" alt={`${user?.first_name} profile`} />
                            ) : (
                                <FontAwesomeIcon icon={faUser} className="request-user-icon" />
                            )}
                            
                            
                            <span>{user?.last_name || ''}</span>
                        </div>
                    {/* <div>
                        <FontAwesomeIcon icon={faGear} />
                    </div> */}
                    <div style={{cursor:"pointer"}}> 
                        <FontAwesomeIcon  icon={faBell} onClick={handleNotifToggle} />
                        {newNotifications && (<div className=" new-notifications "></div>)}
                    </div>
                </div>
                {isNotifOpen && <NotificationBox notifications={notifications} />}

                <div className="dash-total-plates-con">
                    <div className="dash-total-plate">
                        <div>
                            <span>Approved Patterns</span>
                            <span>{totalRecords.approved_total}</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faBookOpen} />
                        </div>
                    </div>

                    <div className="dash-total-plate">
                        <div>
                            <span>Issues Reported</span>
                            <span>{totalRecords.issue_reported_total}</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faFileCircleExclamation} />
                        </div>
                    </div>

                    <div className="dash-total-plate">
                        <div>
                            <span>Total Records</span>
                            <span>{totalRecords.total_records}</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faFileAlt} />
                        </div>
                    </div>

                    <div className="dash-total-plate">
                        <div>
                            <span>Total Brand</span>
                            <span>{totalRecords.total_brand}</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faCartShopping} />
                        </div>
                    </div>
                </div>

                <div className="data-visualization">
                    <div className="pie-visual">
                        <div className="pie-visual-box">
                            <PieChart categoryData={gloveStateData} title={"Gloves"}/>

                        </div>
                        <div className="pie-visual-box">
                            <PieChart categoryData={hatStateData} title={"Hats"}/>
                        </div>
                        <div className="pie-visual-box">
                            <PieChart categoryData={scarfStateData} title={"Scarves"}/>
                        </div>
                    </div>


                    <div className="data-visual-container">
                        <div className="visual-row line-chart">
                            <LineChartData />

                        </div>

                        <div className="visual-row mixbar-chart">
                            <MixBar />
                        </div>
                    </div>


                    <div className="data-visual-container">
                        <div className="visual-row line-chart">
                            <LineBarChart />

                        </div>

                        <div className="visual-row mixbar-chart">
                            <RainbowChart />
                        </div>
                    </div>
                </div>



            </section>
        </>
    );

}