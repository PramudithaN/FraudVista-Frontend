import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const LineGraph: React.FC = () => {
	const chartRef = useRef<HTMLCanvasElement>(null);
	const chartInstanceRef = useRef<Chart>();

	useEffect(() => {
		if (chartRef.current) {
			if (chartInstanceRef.current) {
				chartInstanceRef.current.destroy(); // Destroy previous chart instance
			}

			chartInstanceRef.current = new Chart(chartRef.current, {
				type: "line",
				data: {
					labels: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
					datasets: [
						{
							data: [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478],
							borderColor: "red",
							fill: false,
						},
						{
							data: [
								1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000,
							],
							borderColor: "green",
							fill: false,
						},
						{
							data: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100],
							borderColor: "blue",
							fill: false,
						},
					],
				},
				options: {
					plugins: {
						legend: {
							display: false,
						},
					},
					backgroundColor: "white",
				},
			});
		}

		// Clean up the chart instance when the component unmounts
		return () => {
			if (chartInstanceRef.current) {
				chartInstanceRef.current.destroy();
			}
		};
	}, []);

	return (
		<canvas
			ref={chartRef}
			style={{
				width: "100%",
				maxWidth: "1200px",
				backgroundColor: "white",
				borderRadius: "10px",
				marginTop: "10px",
			}}
		/>
	);
};

export default LineGraph;
