import { faFile, faFolder, faGear, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import Selector from "../DesignerUtentils/Selector";
import CustomSelector from "../Tools/CustomeSelector";
import { useEffect, useState } from "react";
import { DataApi } from "../Api/dataService";
import NotificationBox from "../Notifications/NotificationBox";
import { NotificationAPi } from "../Api/notificationApi";
import { capitalizeWords, generateRandomPN, getSizeID, measurementList, partList } from "../dataTools";
import { useStateContext } from "../Providers/ContextProvider";
import { generateRep } from "./pdf";
import EditDoc from "./html/EditDoc";
export default function ReportPage() {
    const dataAPI = new DataApi();
    const { user } = useStateContext();
    const notificationApi = new NotificationAPi();
    const [brandList, setBrandList] = useState([]);
    const sizes = ['Small', 'Medium', 'Large', 'X-Large'];
    const analysisSizes = ['All', 'Small', 'Medium', 'Large', 'X-Large'];
    const [parts, setParts] = useState([]);
    const categories = ['Gloves', 'Hats', 'Scarves'];
    const [controls, setControls] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [newNotifications, setNewNotifications] = useState(false);
    const glovesParts = ["Palm Shell", "Back Shell", "Palm Thumb", "Back Thumb", "Index Finger",
        "Middle Finger", "Ring Finger", "Little Finger", "Wrist"
    ];


    const hatsParts = ['Strap', 'Body Crown', 'Crown', 'Brim', 'Bill'];
    const scarvesParts = ['Body', 'Fringes', 'Edges'];
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
    const [download,setDownload] = useState({});
    const [selectedStatusRecord, setSelectedStatusRecord] = useState({ patterns: '', approved: '', revised: '', dropped: '' });
    const [selectedPerformanceRecord, setSelectedPerformanceRecord] = useState([]);

    const [analysisCategory, setAnalysisCategory] = useState("Gloves");
    const [analysisSize, setAnalysisSize] = useState("All");

    const [performanceCategory, setPerformanceCategory] = useState("ALL");
    const [performanceBrand, setPerformanceBrand] = useState("");
    const [anaylysisData, setAnalysisData] = useState([]);


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
        setAnalysisCategory("Gloves")

    }, []);


    useEffect(() => {
        try {
            const data = performanceCategory === "ALL" ? performanceRecords.find(item => item.category) :
                performanceRecords.find(item => item.category === String(performanceCategory).toLowerCase());
            if (data) {
                const filteredData = performanceBrand === "" ? data.records : data.records.filter(p => String(p.brand).includes(performanceBrand));
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
                // console.log("analysisss::", data);
            } catch (error) {
                console.log("error::", error);
            }
        };
        getAnalysisReport();
    }, [analysisCategory, analysisSize, company])

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
    }, [statusSize, company, brandList]);

    const getAnalysisData = (company) => {
        try {
            setAnalysisData([]);
            analysisRecords[company]?.map(record => {
                const reason = record.reasons.split(",");
                if (reason.length < 3) {
                    console.warn("Record does not have expected parts:", record);
                    return false;
                }
                // console.log("precentage", record)
                setAnalysisData(prevData => [
                    ...prevData,
                    {
                        part: reason[0],
                        measurement: reason[1],
                        issue: reason[2],
                        percentage: record.frequencies.percentage
                    }
                ]);


            });
            console.log("issues::",analysisRecords[company]);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        setAnalysisData([]);
        getAnalysisData(company);
    }, [analysisRecords]);


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
    const dlRecords = (brand, size) => {
        try {
            const data = statusRecords.find((record) => record.brand === brand);
            if (data) {
                const sizesData = data.totals;
                return {
                    small: sizesData[0].data,
                    medium: sizesData[1].data,
                    large: sizesData[2].data,
                    xLarge: sizesData[3].data,
                }
            }
        } catch (error) {
            console.log("error:: ", error);
        }
    }
    const getAnalysisReportSize = async (issueSize) => {
        try {
            const data = await dataAPI.getAnalysisReport(analysisCategory, issueSize);
            return data;
        } catch (error) {
        }
    };

    const dlIssues = async () => {
        try {
            const companyIssuesS = await getAnalysisReportSize('Small');
            const companyIssuesM = await getAnalysisReportSize('Medium');
            const companyIssuesL = await getAnalysisReportSize('Large');
            const companyIssuesXL = await getAnalysisReportSize('X-Large');
            const companyIssuesAll = await getAnalysisReportSize('All');
            const reasons = companyIssuesAll[company].map(rec => {
                return rec.reasons;
            });
            return {
                companyIssuesS: getIssuesP(companyIssuesS[company]),
                companyIssuesM:getIssuesP(companyIssuesM[company]),
                companyIssuesL: getIssuesP(companyIssuesL[company]),
                companyIssuesXL:getIssuesP(companyIssuesXL[company]),
                companyIssuesAll:getIssuesP(companyIssuesAll[company]),
                reasons:reasons
            };
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    };
    const formatIssues = (dataIssues) => {
        let formattedIssues = [];
        dataIssues.reasons.forEach(rec => {
            const re =  String(rec); // reason to text -> 'Wrist,Width,Too Tight'
            const fr = re.split(',');
            formattedIssues.push({
                reason: `${fr[0]} ${fr[1]} ${fr[2]}`,
                allSizes: dataIssues.companyIssuesAll[rec] || 0,
                small: dataIssues.companyIssuesS[rec] || 0,
                medium: dataIssues.companyIssuesM[rec] || 0,
                large: dataIssues.companyIssuesL[rec] || 0,
                extraLarge: dataIssues.companyIssuesXL[rec]|| 0
            });
        });
        return formattedIssues;
    }
    const getIssuesP = (data) => {
        let a = {};
        data.map((rec) => {
            a[`${rec.reasons}`] = rec.frequencies.percentage
        });
        return a;
    }
    const downloadData = async (category) => {
        const sizesDATA = dlRecords(company, statusSize);
        const dataIssues = await dlIssues();
        //formatIssues(dataIssues);
        // console.log(dataIssues.companyIssuesAll["Wrist,Width,Too Tight"]);
        //console.log("issues::",formatIssues(dataIssues));
        const rowData = formatIssues(dataIssues);
        const brands = [
            'UGG',
            'VANS',
            'COLEHAAN',
            'KOOLABURRA',
            'HOKA',
            'DILLARDS',
            'FRANCES VALENTINE',
            'THE NORTH FACE',
            'ECCO',
            'AQUA',
            'BELK'
        ];

        const bransData = {};
        selectedPerformanceRecord.forEach(rec => {
            if (brands.includes(rec.brand)) {
                bransData[rec.brand] = [
                    rec.total_patterns || 0,
                    rec.total_approved || 0,
                    rec.adjusment_accuray || 0
                ];
            }
        });
       
        const dataToDownload = {
            number: generateRandomPN(),
            category: capitalizeWords(category),
            name: `${user?.first_name} ${user?.last_name}`,
            brand: company,

            smallValue: sizesDATA.small.patterns,
            smallApproved: sizesDATA.small.approved,
            smallRevised: sizesDATA.small.revised,
            smallDropped: sizesDATA.small.dropped,

            mediumValue: sizesDATA.medium?.patterns || 0,
            mediumApproved: sizesDATA.medium?.approved || 0,
            mediumRevised: sizesDATA.medium?.revised || 0,
            mediumDropped: sizesDATA.medium?.dropped || 0,

            largeValue: sizesDATA.large?.patterns || 0,
            largeApproved: sizesDATA.large?.approved || 0,
            largeRevised: sizesDATA.large?.revised || 0,
            largeDropped: sizesDATA.large?.dropped || 0,

            extraLargeValue: sizesDATA.xLarge?.patterns || 0,
            extraLargeApproved: sizesDATA.xLarge?.approved || 0,
            extraLargeRevised: sizesDATA.xLarge?.revised || 0,
            extraLargeDropped: sizesDATA.xLarge?.dropped || 0,

            // Populate brand data dynamically
            uggSubmitted: bransData['UGG']?.[0] || 0,
            uggApproved: bransData['UGG']?.[1] || 0,
            uggFrequency: bransData['UGG']?.[2] || 0,

            vansSubmitted: bransData['VANS']?.[0] || 0,
            vansApproved: bransData['VANS']?.[1] || 0,
            vansFrequency: bransData['VANS']?.[2] || 0,

            colehaanSubmitted: bransData['COLEHAAN']?.[0] || 0,
            colehaanApproved: bransData['COLEHAAN']?.[1] || 0,
            colehaanFrequency: bransData['COLEHAAN']?.[2] || 0,

            koolaburraSubmitted: bransData['KOOLABURRA']?.[0] || 0,
            koolaburraApproved: bransData['KOOLABURRA']?.[1] || 0,
            koolaburraFrequency: bransData['KOOLABURRA']?.[2] || 0,

            hokaSubmitted: bransData['HOKA']?.[0] || 0,
            hokaApproved: bransData['HOKA']?.[1] || 0,
            hokaFrequency: bransData['HOKA']?.[2] || 0,

            dillardsSubmitted: bransData['DILLARDS']?.[0] || 0,
            dillardsApproved: bransData['DILLARDS']?.[1] || 0,
            dillardsFrequency: bransData['DILLARDS']?.[2] || 0,

            francesValentineSubmitted: bransData['FRANCES VALENTINE']?.[0] || 0,
            francesValentineApproved: bransData['FRANCES VALENTINE']?.[1] || 0,
            francesValentineFrequency: bransData['FRANCES VALENTINE']?.[2] || 0,

            eccoSubmitted: bransData['ECCO']?.[0] || 0,
            eccoApproved: bransData['ECCO']?.[1] || 0,
            eccoFrequency: bransData['ECCO']?.[2] || 0,

            aquaSubmitted: bransData['AQUA']?.[0] || 0,
            aquaApproved: bransData['AQUA']?.[1] || 0,
            aquaFrequency: bransData['AQUA']?.[2] || 0,

            belkSubmitted: bransData['BELK']?.[0] || 0,
            belkApproved: bransData['BELK']?.[1] || 0,
            belkFrequency: bransData['BELK']?.[2] || 0,

            theNorthFaceSubmitted: bransData['THE NORTH FACE']?.[0] || 0,
            theNorthFaceApproved: bransData['THE NORTH FACE']?.[1] || 0,
            theNorthFaceFrequency: bransData['THE NORTH FACE']?.[2] || 0,
        };
        if(rowData && dataToDownload){
            console.log(dataToDownload);
            setDownload({rowData,dataToDownload});
        }
        // console.log(dataToDownload);
    };

    return (
        <>
            <div
                className="report-section designer-content"
                style={{ backgroundImage: "url('/Images/ribon-2.png'),url('Images/ribon-3.png')" }}>
                {download && <EditDoc rowData={download.rowData} dataToDownload={download.dataToDownload} setDownload={setDownload}/>}
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
                            <div className="download-con">
                                <button className="download-btn" onClick={() => setControls(prev => !prev)}><img src="/Images/download.png" alt="" /></button>

                                {controls && (
                                    <div className="donwload-controls">
                                        <div>Select a Report Type</div>
                                        <button onClick={() => downloadData('gloves')}><img src="/Images/glove.png" alt="" />Glove Reports</button>
                                        <button onClick={() => downloadData('hats')}><img src="/Images/hat.png" alt="" />Hats Reports</button>
                                        <button onClick={() => downloadData('scarves')}><img src="/Images/scarve.png" alt="" />Scarves Reports</button>
                                    </div>
                                )}
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
                                    <CustomSelector values={analysisSizes} setValue={setAnalysisSize} value={analysisSize} />
                                </div>
                                <div className="analysis-report-row">
                                    <span>Brand Company</span>
                                    <span>{company || ''}</span>
                                </div>

                                <div className="analysis-table-con">
                                    <table
                                        className="analysis-table"

                                        id="analysis-table"
                                    >
                                        <thead>
                                            <tr>
                                                <th>Parts</th>
                                                <th >Measurement</th>
                                                <th className="anaylysis-table-issue">Issue</th>
                                                <th>Frequency</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(anaylysisData) && anaylysisData?.map(rec => (
                                                <tr>
                                                    <td>
                                                        {rec.part}
                                                    </td>
                                                    <td>
                                                        {rec.measurement}
                                                    </td>
                                                    <td>
                                                        {rec.issue}
                                                    </td>

                                                    <td>
                                                        {rec.percentage || '0'}%
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
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