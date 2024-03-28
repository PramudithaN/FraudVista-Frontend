import { Layout } from "antd";
import { Header, Content } from "antd/es/layout/layout";
import React, { useState } from "react";
import MyChart from "./Charts/MyChart";

const Dashboard = () => {
	const [data, setData] = useState({ month: "", number: 0 }); //state for API data --> month and number of transactions

  // API call for Total No. of Transactions
	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		const result = await axios("http://your-api-url");

	// 		setData(result.data);
	// 	};

	// 	fetchData();
	// }, []); // Empty dependency array means this effect runs once on mount
  
	return (
		<>
			<Layout style={{ backgroundColor: "#020617" }}>
				{/* Header */}
				<Header style={{ padding: 0, background: "#020617" }} />

				{/* Content  for Real-Time Transactions*/}
				<Content className="margin-container">
					<div className="flex-container">
						<div className="flex-item">
							<div className="card-container-0">Real-Time Transactions</div>
						</div>

						{/* Column Cards */}
						<div
							style={{
								display: "-ms-grid",
								justifyContent: "space-evenly",
							}}
						>
							<div className="half-width">
								<div className="card-content">
									Total No. of Transactions
									<div className="large-text">{data.month}February </div>
									<div
										style={{
											fontSize: "60px",
											color: "white",
											fontWeight: "normal",
										}}
									>
										100{data.number}
									</div>
								</div>
							</div>
							<div className="half-width">
								<div className="card-content">
									Total No. of Flagged Transactions
									<div className="large-text">{data.month}February </div>
									<div
										style={{
											fontSize: "60px",
											color: "white",
											fontWeight: "normal",
										}}
									>
										2{data.number}
									</div>
								</div>
							</div>
						</div>
					</div>
				</Content>

				{/* Content for Transactions by Type */}
				<Content className="margin-container">
					<div className="flex-container">
						<div className="flex-item">
							<div className="card-container">
								Transactions by Type{/* Js Charts*/}
								<div className="mt-9 size-2 h-4">
									<MyChart />
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
							<div className="card-container">Alert Analytics</div>
						</div>
					</div>
				</Content>
			</Layout>
		</>
	);
};

export default Dashboard;
