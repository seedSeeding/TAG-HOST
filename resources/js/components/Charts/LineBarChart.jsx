
import { BarChart, ComposedChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import React, { useEffect, useState } from 'react';
import CustomSelector from '../Tools/CustomeSelector';
import { DataApi } from '../Api/dataService';
import { capitalizeWords, getBrandList, getSizeID, safeParse } from '../dataTools';
import { getStandardMeasureLarge, getStandardMeasureMedium, getStandardMeasureSmall, getStandardMeasureXLarge } from '../StandardMeasurements/StandardMeasures';
import SearchPattern from '../DesignerUtentils/SearchPattern';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faLineChart, faUnderline } from '@fortawesome/free-solid-svg-icons';
import { faGripLinesVertical } from '@fortawesome/free-solid-svg-icons/faGripLinesVertical';
import { faGripLines } from '@fortawesome/free-solid-svg-icons/faGripLines';


const getName = (name) => {
    return capitalizeWords(String(name).replace("_", " "));
}
const getGloveMeasurement = (partData, getStandarMeasure) => {
    const glove = [];
    for (const key in partData) {
        const measure = safeParse(partData[key]);
        let actualName = getName(key);
        const standardMeasure = getStandarMeasure(actualName);
        if(actualName === "Little Finger"){
            actualName = "Pinky Finger";
        }else if(actualName === "Black Shell"){
            actualName = "Back Shell";
        }
        glove.push({
            name: actualName,
            standardLength: standardMeasure[0],
            standardWidth: standardMeasure[1],
            adjustedLength: measure.length,
            adjustedWidth: measure.width
        });
    }
    return glove;
}
const getHatMeasurement = (partData, getStandarMeasure) => {
    const hatMeasurements = [];
    for (const key in partData) {
        const measure = safeParse(partData[key]);
        const actualName = getName(key);
        const standardMeasure = getStandarMeasure(actualName);
        if (actualName === "Crown" || actualName === "Brim") {
            hatMeasurements.push({
                name: actualName,
                StandardCircumference: standardMeasure[0],
                StandardDiameter: standardMeasure[1],
                StandardHeight: null,
                standardLength: null,
                standardWidth: null,
                adjustedCircumference: measure.circumference,
                adjustedDiameter: measure.diameter,
                adjustedLength: null,
                adjustedWidth: null,
                adjustedHeight: null

            });
        } else if (actualName === "Bill") {
            hatMeasurements.push({
                name: "Visor",
                StandardCircumference: null,
                StandardDiameter: null,
                StandardHeight: null,
                standardLength: standardMeasure[0],
                standardWidth: standardMeasure[1],

                adjustedCircumference: null,
                adjustedDiameter: null,
                adjustedLength: measure.length,
                adjustedWidth: measure.width,
                adjustedHeight: null

            });
        } else {
            hatMeasurements.push({
                name: actualName,
                StandardCircumference: null,
                StandardDiameter: null,
                StandardHeight: standardMeasure[0],
                standardLength: null,
                standardWidth: standardMeasure[1],

                adjustedCircumference: null,
                adjustedDiameter: null,
                adjustedLength: null,
                adjustedWidth: measure.width,
                adjustedHeight: measure.height
            });
        }


    }
    return hatMeasurements;
}

const getScarfMeasurement = (partData, getStandarMeasure) => {
    const scarfMeasurements = [];
    for (const key in partData) {
        const measure = safeParse(partData[key]);
        const actualName = getName(key);
        const standardMeasure = getStandarMeasure(actualName);
        scarfMeasurements.push({
            name: actualName,
            standardLength: standardMeasure[0],
            standardWidth: standardMeasure[1],
            adjustedLength: measure.length,
            adjustedWidth: measure.width
        });
    }
    return scarfMeasurements;
}

