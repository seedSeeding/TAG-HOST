import { useEffect, useRef, useState } from "react";
import apiService from "../services/apiService";
import { safeParse } from "../dataTools";
import { useStateContext } from "../Providers/ContextProvider";
export const formatData = (data, current) => {
    if (data.length === 0) return [];

  
    const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    return sortedData.map((item) => {
        const formattedDate = new Date(item.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
        }); 
        
        return {
            date: formattedDate,
            version: current.created_at === item.created_at ? "Current" : "Previous",
            data: item
        };
    });
};

const filterDataByDate = (data, timePeriod) => {
    const now = new Date();
    const startDate = new Date(now.setHours(0, 0, 0, 0)); 

    return data.filter((history) => {
        const submitDate = new Date(history.created_at);
        const submitDateStartOfDay = new Date(submitDate.setHours(0, 0, 0, 0)); 

        const timeDifference = startDate - submitDateStartOfDay;
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        switch (timePeriod) {
            case 'today':
                return days === 0;
            case 'yesterday':
                return days === 1;
            case 'earlierThisWeek':
                return days > 1 && days < 7;
            case 'lastWeek':
                return days >= 7;
            case 'lastMonth':
                return days >= 30;
            case 'lastYear':
                return days >= 365;
            default:
                return days >= 730;
        }
    });
};

export default function HistoryBox(props) {
    const { setData, size_id, category, pattern_id } = props;
    const [histories, setHistories] = useState([]);
    const [current,setCurrent] = useState();
    const [today, setToday] = useState([]);
    const {reload} = useStateContext();
    const [yesterday, setYesterday] = useState([]);
    const [earlierThisWeek, setEarlierThisWeek] = useState([]);
    const [lastWeek, setLastWeek] = useState([]);
    const [lastMonth, setLastMonth] = useState([]);
    const [lastYear, setLastYear] = useState([]);
    const [moreThanAYear, setMoreThanAYear] = useState([]);
    const firstRadioRef = useRef(null);

    useEffect(() => {
        if (firstRadioRef.current) {
            firstRadioRef.current.checked = true;
        }
    }, [today, yesterday, lastWeek, lastMonth, lastYear, moreThanAYear]);
    useEffect(() => {
        const getHistory = async () => {
            try {
                const res = await apiService.get("/get-history", {
                    params: {
                        category: category,
                        size_id: size_id,
                        pattern_id: pattern_id
                    }
                });
                if (res.data.status === "success") {
                    setHistories(res.data.data);
                    const x = res.data.data;
                    setCurrent(x[0]);
                }
            } catch (error) {
                console.log(error.error);
            }
        };
        getHistory();
    }, [category, size_id, pattern_id,reload]);

    useEffect(() => {
        if (histories.length) {
            const todayData = filterDataByDate(histories, 'today');
            const yesterdayData = filterDataByDate(histories, 'yesterday');
            const lastWeekData = filterDataByDate(histories, 'lastWeek');
            const lastMonthData = filterDataByDate(histories, 'lastMonth');
            const lastYearData = filterDataByDate(histories, 'lastYear');
            const overAYearData = filterDataByDate(histories, 'moreThanAYear');
            const earlierThisWeekData = filterDataByDate(histories, 'earlierThisWeek');

            setToday(formatData(todayData,current));
            setYesterday(formatData(yesterdayData,current));
            setEarlierThisWeek(formatData(earlierThisWeekData,current));
            setLastWeek(formatData(lastWeekData,current));
            setLastMonth(formatData(lastMonthData,current));
            setLastYear(formatData(lastYearData,current));
            setMoreThanAYear(formatData(overAYearData,current));
        }
    }, [histories]);
    const dataClick = (data) => {
        const selectedData = safeParse(data.data.data);
        setData(selectedData);
        console.log("seleted DATA :::", selectedData);
    }
    return (
        <div className="history-box">
            <div className="history-header">
                <span>Version History</span>
            </div>
            <div className="history-content">
                {today.length > 0 && (
                    <div className="history-content-row">
                        <div className="history-date">
                            <span>Today</span>
                        </div>
                        {today.map((history, index) => (
                            <div key={`${history.date}-today-${history.version}` + index} className="history-row">
                                <label>
                                    <span>{history.date}</span>
                                    <span>{history.version} Version</span>
                                </label>
                                <input
                                    type="radio"
                                    name="data"
                                    ref={history.version === "Current" ? firstRadioRef : null}
                                    onClick={() => dataClick(history)}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {yesterday.length > 0 && (
                    <div className="history-content-row">
                        <div className="history-date">
                            <span>Yesterday</span>
                        </div>
                        {yesterday.map((history,index) => (
                            <div key={history + index} className="history-row">
                                <label>
                                    <span>{history.date}</span>
                                    <span>{history.version} Version</span>
                                </label>
                                <input
                                    type="radio"
                                    name="data"
                                    ref={history.version === "Current" ? firstRadioRef : null}
                                    onClick={() => dataClick(history)}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {earlierThisWeek.length > 0 && (
                    <div className="history-content-row">
                        <div className="history-date">
                            <span>Earlier This Week</span>
                        </div>
                        {earlierThisWeek.map((history,index) => (
                            <div key={history + index} className="history-row">
                                <label>
                                    <span>{history.date}</span>
                                    <span>{history.version} Version</span>
                                </label>
                                <input
                                    type="radio"
                                    name="data"
                                    ref={history.version === "Current" ? firstRadioRef : null}
                                    onClick={() => dataClick(history)}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {lastWeek.length > 0 && (
                    <div className="history-content-row">
                        <div className="history-date">
                            <span>Last Week</span>
                        </div>
                        {lastWeek.map((history,index) => (
                            <div key={history + index} className="history-row">
                                <label>
                                    <span>{history.date}</span>
                                    <span>{history.version} Version</span>
                                </label>
                                <input
                                    type="radio"
                                    name="data"
                                    ref={history.version === "Current" ? firstRadioRef : null}
                                    onClick={() => dataClick(history)}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {lastMonth.length > 0 && (
                    <div className="history-content-row">
                        <div className="history-date">
                            <span>Last Month</span>
                        </div>
                        {lastMonth.map((history,index) => (
                            <div key={history + index} className="history-row">
                                <label>
                                    <span>{history.date}</span>
                                    <span>{history.version} Version</span>
                                </label>
                                <input
                                    type="radio"
                                    name="data"
                                    ref={history.version === "Current" ? firstRadioRef : null}
                                    onClick={() => dataClick(history)}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {lastYear.length > 0 && (
                    <div className="history-content-row">
                        <div className="history-date">
                            <span>Last Year</span>
                        </div>
                        {lastYear.map((history,index) => (
                            <div key={history + index} className="history-row">
                                <label>
                                    <span>{history.date}</span>
                                    <span>{history.version} Version</span>
                                </label>
                                <input
                                    type="radio"
                                    name="data"
                                    ref={history.version === "Current" ? firstRadioRef : null}
                                    onClick={() => dataClick(history)}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {moreThanAYear.length > 0 && (
                    <div className="history-content-row">
                        <div className="history-date">
                            <span>More Than A Year</span>
                        </div>
                        {moreThanAYear.map((history,index) => (
                            <div key={history + index } className="history-row">
                                <label>
                                    <span>{history.date}</span>
                                    <span>{history.version} Version</span>
                                </label>
                                <input
                                    type="radio"
                                    name="data"
                                    ref={history.version === "Current" ? firstRadioRef : null}
                                    onClick={() => dataClick(history)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
