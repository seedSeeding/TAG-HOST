import React, { useEffect, useState } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import './chart.css';
import CustomSelector from '../Tools/CustomeSelector';

const COLORS = ['yellow', '#707275', '#2D3748'];

export default function PieChart(prop) {
  const { categoryData, title } = prop;
  //console.log("data pie::", categoryData)
  const [size, setSize] = useState("Small");
  const [brand, setBrand] = useState('');
  const [data, setData] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getBrandList = () => {
      const item = categoryData?.data;
      if (item) {
        const uniqueBrands = [...new Set(item.map((elem) => elem.brand))];
        setBrandList(uniqueBrands);
        if (uniqueBrands.length > 0) setBrand(uniqueBrands[0]);
      }
    };

    getBrandList();
  }, [categoryData]);

  useEffect(() => {
    const getData = () => {
      const item = categoryData?.data;
      if (item && brand) {
        const sizeID = size === "Small" ? 1 : size === "Medium" ? 2 : size === "Large" ? 3 : 4;
        let filteredByBrand = item.find((elem) => elem.brand === brand);
        if (filteredByBrand) {
          const filteredBySize = filteredByBrand.records.find((elem) => elem.size_id === sizeID);
          //console.log("filteredBySize :", filteredBySize);
          setData([
            { name: 'Approved', value: filteredBySize?.approved || 0 },
            { name: 'Revision', value: filteredBySize?.revision || 0 },
            { name: 'Dropped', value: filteredBySize?.dropped || 0 },
          ]);
          setTotal(filteredBySize?.approved + filteredBySize?.revision + filteredBySize?.dropped);
        }
      }
    };

    getData();
    //console.log("selected size : ", size , "data", data);
  }, [brand, size, categoryData]);

  return (
    <div className='pie-data-box'>
      <div className='pie-header'>
        <span>{title} Approval</span>
        <div className="pie-size">
          <CustomSelector setValue={setSize} value={size} values={["Small", 'Medium', "Large", 'X-Large']} />
        </div>
      </div>

      <div className='piechart'>
        <RechartsPieChart width={180} height={180} className='chart'>

          <Pie data={data} innerRadius={45} outerRadius={90} fill="#8884d8" dataKey="value">

            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />

            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#2D3748", 
              fontSize: '12px',
              padding: '5px',
              transform: "translate(-100px, 0px)", 
              borderRadius: '5px', 
              border: '1px solid #ccc' 
            }}
            itemStyle={{
              fontSize: '15px',
              color: 'white'
            }}
          />

        </RechartsPieChart>

        <div className="circle">
          <span className='text-xl'>{total}</span>
          <span>Total Records</span>
        </div>
      </div>

      <div className='pie-footer'>
        <div className="pie-company">
          <CustomSelector setValue={setBrand} value={brand} values={brandList} />
        </div>

        <div className='customize-pie-legend'>
          {data.map((entry, index) => (
            <div key={index} className='pie-legend-row'>
              <div className='pie-legend-box' style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              <span>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
