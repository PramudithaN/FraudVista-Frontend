import React from 'react';
import { Card } from 'antd';
import { VictoryPie } from 'victory';

const data = [
  { x: "X", y: 10 },
  { x: "Y", y: 15 },
  { x: "Z", y: 20 }
];

const MyChart = () => {
  return (
    <Card title="Transaction by Type" style={{color:'white'}}>
      <VictoryPie
        data={data}
        colorScale="qualitative"
        innerRadius={100}
        labelRadius={120}
        style={{
          // Customize the style of the VictoryPie component here
          parent: { maxWidth: "120px", margin: "2px",height:'180px',padding:'0px' }, // Adjust width and margin
          labels: { fontSize: 10, fill: "white" }, // Adjust label style
          data: { fillOpacity: 0.9, stroke: "#fff", strokeWidth: 2 }, // Adjust data style
      
        }}
      />
    </Card>
  );
};

export default MyChart;
