import { DatePicker, FloatButton, Form, Layout, Progress, Spin } from "antd";
import { Header, Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import MyChart from "./Charts/MyChart";
import axios from "axios";
import DonutChart from "./Charts/DonutChart";

const Dashboard = () => {
	const [data, setData] = useState({ allMonth: "", number: 0 }); //state for API data --> month and number of All transactions
	const [fraud, setFraud] = useState({ fraudMonth: "", number: 0 }); //state for API data --> month and number of FRAUD transactions
	const [loading, setLoading] = useState(true);
	const { RangePicker } = DatePicker;
	//API call for Total No. of Transactions
	useEffect(() => {
		const allTransactions = async () => {
			const result = await axios("http://localhost:8080/allTransaction");

			// Get the month from the createdDate of the first object
			const date = new Date(result.data[0].createdDate);
			const allMonth = date.toLocaleString("default", { month: "long" });

			// Get the number of objects
			const number = result.data.length;

			setData({ allMonth, number });
			setLoading(false);
		};

		allTransactions();
	}, []); // Empty dependency array means this effect runs once on mount

	// //API call for Fraud Transactions
	// useEffect(() => {
	// 	const fraudTransactions = async () => {
	// 		const result = await axios("http://localhost:8080/fraud/transaction");

	// 		// Get the month from the createdDate of the first object
	// 		const date = new Date(result.data[0]?.createdDate);
	// 		const fraudMonth = date.toLocaleString("default", { month: "long" });

	// 		// Get the number of objects
	// 		const number = result.data.length;

	// 		setFraud({ fraudMonth, number });
	// 		setLoading(false);
	// 	};

	// 	fraudTransactions();
	// }, []); // Empty dependency array means this effect runs once on mount

	return (
		<>
			<Layout style={{ backgroundColor: "#020617" }}>
				{/* Header */}
				<Header style={{ padding: 0, background: "#020617" }} />
				<h1 className="Heading">Dashboard</h1>
				{/* Content  for Real-Time Transactions*/}
				<Content className="margin-container">
					<div className="flex-container">
						<div className="flex-item">
							<div className="card-container-0">Real-Time Transactions</div>
						</div>

						{/* Column Cards */}
						{loading ? (
							<Spin /> // Add a loading spinner until the data is fetched from the API
						) : (
							<div
								style={{
									display: "-ms-grid",
									justifyContent: "space-evenly",
								}}
							>
								<div className="half-width">
									<div
										className="card-content"
										style={{ height: "280px", paddingTop: "80px" }}
									>
										Total No. of Transactions
										<div className="large-text">{data.allMonth} </div>
										<div
											style={{
												fontSize: "60px",
												color: "white",
												fontWeight: "normal",
											}}
										>
											{data.number}
										</div>
									</div>
								</div>
								<div
									className="half-width"
									style={{ marginTop: "210px", height: "80px" }}
								>
									<div
										className="card-content"
										style={{ height: "280px", paddingTop: "80px" }}
									>
										Total No. of Flagged Transactions
										<div className="large-text">{fraud.fraudMonth} </div>
										<div
											style={{
												fontSize: "60px",
												color: "white",
												fontWeight: "normal",
											}}
										>
											{fraud.number}
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</Content>

				{/* Content for Transactions by Type */}
				<Content className="margin-container">
					<div className="flex-container">
						<div className="flex-item">
							<div className="card-container">
								Transactions by Type{/* Js Charts*/}
								<div className="mt-9 size-2 h-4">
									<DonutChart />
								</div>
							</div>
						</div>
						<div className="half-width">
							<div className="card-container">Unusual Alerts Identified</div>
						</div>
					</div>
				</Content>

				{/* Content for Fraud Analytics */}
				<Content className="margin-container">
					<div className="flex-container">
						<div className="flex-item">
							<div className="card-container">Fraud Analytics</div>
						</div>
						<div className="half-width">
							<div className="card-container">
								Alert Analytics
								<div
									className="mt-16 size-2 h-4"
									style={{ marginTop: "30px", marginLeft: "20px" }}
								>
									<>
										{" "}
										<Form variant="filled" style={{ maxWidth: 600 }}>
											<Form.Item
											
												name="RangePicker"
												style={{
													width: "400px",
													color: "white",
													marginLeft: "80px",
													marginBottom: "40px",
												}}
											>
												<RangePicker style={{ color: 'white', backgroundColor: 'white' }}/>
											</Form.Item>
										</Form>
									</>
									<label style={{ marginTop: "150px" }}>
										Suspicious Alerts
									</label>
									<div>
										<Progress
											trailColor="#2e3037"
											strokeColor="#ffe162"
											percent={50}
											size={[400, 30]}
											style={{
												marginTop: "10px",
												borderRadius: "15px",
												width: "400px",
												color: "white",
												marginBottom: "30px",
											}}
											format={(percent) => (
												<span style={{ color: "white" }}>{percent}%</span>
											)}
										/>
									</div>
									<label style={{ marginBottom: "2px", marginTop: "150px" }}>
										Fraud Alerts
									</label>
									<div>
										<Progress
											trailColor="#2e3037"
											strokeColor="#ff6358"
											percent={30}
											size={[400, 30]}
											style={{
												marginTop: "10px",
												borderRadius: "15px",
												width: "400px",
												color: "white",
											}}
											format={(percent) => (
												<span style={{ color: "white" }}>{percent}%</span>
											)}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Content>
				<FloatButton.BackTop />
			</Layout>
		</>
	);
};

export default Dashboard;
