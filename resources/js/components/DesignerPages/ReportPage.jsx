import { faGear, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import Selector from "../DesignerUtentils/Selector";
import CustomSelector from "../Tools/CustomeSelector";
import { useEffect, useState } from "react";
import { DataApi } from "../Api/dataService";
import NotificationBox from "../Notifications/NotificationBox";
import { NotificationAPi } from "../Api/notificationApi";
import { getSizeID, measurementList, partList } from "../dataTools";
import { useStateContext } from "../Providers/ContextProvider";
export default function ReportPage() {
    const dataAPI = new DataApi();
    const {user} = useStateContext();
    const notificationApi = new NotificationAPi();
    const [brandList, setBrandList] = useState([]);
    const sizes = ['Small', 'Medium', 'Large', 'X-Large'];
    const parts = partList;
    const categories = ['Gloves', 'Hats', 'Scarves'];

    const [notifications, setNotifications] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [newNotifications, setNewNotifications] = useState(false);

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
    const measurements = measurementList;

    const [company, setCompany] = useState("");
    const [statusSize, setStatusSize] = useState("Small");
    const [statusRecords, setStatusRecords] = useState([])
    const [analysisRecords, setAnalysisRecords] = useState([]);
    const [performanceRecords, setPerformanceRecords] = useState([]);

    const [selectedAnalysisRecordONE, setSelectedAnalysisRecordONE] = useState(0);
    const [selectedAnalysisRecordTWO, setSelectedAnalysisRecordTWO] = useState(0);
    const [selectedStatusRecord, setSelectedStatusRecord] = useState({ patterns: '', approved: '', revised: '', dropped: '' });
    const [selectedPerformanceRecord, setSelectedPerformanceRecord] = useState([]);

    const [analysisCategory, setAnalysisCategory] = useState("Gloves");
    const [analysisSize, setAnalysisSize] = useState("Small");
    const [analysisPartONE, setAnalysisPartONE] = useState('Palm Shell');
    const [analysisPartTWO, setAnalysisPartTWO] = useState('Palm Shell');
    const [measurementONE, setMeasurementONE] = useState(measurements[0]);
    const [measurementTWO, setMeasurementTWO] = useState(measurements[0]);
    const [issueONE, setIssueONE] = useState(issues[0]);
    const [issueTWO, setIssueTWO] = useState(issues[0]);
    const [performanceCategory, setPerformanceCategory] = useState("ALL");
    const [performanceBrand, setPerformanceBrand] = useState("");


    useEffect(() => {
        const getBrandList = async () => {
            try {
                const data = await dataAPI.getBrandList();
                setBrandList(data);
                setCompany(data[0]);
            } catch (error) {
                console.log(error);
            }
        };
        const getPeformanceRecords = async () => {
            try {
                const data = await dataAPI.getPerformanceOverviewRecords();
                setPerformanceRecords(data);

            } catch (error) {
                console.log(error);
            }
        };
        const getStatusOfThePattern = async () => {
            try {
                const data = await dataAPI.getStatusOfThePattern();
                setStatusRecords(data);
                //console.log("data::",data);
            } catch (error) {
                console.log("error::", error);
            }
        };
        getBrandList();
        getStatusOfThePattern();
        getPeformanceRecords();

    }, []);

    useEffect(() => {
        try {
            const data = performanceCategory === "ALL" ? performanceRecords.find(item => item.category) :
                                                         performanceRecords.find(item => item.category === String(performanceCategory).toLowerCase());  
            if (data) {
                const filteredData = performanceBrand === "" ? data.records  : data.records.filter(p => String(p.brand).includes(performanceBrand));
                if (filteredData) {
                    //console.log("meron::",filteredData);
                    setSelectedPerformanceRecord(filteredData);
                } else {
                    setSelectedPerformanceRecord([]);
                }
            } else {
                setSelectedPerformanceRecord([]);
            }
        } catch (error) {
            console.log(error);
        }
    }, [performanceBrand, performanceCategory, performanceRecords]);
    useEffect(() => {
        const getAnalysisReport = async () => {
            try {
                const data = await dataAPI.getAnalysisReport(analysisCategory, analysisSize);
                setAnalysisRecords(data);
                //console.log("data::",data);
            } catch (error) {
                console.log("error::", error);
            }
        };
        getAnalysisReport();
    }, [analysisCategory, analysisSize])

    useEffect(() => {
        const getRecords = (brand, size) => {
            try {
                const data = statusRecords.find((record) => record.brand === brand);
                if (data) {
                    const records = data.totals;
                    const record = records.find((elem) => elem.size_id === getSizeID(size));
                    if (record) {
                        setSelectedStatusRecord(record.data);
                    }
                }
            } catch (error) {
                console.log("error:: ", error);
            }
        }
        getRecords(company, statusSize);
    }, [statusSize, company,brandList]);

    const getAnalysisData = (company, part, measure, issue) => {
        try {

            const data = analysisRecords[company]?.find(record => {
                const reason = record.reasons.split(",");
                //console.log("reason ::", reason);

                if (reason.length < 3) {
                    console.warn("Record does not have expected parts:", record);
                    return false;
                }

                return (
                    reason[0] === part &&
                    reason[1] === measure &&
                    reason[2] === issue
                );
            });
            //console.log(data);
            if (data) return data.frequencies;
            return [];
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const data = getAnalysisData(company, analysisPartONE, measurementONE, issueONE);
        if (data) {
            setSelectedAnalysisRecordONE(Math.abs(data.percentage));
            //console.log("selected data ::", data.percentage)
        } else {
            setSelectedAnalysisRecordONE(0);
        }
        //console.log("filtered data ::", data.percentage);
    }, [analysisPartONE, measurementONE, issueONE, company, analysisSize, analysisCategory, analysisRecords]);

    useEffect(() => {
        const data = getAnalysisData(company, analysisPartTWO, measurementTWO, issueTWO);
        if (data) {
            setSelectedAnalysisRecordTWO(Math.abs(data.percentage));
            // console.log("selected data ::", data.percentage);
        } else {
            setSelectedAnalysisRecordTWO(0);
        }
        // console.log("filtered data ::", data.percentage);
    }, [analysisPartTWO, measurementTWO, issueTWO, company, analysisSize, analysisCategory, analysisRecords]);
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
    return (
        <>
            <div
                className="report-section designer-content"
                style={{ backgroundImage: "url('/Images/ribon-2.png'),url('Images/ribon-3.png')" }}>

                <div className="report-page-header">
                    <div className="report-header-con">
                        <h1 className="report-header-title">Pattern Reports</h1>
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
                                {newNotifications && (<div className=" new-notifications data-notif"></div>)}
                            </div>

                        </div>
                    </div>
                </div>
                {isNotifOpen && <NotificationBox notifications={notifications} />}
                <div className="report-main-content">
                    <div className="designer-rep-main">
                        <div className="designer-rep-main-row">
                            <Selector className="pattern-status-report-box" title={"Status of the Pattern"} fixedOpen={true}>
                                <div className="status-report-row">
                                    <CustomSelector values={brandList} className="report-selector" setValue={setCompany} value={company} />
                                    <CustomSelector values={sizes} className="report-selector" setValue={setStatusSize} value={statusSize} />
                                </div>
                                <div className="status-report-row">
                                    <span>Brand Company</span>
                                    <span>{company || ''}</span>
                                </div>
                                <div className="status-report-row">
                                    <span>Total Number Of Patterns</span>
                                    <span>{selectedStatusRecord.patterns || 0}</span>
                                </div>
                                <div className="status-report-row">
                                    <span>Total Approved Patterns</span>
                                    <span>{selectedStatusRecord.approved || 0}</span>
                                </div>
                                <div className="status-report-row">
                                    <span>Total Revised Patterns</span>
                                    <span>{selectedStatusRecord.revised || 0}</span>
                                </div>
                                <div className="status-report-row">
                                    <span>Total Dropped Patterns</span>
                                    <span>{selectedStatusRecord.dropped || 0}</span>
                                </div>
                            </Selector>
                            <Selector className="pattern-analysis-report-box" title={"Fit Issue Anylysis"} fixedOpen={true}>
                                <div className="analysis-report-row ">
                                    <CustomSelector values={categories} setValue={setAnalysisCategory} value={analysisCategory} />
                                    <CustomSelector values={sizes} setValue={setAnalysisSize} value={analysisSize} />
                                </div>
                                <div className="analysis-report-row">
                                    <span>Brand Company</span>
                                    <span>{company || ''}</span>
                                </div>

                                <table className="analysis-table">
                                    <thead>
                                        <tr>
                                            <th>Parts</th>
                                            <th >Measurement</th>
                                            <th className="anaylysis-table-issue">Issue</th>
                                            <th>Frequency</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <select className="anaylysis-selector" name="" id="" value={analysisPartONE} onChange={(e) => setAnalysisPartONE(e.target.value)}>
                                                    {parts.map((val, index) => (
                                                        <option key={index} value={val}>{val}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <select className="anaylysis-selector" name="" id="" value={measurementONE} onChange={(e) => setMeasurementONE(e.target.value)}>
                                                    {measurements.map((val, index) => (
                                                        <option key={index} value={val}>{val}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <select className="anaylysis-selector" name="" id="" value={issueONE} onChange={(e) => setIssueONE(e.target.value)}>
                                                    {issues.map((val, index) => (
                                                        <option key={index} value={val}>{val}</option>
                                                    ))}
                                                </select>
                                            </td>

                                            <td>
                                                {selectedAnalysisRecordONE || '0'}%
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <select className="anaylysis-selector" name="" id="" value={analysisPartTWO} onChange={(e) => setAnalysisPartTWO(e.target.value)}>
                                                    {parts.map((val, index) => (
                                                        <option key={index} value={val}>{val}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <select className="anaylysis-selector" name="" id="" value={measurementTWO} onChange={(e) => setMeasurementTWO(e.target.value)}>
                                                    {measurements.map((val, index) => (
                                                        <option key={index} value={val}>{val}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <select className="anaylysis-selector" name="" id="" value={issueTWO} onChange={(e) => setIssueTWO(e.target.value)}>
                                                    {issues.map((val, index) => (
                                                        <option key={index} value={val}>{val}</option>
                                                    ))}
                                                </select>
                                            </td>

                                            <td>
                                                {selectedAnalysisRecordTWO || '0'}%
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>

                            </Selector>
                        </div>
                        <div className="designer-rep-main-row">
                            <Selector title={"Performance Overview"} fixedOpen={true}>
                                <div className="adj-accuracy-header">
                                    <div className="search">
                                        <FontAwesomeIcon icon={faSearch} className="fa-search" />
                                        <input type="text" placeholder="Search Company" value={performanceBrand} onChange={(e) => setPerformanceBrand(e.target.value)} />
                                    </div>
                                    <div className="adj-accuracy-selector">
                                        <CustomSelector values={["ALL", "Gloves", "Hats", "Scarves"]} setValue={setPerformanceCategory} value={performanceCategory} />
                                    </div>
                                </div>
                                <table className="adj-accuracy-table">
                                    <thead>
                                        <tr>
                                            <th>Company</th>
                                            <th>Total Patterns Submitted</th>
                                            <th>Approved Patterns</th>
                                            <th>Frequency</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            selectedPerformanceRecord.map((data) => (
                                                <tr key={data.brand || 0}>
                                                    <td>{data.brand || 0}</td>
                                                    <td>{data.total_patterns || 0}</td>
                                                    <td>{data.total_approved || 0}</td>
                                                    <td>{data.adjusment_accuray || 0}%</td>
                                                </tr>
                                            ))
                                        }

                                    </tbody>
                                </table>
                            </Selector>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}