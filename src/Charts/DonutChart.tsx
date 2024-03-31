import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

const DonutChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from API
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        if (data.length === 0) {
          throw new Error('No data available');
        }

        // Process data to fit into chart format (label and value properties)
        const chartData = {
          labels: data.map((item: any) => item.label),
          datasets: [
            {
              data: data.map((item: any) => item.value),
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
              ],
            },
          ],
        };

        setChartData(chartData);
        setLoading(false);
      } catch (error:any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Donut Chart</h2>
      <Doughnut data={chartData} />
    </div>
  );
};

export default DonutChart;
