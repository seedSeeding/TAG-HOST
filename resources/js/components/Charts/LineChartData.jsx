import React, { useEffect, useState } from 'react';
import CustomSelector from '../Tools/CustomeSelector';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataApi } from '../Api/dataService';
import { generateYearList, getBrandList, getTimeToApprovalByYearBrand } from '../dataTools';

export default function LineChartData() {
  const [brand, setBrand] = useState("");
  const [brandList, setBrandList] = useState([]);
  const [year, setYear] = useState();
  const [yearlist, setYearList] = useState([]);

  const [data, setData] = useState([]);
  const [records, setRecords] = useState([]);
  const dataApi = new DataApi();

  useEffect(() => {
    const getTimeToApproval = async () => {
      try {
        const response = await dataApi.getTimeToApproval();
        //console.log(response);
        setRecords(response);
        setBrandList(getBrandList(response));
        setBrand(getBrandList(response)[0]);
        setYearList(generateYearList(response));
        setYear(generateYearList(response)[0]);

      } catch (error) {
        console.log(error);
      }

    }
    getTimeToApproval();
  }, []);
  useEffect(() => {
    try {
      const filteredData = getTimeToApprovalByYearBrand(records, brand, year);
      setData(filteredData);
      //console.log("data:: ",filteredData);
    } catch (error) {
      console.log(error);
    }
  }, [records, brand, year]);


  return (
    <div className='line-chart-data-box'>
      <div className='chart-header'>
        <span>Time to Approval</span>
        <div className="chart-selectors">

          <CustomSelector setValue={setBrand} value={brand} values={brandList} />
          <CustomSelector setValue={setYear} value={year} values={generateYearList()} theme={1} />
        </div>
      </div>
      <div className='linechart linechart-box' >

        <ResponsiveContainer height={300} >
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              padding={{ left: 30, right: 30 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 10 }} />

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


            {/**
            *  <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="square"
              iconSize={10}
            />

            */}
            <Line
              type="linear"
              dataKey="hats"
              stroke="#ECB22E"
              strokeWidth={2}
            />
            <Line
              type="linear"
              dataKey="gloves"
              stroke="#2D3748"
              strokeWidth={2}
            />
            <Line
              type="linear"
              dataKey="scarves"
              stroke="#707275"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className='customize-legend'>
          <div className='legend-title'>
            Category
          </div>
          <div className='legend-row'>
            <div className='legend-box linechart-legend-box' style={{ backgroundColor: "#2D3748" }}></div>
            <span>Gloves</span>
          </div>
          <div className='legend-row'>
            <div className='legend-box linechart-legend-box' style={{ backgroundColor: "#ECB22E" }}></div>
            <span>Hats</span>
          </div>
          <div className='legend-row'>
            <div className='legend-box linechart-legend-box' style={{ backgroundColor: "#707275" }}></div>
            <span>Scarves</span>
          </div>
        </div>
      </div>

    </div>
  );
}
