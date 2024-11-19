import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faArrowAltCircleLeft, faArrowAltCircleDown, faLessThanEqual } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { PatternApi } from '../Api/PatternService';
import { capitalizeWords, dateFormatter, formatDATEYYYMMDD, getSizeName, getStatusColor, saveJSONToFile } from '../dataTools';
import MakerViewStatus from '../MakerModals/MakerViewStatus';
import Circles from '../../Loaders.jsx/Circles';
import { DataApi } from '../Api/dataService';
import { toFixPatterns } from '../toFix';
import { useStateContext } from '../Providers/ContextProvider';
export default function PatternRecordsPage() {
    const patternApi = new PatternApi();
    const dataAPI = new DataApi();
    const {user} = useStateContext();
    const [data, setData] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState();
    const [loading, setLoading] = useState(true);
    const [load, setLoad] = useState(false);
    const [category, setCategory] = useState("all");
    const [brand, setBrand] = useState("all");
    const [brandList, setBrandList] = useState([]);

    const handleOpenModal = (data) => {
        setOpenModal(true);
        setModalData(data);
    };

    useEffect(() => {
        const getBrandList = async () => {
            try {
                const res = await dataAPI.getBrandList();
                setBrandList(res);
                setBrand("all");
            } catch (error) {
                console.error("Error fetching brand list:", error);
            }
        };
        getBrandList();
    }, []);

    useEffect(() => {
        const getUserData = async (id) => {
            setLoading(true);
            try {
                const res = await patternApi.getRecordsOfMaker(id);
                setData(res);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
                setLoad(false);
            }
        };
        getUserData(user?.id);
    }, [load]);
    

    useEffect(() => {
        const filterData = () => {
            if (data.length === 0) return;

            const filtered = data.filter((record) => {
                const matchesSearch = String(record.pattern_number).includes(searchValue.trim());
                const matchesCategory = category === "all" || record.category === category;
                const matchesBrand = brand === "all" || record.brand === brand;
                return matchesSearch && matchesCategory && matchesBrand;
            });
            setFilteredRecords(filtered);
        };
        filterData();
    }, [data, searchValue, category, brand]);

    return (
        <>
            <section className="section pattern-rec-section">
                <header className='pattern-rec-header'>
                    <div >
                        <Link className='back-to-home' to={'/maker/home'}><svg width={46} height={46} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 12H5" />
                            <path d="m12 19-7-7 7-7" />
                        </svg>
                        </Link>
                        <img src="Images/tag-logo2.png" alt="" className='pattern-tag-logo' />
                        <span>Pattern Status</span>
                    </div>
                    <div >
                        <div className='rec-search-con'>
                            <svg width={46} height={46} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 3a8 8 0 1 0 0 16 8 8 0 1 0 0-16z" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <input type="text" placeholder="Search Pattern" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                        </div>
                        <select name="" id="" className='selector orange small' value={brand} onChange={(e) => setBrand(e.target.value)}>
                            <option value="all">Company</option>
                            {brandList &&
                                brandList.map((val) => (
                                    <option value={val} key={val}>{val}</option>
                                ))
                            }
                        </select>
                        <select name="" id="" className='selector orange small' value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="all">Filter</option>
                            <option value="gloves">Gloves</option>
                            <option value="hats">Hats</option>
                            <option value="scarves">Scarves</option>
                        </select>
                        {/* <FontAwesomeIcon icon={faArrowAltCircleDown} className="rec-down-arrow" />
                        <Link className='rec-settings-btn'><FontAwesomeIcon icon={faGear} /></Link> */}
                    </div>
                </header>
                <main className='pattern-rec-main'>
                    {loading && (<Circles />)}
                    {
                        filteredRecords && filteredRecords?.map((record) => (
                            // onClick={() => handleOpenModal(record)}
                            <div className='pattern-rec-plate' key={record.pattern_number} onClick={() => handleOpenModal(record)}>
                                <div className='pattern-rec-img'>
                                    {record.image && (<img src={`/storage/${record.image}`} alt="" />)}
                                </div>
                                <div className='pattern-rec-info'>
                                    <span>Pattern No.: #{record.pattern_number}</span>
                                    <span>Category: {capitalizeWords(record.category)}</span>
                                    <span>Brand: {record.brand}</span>
                                    {/* <span>Submitted on: {dateFormatter(record.created_at)[1]}</span> */}
                                    {/* <UpdateImage setLoad={setLoad} pattern_number={record.pattern_number} /> */}
                                </div>
                                <div className='pattern-rec-status maker'>
                                    {
                                        record[record.category]?.map((item) => (
                                            <div className='rec-status-box' style={{ backgroundColor: getStatusColor(item.approval_state) }} key={record.pattern_number + item.size_id}>{getSizeName(item.size_id)[1]}</div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </main>
                {openModal && (<MakerViewStatus onCLose={setOpenModal} data={modalData} />)}
            </section>
        </>
    );
}