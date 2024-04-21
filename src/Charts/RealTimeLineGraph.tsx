import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import dayjs from "dayjs";
import axios from "axios";

interface Transaction {
	id: number;
	createdDate: string;
	amount: number;
	transactionType: string;
	isFraud: string;
}

const RealTimeLineGraph: React.FC = () => {
	const [chartData, setChartData] = useState<any>(null);
	const [chartInstance, setChartInstance] = useState<Chart | null>(null);
	const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
	const [selectedYear, setSelectedYear] = useState<string | null>(null);

	//Api to get all transactions
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get<Transaction[]>(
					"http://localhost:8080/allTransaction"
				);

				// Process the data to calculate total transactions and fraudulent transactions for each day
				const dataByDate: { [date: string]: { total: number; fraud: number } } =
					{};

				response.data.forEach((transaction) => {
					const date = dayjs(transaction.createdDate).format("YYYY-MM-DD");
					if (!dataByDate[date]) {
						dataByDate[date] = { total: 0, fraud: 0 };
					}
					dataByDate[date].total++;
					if (transaction.isFraud === "Y") {
						dataByDate[date].fraud++;
					}
				});

				// Prepare datasets for Chart.js
				const processedData = {
					labels: Object.keys(dataByDate),
					datasets: [
						{
							label: "Total Transactions",
							borderColor: "blue",
							data: Object.values(dataByDate).map((data) => data.total),
						},
						{
							label: "Fraud Transactions",
							borderColor: "red",
							data: Object.values(dataByDate).map((data) => data.fraud),
						},
					],
				};

				// Update the chart data state
				setChartData(processedData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		// Render or update the chart when chartData or selectedMonth or selectedYear changes
		if (chartData) {
			if (chartInstance) {
				// Destroy the existing chart if it exists
				chartInstance.destroy();
			}

			// Filter the chart data based on the selected month and year, if any
			let filteredData = chartData;
			if (selectedMonth && selectedYear) {
				filteredData = {
					labels: chartData.labels.filter(
						(date: string) =>
							dayjs(date).format("MM-YYYY") ===
							`${selectedMonth}-${selectedYear}`
					),
					datasets: chartData.datasets.map((dataset: any) => ({
						...dataset,
						data: dataset.data.filter(
							(_: any, index: number) =>
								dayjs(chartData.labels[index]).format("MM-YYYY") ===
								`${selectedMonth}-${selectedYear}`
						),
					})),
				};
			}

			const ctx = document.getElementById("myChart") as HTMLCanvasElement;
			const newChartInstance = new Chart(ctx, {
				type: "line",
				data: filteredData,
				options: {
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						x: {
							display: true,
							title: {
								display: true,
								text: "Date",
							},
						},
						y: {
							display: true,
							title: {
								display: true,
								text: "Count",
							},
						},
					},
					backgroundColor: "white", // Set background color to white
				},
			});

			// Store the new chart instance
			setChartInstance(newChartInstance);
		}
	}, [chartData, selectedMonth, selectedYear]);

	// Function to handle month selection change
	const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedMonth(event.target.value || null); // Set null if no option is selected
	};

	// Function to handle year selection change
	const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedYear(event.target.value || null); // Set null if no option is selected
	};

	return (
		<div>
			<div
				style={{
					display: "flex",
					justifyContent: "flex-end",
					alignItems: "flex-start",
					marginBottom: "5px",
				}}
			>
				<select
					onChange={handleYearChange}
					value={selectedYear || ""}
					style={{
						alignSelf: "flex-start",
						padding: "5px",
						backgroundColor: "#f2f2f2",
						borderRadius: "5px",
						marginRight: "10px",
					}}
				>
					<option value="">Select Year</option>
					{Array.from({ length: 5 }, (_, index) => {
						const year = dayjs().year() - index; // Get current year and previous four years
						return (
							<option key={year} value={year.toString()}>
								{year}
							</option>
						);
					})}
				</select>
				<select
					onChange={handleMonthChange}
					value={selectedMonth || ""}
					style={{
						alignSelf: "flex-start",
						padding: "5px",
						backgroundColor: "#f2f2f2",
						borderRadius: "5px",
					}}
				>
					<option value="">Select Month</option>
					{Array.from({ length: 12 }, (_, index) => {
						const monthValue = (index + 1).toString().padStart(2, "0"); // Convert index to two-digit month value
						const monthName = dayjs().month(index).format("MMMM"); // Get month name from index
						return (
							<option key={monthValue} value={monthValue}>
								{monthName}
							</option>
						);
					})}
				</select>
			</div>
			<canvas
				id="myChart"
				style={{
					backgroundColor: "white",
					width: "100%",
					maxWidth: "1300px",
					height: "100%",
					maxHeight: "480px",
					color: "white",
					borderRadius: "10px",
					marginBottom: "10px",
				}}
			/>
		</div>
	);
};

export default RealTimeLineGraph;
