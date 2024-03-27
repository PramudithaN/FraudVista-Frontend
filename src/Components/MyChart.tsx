import React from 'react';
import { Card } from 'antd';
import { VictoryPie } from 'victory';

const data = [
  { x: "Apples", y: 10 },
  { x: "Bananas", y: 15 },
  { x: "Grapes", y: 20 }
];

const MyChart = () => {
  return (
    <Card title="Fruit Distribution">
      <VictoryPie
        data={data}
        colorScale="qualitative"
        innerRadius={100}
        labelRadius={120}
        style={{
          // Customize the style of the VictoryPie component here
          parent: { maxWidth: "400px", margin: "auto" }, // Adjust width and margin
          labels: { fontSize: 10, fill: "white" }, // Adjust label style
          data: { fillOpacity: 0.9, stroke: "#fff", strokeWidth: 2 }, // Adjust data style
      
        }}
      />
    </Card>
  );
};

export default MyChart;
