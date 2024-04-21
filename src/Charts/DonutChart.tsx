import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface Transaction {
	id: number;
	status: string;
	amount: number;
	transactionType: string;
	createdDate: string;
	utilityAccount: string | null;
	beneficiaryAccount: string | null;
	isFraud: string;
	customer: {
		id: number;
		fullName: string;
		mobile: string;
		nic: string | null;
		address: string;
		avgTransactionCount: number;
		peakHour: number;
	};
}

interface Props {
	transactions: Transaction[];
}

const DonutChart: React.FC<Props> = ({ transactions }) => {
	const chartRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (chartRef.current) {
			const transactionCounts: { [key: string]: number } = {};

			transactions.forEach((transaction) => {
				if (transaction.transactionType in transactionCounts) {
					transactionCounts[transaction.transactionType]++;
				} else {
					transactionCounts[transaction.transactionType] = 1;
				}
			});

			const chartLabels = Object.keys(transactionCounts);
			const chartData = Object.values(transactionCounts);

			const donutChart = new Chart(chartRef.current, {
				type: "doughnut",
				data: {
					labels: chartLabels,
					datasets: [
						{
							backgroundColor: [
								"#ffe162",
								"#4cd180",
							],
							data: chartData,
                            borderWidth: 0, // Remove the stroke
						},
					],
				},
				options: {
					plugins: {
						legend: {
							labels: {
								font: {
									size: 20, // Adjust the font size of the labels
								},
								padding: 30, // Add space between the labels
							
							},
						},
					},
				},
			});


			return () => {
				donutChart.destroy();
			};
		}
	}, [transactions]);

	return <canvas ref={chartRef}
	// style={{position:"relative" ,height:"80px",width: "100px",scale:'0.7',marginTop:'-340px',marginRight:'400px'}} 
	// style={{ backgroundColor:'white',borderRadius:'10px',marginTop:'10px',width:'500px' }} 
	// style={{ marginTop: "20px" }}
	/>;
};

export default DonutChart;
