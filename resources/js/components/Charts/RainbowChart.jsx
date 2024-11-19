import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import React, { useEffect, useState } from 'react';
import CustomSelector from '../Tools/CustomeSelector';
import { DataApi } from '../Api/dataService';
import { generateYearList, materialList } from '../dataTools';

const colors = {
  Cashmere: "#FF7F32",
  Chiffon: "#FFB733",
  Cordura: "#1E4D92",
  Cotton: "#2A7DBE",
  Denim: "#0C5D98",
  "Faux Fur": "#004F74",
  Fleece: "#306EB3",
  "Gore-Tex": "#FFB04D",
  Kevlar: "#C77D00",
  Latex: "#3F6363",
  Leather: "#1B6285",
  Lycra: "#3D5A75",
  Microfiber: "#1D4D76",
  Neoprene: "#FFB549",
  Nitrile: "#1A3F72",
  Nylon: "#9B5A2C",
  Polyester: "#FFB549",
  Polyurethane: "#FFB300",
  Rayon: "#FFDD33",
  Rubber: "#B56D3B",
  Silicone: "#1B3F5C",
  Silk: "#2B4D77",
  Spandex: "#A131F4",
  "Synthetic Leather": "#35648D",
  Taffeta: "#FF9A35",
  Tweed: "#5B10A3",
  Velvet: "#1F4F87",
  Vinyl: "#6B7878",
  Canvas: "#A4712D",
  Wool: "#2A4A87",
  Pink: "#B56D3B",
  DarkYellow: "#FF8C00",
  Violet: "#7A00B2"
};



export default function RainbowChart() {
  const [brand, setBrand] = useState("ALL");
  const [brandList, setBrandList] = useState([]);
  const [date, setDate] = useState(generateYearList()[0]);
  const [selectedMaterial, setMaterial] = useState("ALL");
  const [materials, setMaterials] = useState([]);
  const [data, setData] = useState([]);

  const dataAPI = new DataApi();

  useEffect(() => {
    const getBrandList = async () => {
      try {
        const res = await dataAPI.getBrandList();
        setBrandList(res);
      } catch (error) {
        alert("Error fetching brand list: " + error);
      }
    };

    getBrandList();
    setMaterials([...materialList]);
  }, []);

  useEffect(() => {
    const getDATA = async (brand, date) => {
      try {
        const res = await dataAPI.getMaterialPopularityALL(brand, date);
        return res;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchData = async () => {
      try {
        if (brand === "ALL") {
          const recordsData = await Promise.all(
            brandList.map(async (brandName) => {
              const record = await getDATA(brandName, date);
              return record ? { ...record, name: brandName } : null;
            })
          );
          setData(recordsData.filter(record => record !== null));
        } else {
          const singleBrandData = await getDATA(brand, date);
          if (singleBrandData) {
            setData([{ ...singleBrandData, name: brand }]);
          }
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    };

    if (brandList.length > 0) {
      fetchData();
    }
  }, [brandList, date, brand]);

  const formatXAxis = (tickItem) => {
    if (tickItem >= 1000) {
      return `${(tickItem / 100)}k`;
    } else if (tickItem > 100) {
      return `${(tickItem / 100).toFixed((String(tickItem).length) - 1)}`;
    }
    return tickItem;
  };

  return (
    <div className="line-chart-data-box">
      <div className="chart-header line-bar-header">
        <span>Material Distribution</span>
        <div className="chart-selectors">
          <CustomSelector setValue={setBrand} value={brand} values={["ALL", ...brandList]} />
          <CustomSelector setValue={setMaterial} value={selectedMaterial} values={["ALL", ...materials]} />
          <CustomSelector setValue={setDate} value={date} values={generateYearList()} theme={1} />

        </div>
      </div>

      <div className="linechart">
        <ResponsiveContainer height={290} className="mixchart">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
            style={{ borderRadius: 10, width: "auto" }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              fontSize={9}
              textAnchor="end"
              angle={-45}
              interval={0}
            />
            <YAxis tickFormatter={formatXAxis} tick={{ fontSize: 12 }} />
            {/* { <Tooltip itemStyle={{ fontSize: "13px" }} contentStyle={{transform:"translate(-300px,-600px)"} }/> */}
            {/* <Tooltip
              contentStyle={{
                backgroundColor: "#2D3748",
                fontSize: '12px',
                padding: '5px',
               transform:"translate(-300px,-600px)",
                borderRadius: '5px',
                border: '1px solid #ccc'
              }}
              itemStyle={{
                fontSize: '13px',
                color: 'white'
              }}
            /> */}
            {data.length > 0 && data[0] && Object.keys(data[0]).filter(key => key !== "name").map((material, index) => {
              if (selectedMaterial === "ALL") {
                return (
                  <Bar key={material} dataKey={material} stackId="a" fill={colors[material]} />
                );
              } else if (selectedMaterial === material) {
                return (
                  <Bar key={material} dataKey={material} stackId="a" fill={colors[material]} />
                );
              }
              return null;
            })}

          </BarChart>
        </ResponsiveContainer>
      </div>


      <div className='customize-legend mixchart-legend'>
        <div className='legend-title'>Fabric Types</div>
        {
          Object.keys(colors).map((key) => (
            <div className='legend-row' key={key}>
              <div className='legend-box linechart-legend-box' style={{ backgroundColor: colors[key] }}></div>
              <span>{key}</span>
            </div>
          ))
        }
      </div>

    </div>
  );
}
