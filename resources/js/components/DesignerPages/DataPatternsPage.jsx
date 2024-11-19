import { faGear, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import Selector from "../DesignerUtentils/Selector";
import { useEffect, useState } from "react";
import { DataApi } from "../Api/dataService";
import NotificationBox from "../Notifications/NotificationBox";
import { NotificationAPi } from "../Api/notificationApi";
import { formatDATEYYYMMDD, getSizeID, measurementList, partList, safeParse } from "../dataTools";
import { useStateContext } from "../Providers/ContextProvider";
export default function DataPatternPage() {
    const dataAPI = new DataApi();
    const notificationApi = new NotificationAPi();
    const [data, setData] = useState([]);
    const {user} = useStateContext();
    const [selectedData, setSelectedData] = useState([]);
    const [brand, setBrand] = useState("");
    const [brandList, setBrandList] = useState([]);
    const [category, setCategory] = useState("gloves");
    const [searchValue, setSearchValue] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false); 
    const [newNotifications,setNewNotifications] = useState(false);
    
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
            //alert(error);
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
        const getBrandList = async () => {
            try {
                const res = await dataAPI.getBrandList();
                
                setBrandList(res);
                setBrand(res[0]);
            } catch (error) {
                alert("Error fetching brand list: " + error);
            }
        };
        getBrandList();
    }, []);


    useEffect(() => {
        const getData = async () => {
            try {
                const res = await dataAPI.getAllRecords();
                //console.log("res::", res)
                if (res) {
                    setData(res);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, []);


    useEffect(() => {
        const filterData = () => {
            // alert(searchValue);
            const selectedDataRecord = data[category.toLowerCase()] || [];

            if (!brand) return [];

            return selectedDataRecord.filter(record =>
                record.brand === brand && String(record.pattern_number).includes(String(searchValue))
            );
        };

        setSelectedData(filterData());
        // alert("data filtered")
    }, [brand, category, data, searchValue]);


    useEffect(() => {
        selectedData.forEach(record => {
            record[category.toLowerCase()].forEach(item => {
                // console.log("Selected data approval state:", item.approval_state);
            });
        });
    }, [selectedData]);

    return (
        <>
            <div
                className="report-section designer-content data-set-content"
                style={{ backgroundImage: "url('Images/ribon-2.png'),url('Images/ribon-3.png')" }}>
                <div className="report-page-header">
                    <div className="report-header-con">
                        <h1 className="report-header-title">Pattern Records</h1>
                        <div className="report-control-con">

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
                            { newNotifications && (<div className=" new-notifications data-notif"></div>)}
                        </div>                        </div>
                    </div>
                </div>
                {isNotifOpen && <NotificationBox notifications={notifications} />}
                <div className="report-main-content">
                    <div className="bg-white p-2 rounded-xl min-h-[90%] relative"  >
                        <div className="designer-rep-main-row">

                            <div className="rounded-xl border-b-[20px]  border-b-[#373839] border border-[#373839]">

                                <div className="pattern-records-row sticky p-5 rounded-t-xl top-0 bg-[#373839]" >
                                    <div className="search pat-rec">
                                        <FontAwesomeIcon icon={faSearch} className="fa-search" />
                                        <input type="text" placeholder="Search Pattern" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />

                                    </div>
                                    <select name="" id="" value={brand} onChange={(e) => setBrand(e.target.value)} className="selector orange small">
                                        {
                                            brandList?.map((b) => (
                                                <option value={b} key={b}>{b}</option>
                                            ))
                                        }
                                    </select>
                                    <select name="" id="" value={category} onChange={(e) => setCategory(e.target.value)} className="selector orange">
                                        <option value="gloves">Gloves</option>
                                        <option value="hats">Hats</option>
                                        <option value="scarves">Scarves</option>
                                    </select>
                                </div>
                                <div className="table-container date-set-table bg-[#373839]">
                                    {
                                        category === "scarves" && (
                                            <table className="pattern-records-table ">
                                                <thead>
                                                    <tr>
                                                       
                                                        <th>ID</th>
                                                        <th>CATEGORY</th>
                                                        <th>BRAND</th>
                                                        <th>NAME</th>
                                                        <th>OUTER MATERIAL</th>
                                                        <th>LINING MATERIAL</th>
                                                        <th>SIZE</th>
                                                        <th>BODY (Length)</th>
                                                        <th>BODY (Width)</th>
                                                        <th>FRINGES (Length)</th>
                                                        <th>FRINGES (Width)</th>
                                                        <th>EDGES (Length)</th>
                                                        <th>EDGES (Width)</th>
                                                        <th>Submit Date</th>
                                                        <th>Evaluvation Date</th>
                                                        <th>Status</th>
                                                        <th>PATTERN DESIGN</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedData && selectedData.map((record) => (
                                                        record["scarves"]?.map((item) => (
                                                            item.submitted ? (
                                                                <tr key={item.id}>
                                                                    
                                                                    <td>{record.pattern_number}</td>
                                                                    <td>Scarves</td>
                                                                    <td>{record.brand}</td>
                                                                    <td>{record.name}</td>
                                                                    <td>{record.outer_material}</td>
                                                                    <td>{record.lining_material}</td>
                                                                    <td>{item.size_id}</td>
                                                                    <td>{safeParse(item.body).length}</td>
                                                                    <td>{safeParse(item.body).width}</td>
                                                                    <td>{safeParse(item.fringers).length}</td>
                                                                    <td>{safeParse(item.fringers).width}</td>
                                                                    <td>{safeParse(item.edges).length}</td>
                                                                    <td>{safeParse(item.edges).width}</td>
                                                                    <td>{formatDATEYYYMMDD(item.submit_date)}</td>
                                                                    <td>{formatDATEYYYMMDD(item.approval_time)}</td>
                                                                    <td>{item.approval_state}</td>
                                                                    <td className="record-row-image"><a target="_blank" href={`/storage/${record.image}`}>Image</a></td>
                                                                </tr>
                                                            ) : null
                                                        ))
                                                    ))}

                                                    <tr className="table-data-seperator">
                                                        <td colSpan={16}></td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        )
                                    }
                                    {
                                        category === "gloves" && (
                                            <table className="pattern-records-table" >
                                                <thead>
                                                    <tr>
                                                      
                                                        <th>ID</th>
                                                        <th>CATEGORY</th>
                                                        <th>BRAND</th>
                                                        <th>DESIGN NAME</th>
                                                        <th>OUTER MATERIAL</th>
                                                        <th>LINING MATERIAL</th>
                                                        <th>SIZE</th>
                                                        <th>Palm Shell (Length)</th>
                                                        <th>Palm Shell (Width)</th>
                                                        <th>Back Shell (Length)</th>
                                                        <th>Back Shell (Width)</th>
                                                        <th>Palm Thumb (Length)</th>
                                                        <th>Palm Thumb (Width)</th>
                                                        <th>Back Thumb (Length)</th>
                                                        <th>Back Thumb (Width)</th>
                                                        <th>Index Finger (Length)</th>
                                                        <th>Index Finger (Width)</th>
                                                        <th>Middle Finger (Length)</th>
                                                        <th>Middle Finger (Width)</th>
                                                        <th>Ring Finger (Length)</th>
                                                        <th>Ring Finger (Width)</th>
                                                        <th>Little Finger (Length)</th>
                                                        <th>Little Finger (Width)</th>
                                                        <th>Wrist (Length)</th>
                                                        <th>Wrist (Width)</th>
                                                        <th>Submit Date</th>
                                                        <th>Evaluation Date</th>
                                                        <th>Status</th>
                                                        <th>PATTERN DESIGN</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedData && selectedData.map((record) => (
                                                        record["gloves"]?.map((item) => (
                                                            item.submitted ? (
                                                                <tr key={item.id}>
                                                                   
                                                                    <td>{record.pattern_number}</td>
                                                                    <td>Gloves</td>
                                                                    <td>{record.brand}</td>
                                                                    <td>{record.name}</td>
                                                                    <td>{record.outer_material}</td>
                                                                    <td>{record.lining_material}</td>
                                                                    <td>{item.size_id}</td>
                                                                    <td>{safeParse(item.palm_shell).length}</td>
                                                                    <td>{safeParse(item.palm_shell).width}</td>
                                                                    <td>{safeParse(item.black_shell).length}</td>
                                                                    <td>{safeParse(item.black_shell).width}</td>
                                                                    <td>{safeParse(item.palm_thumb).length}</td>
                                                                    <td>{safeParse(item.palm_thumb).width}</td>
                                                                    <td>{safeParse(item.back_thumb).length}</td>
                                                                    <td>{safeParse(item.back_thumb).width}</td>
                                                                    <td>{safeParse(item.index_finger).length}</td>
                                                                    <td>{safeParse(item.index_finger).width}</td>
                                                                    <td>{safeParse(item.middle_finger).length}</td>
                                                                    <td>{safeParse(item.middle_finger).width}</td>
                                                                    <td>{safeParse(item.ring_finger).length}</td>
                                                                    <td>{safeParse(item.ring_finger).width}</td>
                                                                    <td>{safeParse(item.little_finger).length}</td>
                                                                    <td>{safeParse(item.little_finger).width}</td>
                                                                    <td>{safeParse(item.wrist).length}</td>
                                                                    <td>{safeParse(item.wrist).width}</td>
                                                                    <td>{formatDATEYYYMMDD(item.submit_date)}</td>
                                                                    <td>{formatDATEYYYMMDD(item.approval_time)}</td>
                                                                    <td>{item.approval_state}</td>
                                                                    <td className="record-row-image"><a target="_blank" href={`/storage/${record.image}`}>Image</a></td>
                                                                </tr>
                                                            ) : null
                                                        ))
                                                    ))}

                                                    < tr className="table-data-seperator" >
                                                        <td colSpan={28}></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )
                                    }
                                    {
                                        category === "hats" && (
                                            <table className="pattern-records-table">
                                                <thead>
                                                    <tr>
                                                    
                                                        <th>ID</th>
                                                        <th>CATEGORY</th>
                                                        <th>BRAND</th>
                                                        <th>NAME</th>
                                                        <th>OUTER MATERIAL</th>
                                                        <th>LINING MATERIAL</th>
                                                        <th>SIZE</th>
                                                        <th>STRAP (HEIGHT)</th>
                                                        <th>STRAP (WIDTH)</th>
                                                        <th>BODY CROWN (HEIGHT)</th>
                                                        <th>BODY CROWN (WIDTH)</th>
                                                        <th>CROWN (CIRCUMFERENCE)</th>
                                                        <th>CROWN (DIAMETER)</th>
                                                        <th>BRIM (CIRCUMFERENCE)</th>
                                                        <th>BRIM (WIDTH)</th>
                                                        <th>BILL (LENGTH)</th>
                                                        <th>BILL (WIDTH)</th>
                                                        <th>Submit Date</th>
                                                        <th>Evaluation Date</th>
                                                        <th>Status</th>
                                                        <th>PATTERN DESIGN</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedData && selectedData.map((record) => (
                                                        record["hats"]?.map((item) => (
                                                            item.submitted ? (
                                                                <tr key={item.id}>
                                                                    
                                                                    <td>{record.pattern_number}</td>
                                                                    <td>Hats</td>
                                                                    <td>{record.brand}</td>
                                                                    <td>{record.name}</td>
                                                                    <td>{record.outer_material}</td>
                                                                    <td>{record.lining_material}</td>
                                                                    <td>{item.size_id}</td>
                                                                    <td>{safeParse(item.strap).height}</td>
                                                                    <td>{safeParse(item.strap).width}</td>
                                                                    <td>{safeParse(item.body_crown).height}</td>
                                                                    <td>{safeParse(item.body_crown).width}</td>
                                                                    <td>{safeParse(item.crown).circumference}</td>
                                                                    <td>{safeParse(item.crown).diameter}</td>
                                                                    <td>{safeParse(item.brim).circumference}</td>
                                                                    <td>{safeParse(item.brim).width}</td>
                                                                    <td>{safeParse(item.bill).length}</td>
                                                                    <td>{safeParse(item.bill).width}</td>
                                                                    <td>{formatDATEYYYMMDD(item.submit_date)}</td>
                                                                    <td>{formatDATEYYYMMDD(item.approval_time)}</td>
                                                                    <td >{item.approval_state}</td>
                                                                    <td className="record-row-image"><a target="_blank" href={`/storage/${record.image}`}>Image</a></td>
                                                                </tr>
                                                            ) : null
                                                        ))
                                                    ))}
                                                    <tr className="table-data-seperator">
                                                        <td colSpan={20}></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )
                                    }

                                </div>
                            </div>



                        </div>

                    </div>
                </div >
            </div >
        </>
    );

}