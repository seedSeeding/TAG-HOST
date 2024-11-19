import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import React, { useEffect, useState } from 'react';
import CustomSelector from '../Tools/CustomeSelector';
import { DataApi } from '../Api/dataService';
import { getFitIssueByCategorySize } from '../dataTools';

export default function MixBar() {
  const [size, setSize] = useState('Small');
  const [category, setCategory] = useState('Gloves');
  const [data, setData] = useState([]);
  const [records, setRecords] = useState([]);
  const dataApi = new DataApi();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await dataApi.getFitIssues();
        setRecords(res);
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    setData(getFitIssueByCategorySize(records, category, size));
  }, [records, size, category]);

  const formatXAxis = (tickItem) => {
    if (tickItem >= 1000) {
      return `${(tickItem / 100)}k`;
    } else if (tickItem > 100) {
      return `${(tickItem / 100).toFixed((String(tickItem).length) - 1)}`;
    }
    return tickItem;
  };

  return (
    <div className='line-chart-data-box'>
      <div className='chart-header'>
        <span>Fit Issues by Pattern</span>
        <div className="chart-selectors">
          <CustomSelector setValue={setCategory} value={category} values={["Gloves", "Hats", "Scarves"]} />
          <CustomSelector setValue={setSize} value={size} values={["Small", "Medium", "Large", "X-Large"]} theme={1} />
        </div>
      </div>
      <div className='linechart mixbarchart-container' style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <ResponsiveContainer height={300} className={"mixchart"}>
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 30,
            }}
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
            <YAxis tickFormatter={formatXAxis} tick={{ fontSize: 12, whiteSpace: "nowrap", overflow: "hidden" }} />
            {/* <Tooltip itemStyle={{ fontSize: '13px', color: 'red' }} /> */}

            <Bar dataKey="Too Small" stackId="a" fill="#1E3A8A" />
            <Bar dataKey="Height Discrepancy" stackId="a" fill="#2563EB" />
            <Bar dataKey="Improper Curve" stackId="a" fill="#3B82F6" />
            <Bar dataKey="Length Mismatch" stackId="a" fill="#60A5FA" />
            <Bar dataKey="Asymmetrical Fit" stackId="a" fill="#D97706" />
            <Bar dataKey="Too Large" stackId="a" fill="#F59E0B" />
            <Bar dataKey="Too Loose" stackId="a" fill="#FBBF24" />
            <Bar dataKey="Too Short" stackId="a" fill="#FCD34D" />
            <Bar dataKey="Too Tight" stackId="a" fill="#FEF3C7" />
            <Bar dataKey="Too Wide" stackId="a" fill="#B45309" />
            <Bar dataKey="Too Narrow" stackId="a" fill="#92400E" />
            <Bar dataKey="Uneven Sizing" stackId="a" fill="yellow" />
            <Bar dataKey="Width Mismatch" stackId="a" fill="#4B5563" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className='customize-legend mixchart-legend'>
        <div className='legend-title'>Issues</div>
        <div className='legend-row'>
          <div className='legend-box linechart-legend-box' style={{ backgroundColor: "#1E3A8A" }}></div>
          <span>Too Small</span>
        </div>
        <div className='legend-row'>
          <div className='legend-box linechart-legend-box' style={{ backgroundColor: "#2563EB" }}></div>
          <span>Height Discrepancy</span>
        </div>
        <div className='legend-row'>
          <div className='legend-box linechart-legend-box' style={{ backgroundColor: "#3B82F6" }}></div>
          <span>Improper Curve</span>
        </div>
        <div className='legend-row'>
          <div className='legend-box linechart-legend-box' style={{ backgroundColor: "#60A5FA" }}></div>
          <span>Length Mismatch</span>
        </div>
        <div className='legend-row'>
          <div className='legend-box linechart-legend-box' style={{ backgroundColor: "#D97706" }}></div>
          <span>Asymmetrical Fit</span>
        </div>
        <div className='legend-row'>
          <div className='legend-box linechart-legend-box' style={{ backgroundColor: "#F59E0B" }}></div>
          <span>Too Large</span>
        </div>
        <div className='legend-row'>
          <div className='legend-box linechart-legend-box' style={{ backgroundColor: "#FBBF24" }}></div>
          <span>Too Loose</span>
        </div>
        <div className='legend-row'>
          <div className='legend-box linechart-legend-box' style={{ backgroundColor: "#FCD34D" }}></div>
          <span>Too Short</span>
        </div>
        <div className='legend-row'>
          <div className='legend-box linechart-legend-box' style={{ backgroundColor: "#FEF3C7" }}></div>
          <span>Too Tight</span>
        </div>
        <div className='legend-row'>
          <div className='legend-box linechart-legend-box' style={{ backgroundColor: "#B45309" }}></div>
          <span>Too Wide</span>
        </div>
        <div className='legend-row'>
          <div className='legend-box linechart-legend-box' style={{ backgroundColor: "#92400E" }}></div>
          <span>Too Narrow</span>
        </div>
        <div className='legend-row'>
          <div className='legend-box linechart-legend-box' style={{ backgroundColor: "yellow" }}></div>
          <span>Uneven Sizing</span>
        </div>
        <div className='legend-row'>
          <div className='legend-box linechart-legend-box' style={{ backgroundColor: "#4B5563" }}></div>
          <span>Width Mismatch</span>
        </div>
      </div>
    </div>
  );
}