export default function LineBarChart() {
    // const [brand, setBrand] = useState("");
    // const [brandList, setBrandList] = useState([]);
    const [size, setSize] = useState('Medium');
    const sizeList = ['Small', 'Medium', 'Large', 'X-Large'];
    const [patternList, setPatternList] = useState();
    const [category, setCategory] = useState("");

    const [selectedPattern, setSelectedPattern] = useState('');
    const [records, setRecords] = useState('');
    const dataApi = new DataApi();
    const [data, setData] = useState();
    const [activeCategory, setActiveCategory] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await dataApi.getALlPartsMeasurements();
                if (res) {
                    setRecords(res);
                    console.log(res);


                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);
    
    useEffect(() => {
        const findRecord = async () => {
            try {
                if (Array.isArray(records)) {

                    const pattern = records.find(p => p.pattern_number === selectedPattern);
                    if (pattern) {

                        const selectedSize = pattern[pattern.category].find(sizeData => sizeData.size_id === getSizeID(size));
                        setCategory(pattern.category);
                        if (selectedSize) {
                            let partData;
                            const sizeID = selectedSize.size_id;
                            const getStandarMeasure = sizeID === 1 ? getStandardMeasureSmall :
                                sizeID === 2 ? getStandardMeasureMedium :
                                    sizeID === 3 ? getStandardMeasureLarge : getStandardMeasureXLarge;
                            if (pattern.category === "gloves") {
                                partData = {
                                    palm_shell: selectedSize.palm_shell,
                                    black_shell: selectedSize.black_shell,
                                    wrist: selectedSize.wrist,
                                    palm_thumb: selectedSize.palm_thumb,
                                    back_thumb: selectedSize.back_thumb,
                                    index_finger: selectedSize.index_finger,
                                    middle_finger: selectedSize.middle_finger,
                                    ring_finger: selectedSize.ring_finger,
                                    little_finger: selectedSize.little_finger,
                                };
                                setData(getGloveMeasurement(partData, getStandarMeasure));
                            } else if (pattern.category === 'hats') {
                                partData = {
                                    strap: selectedSize.strap,
                                    body_crown: selectedSize.body_crown,
                                    crown: selectedSize.crown,
                                    brim: selectedSize.brim,
                                    bill: selectedSize.bill,
                                };
                                setData(getHatMeasurement(partData, getStandarMeasure));
                            } else if (pattern.category === 'scarves') {
                                partData = {
                                    body: selectedSize.body,
                                    fringers: selectedSize.fringers,
                                    edges: selectedSize.edges,
                                };
                                setData(getScarfMeasurement(partData, getStandarMeasure));
                            }
                            setActiveCategory(pattern.category);
                        }
                    }
                }
            } catch (error) {
                console.error("Error finding record:", error);
            }
        };
        findRecord();
    }, [size, selectedPattern, records]);

    useEffect(() => {
        if (Array.isArray(records) && records.length > 0) {

            const patternNumbers = records;
            if (patternNumbers.length > 0) {
                setPatternList(patternNumbers);
                //console.log(`pattern numbers of ${brand}`,patternNumbers);
            } else {
                setPatternList([]);
            }
        } else {
            setPatternList([]);
        }
        
    }, [records]);
    useEffect(() => {
        if (Array.isArray(records) && records.length > 0) {
            const firstcat =  records.filter((a) => a.category === "gloves")
            setSelectedPattern(firstcat[0].pattern_number);  
        }
    },[records])

    useEffect(() => {
        console.log(`${activeCategory} Measurements:`, data);

    }, [data]);

    return (
        <div className='line-chart-data-box'>
            <div className='chart-header line-bar-header'>
                <span>Adjustments by Pattern</span>
                <div className="chart-selectors rainbow-selectors">
                    {/* <CustomSelector setValue={setBrand} value={brand} values={brandList} /> */}
                    {/* <CustomSelector setValue={setSize} value={size} values={sizeList} /> */}
                  
                    <SearchPattern setValue={setSelectedPattern} value={selectedPattern} patterns={patternList} />
                    <div className='title orange small rounded-label orange'>
                        {capitalizeWords(String(activeCategory))}
                    </div>
                    <select name="" id="" value={size} className='selector orange small pad-30' onChange={(e) => setSize(e.target.value)}>
                        {sizeList.map((s) => (
                            <option value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>
           

            <div className='linechart line-and-bar' >
                <ResponsiveContainer width="100%" height={280}>

                    <ComposedChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 0,
                            left: 0,
                            bottom: 20,
                        }}
                        barSize={10}
                    >

                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            fontSize={9}
                            textAnchor="end"
                            angle={-45}
                            interval={0}
                        />

                        <YAxis fontSize={9} textAnchor="middle" />


                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#2D3748",
                                fontSize: '12px',
                                padding: '5px',
                                transform: "translate(-100px, 0px)",
                                borderRadius: '5px',
                                border: '1px solid #ccc'
                            }}
                            labelStyle={{
                                color: '#ECB22E',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}
                            itemStyle={{
                                fontSize: '15px',
                                color: 'white'
                            }}
                        />
                        {
                            (activeCategory == "gloves" || activeCategory === "scarves") && (
                                <>
                                    <Bar dataKey="standardLength" fill="#2D3748" />
                                    <Bar dataKey="standardWidth" fill="#ECB22E" />
                                    <Line type="linear"
                                        dataKey="adjustedLength"
                                        stroke="red"
                                        strokeWidth={2}
                                    />
                                    <Line type="linear"
                                        dataKey="adjustedWidth"
                                        stroke="#707275"
                                        strokeWidth={2}
                                    />
                                </>
                            )
                        }
                        {
                            activeCategory === "hats" && (
                                <>
                                    <Bar dataKey="StandardCircumference" fill="#2D3748" />
                                    <Bar dataKey="StandardDiameter" fill="#ECB22E" />
                                    <Line
                                        type="linear"
                                        dataKey="adjustedCircumference"
                                        stroke="#707275"
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="linear"
                                        dataKey="adjustedDiameter"
                                        stroke="black"
                                        strokeWidth={2}
                                    />
                                    <Bar dataKey="standardLength" fill="#2D3748" />
                                    <Bar dataKey="StandardHeight" fill="black" />
                                    <Bar dataKey="standardWidth" fill="#ECB22E" />
                                    <Line
                                        type="linear"
                                        dataKey="adjustedLength"
                                        stroke="red"
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="linear"
                                        dataKey="adjustedHeight"
                                        stroke="#707275"
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="linear"
                                        dataKey="adjustedWidth"
                                        stroke="#B0E0E6"
                                        strokeWidth={2}
                                    />
                                </>
                            )
                        }

                        {/* <Legend
                            layout="vertical"
                            verticalAlign="top"
                            align='right'
                            height={100}
                            wrapperStyle={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                // overflowY: 'auto',
                                // maxHeight: '100px', 
                            }}
                        /> */}


                    </ComposedChart>

                </ResponsiveContainer>

            </div>

        </div >
    );
}
