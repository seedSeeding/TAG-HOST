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
    };
    getData();
  }, []);

  useEffect(() => {
    setData(getFitIssueByCategorySize(records, category, size));
  }, [records, size, category]);

  const issueColors = {
    "Too Small": "#1E3A8A",
    "Height Discrepancy": "#2563EB",
    "Improper Curve": "#3B82F6",
    "Length Mismatch": "#60A5FA",
    "Asymmetrical Fit": "#D97706",
    "Too Large": "#F59E0B",
    "Too Loose": "#FBBF24",
    "Too Short": "#FCD34D",
    "Too Tight": "#FEF3C7",
    "Too Wide": "#B45309",
    "Too Narrow": "#92400E",
    "Uneven Sizing": "yellow",
    "Width Mismatch": "#4B5563",
  };

  const displayedIssues = Object.keys(issueColors).filter(issue =>
    data.some(entry => entry[issue] > 0)
  );

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
            margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
            style={{ borderRadius: 10, width: "auto" }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={9} textAnchor="end" angle={-45} interval={0} label={{ value: "Brands", position: "bottom", offset: 10, fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} label={{ value: "Number of Issues", angle: -90, position: 'insideLeft', fontSize: 12 }} />
            {displayedIssues.map(issue => (
              <Bar key={issue} dataKey={issue} stackId="a" fill={issueColors[issue]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className='customize-legend mixchart-legend'>
        <div className='legend-title'>Issues</div>
        {displayedIssues.map(issue => (
          <div className='legend-row' key={issue}>
            <div className='legend-box linechart-legend-box' style={{ backgroundColor: issueColors[issue] }}></div>
            <span>{issue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
