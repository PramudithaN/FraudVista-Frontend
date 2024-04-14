import {
	Alert,
	DatePicker,
	FloatButton,
	Form,
	Layout,
	Progress,
	Spin,
} from "antd";
import { Header, Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import CJSPie from "./Charts/ChartjsPir";
import LineChart from "./Charts/LineChart";

interface Transaction {
	createdDate: string;
	isFraud: string;
	type: string; // Adding type property to Transaction interface
	amount: number; // Adding amount property to Transaction interface
	id: string; // Adding id property to Transaction interface
}

const Dashboard = () => {
	const [data, setData] = useState({ allMonth: "", number: 0 }); //state for API data --> month and number of All transactions
	const [loading, setLoading] = useState(true);
	const { RangePicker } = DatePicker;
	const [fraudCount, setFraudCount] = useState<number>(0);
	const [transactionTypes, setTransactionTypes] = useState<{
		[key: string]: number;
	}>({});
	const [utilityPaymentAmount, setUtilityPaymentAmount] = useState<number>(0); // State to store the total amount of Utility Payment transactions
	const [fraudTransactionId, setFraudTransactionId] = useState<string | null>(
		null
	); // State to store the ID of the fraud transaction

	// Define your default dates
	const defaultStartDate = dayjs("2024-01-01");
	const defaultEndDate = dayjs("2024-03-28");

	// Get current month
	const currentMonth = dayjs().format("MMMM");
	const [transactionsData, setTransactionsData] = useState<any[]>([]); // Define state to store transactions data

	//API call for Total No. of Transactions
	useEffect(() => {
		const allTransactions = async () => {
			const result = await axios("http://localhost:8080/allTransaction");
			setTransactionsData(result.data);

			// Filter transactions for the current month
			const currentMonthTransactions: Transaction[] = result.data.filter(
				(transaction: Transaction) => {
					const transactionDate = new Date(transaction.createdDate);
					return transactionDate.getMonth() === new Date().getMonth();
				}
			);

			// Get the number of objects
			const number = currentMonthTransactions.length;
			const flaggedTransactions = currentMonthTransactions.filter(
				(transaction) => transaction.isFraud === "Y"
			);
			setFraudCount(flaggedTransactions.length);

			setData({ allMonth: currentMonth, number }); // Use current month
			setLoading(false);

			// Calculate transaction types counts
			const typesCount: { [key: string]: number } = {};
			let utilityPaymentTotalAmount = 0; // Variable to store the total amount of Utility Payment transactions
			currentMonthTransactions.forEach((transaction) => {
				if (typesCount[transaction.type]) {
					typesCount[transaction.type]++;
				} else {
					typesCount[transaction.type] = 1;
				}
				// If the transaction is of type "Utility Payment", add its amount to the total
				if (transaction.type === "Utility Payment") {
					utilityPaymentTotalAmount += transaction.amount;
				}
				// If the transaction is flagged as fraud, set the fraud transaction ID
				if (transaction.isFraud === "Y") {
					setFraudTransactionId(transaction.id);
				}
			});
			setTransactionTypes(typesCount);
			setUtilityPaymentAmount(utilityPaymentTotalAmount); // Set the total amount of Utility Payment transactions
		};

		allTransactions();
	}, []); // Empty dependency array means this effect runs once on mount

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
										<div className="large-text">{data.allMonth} </div>
										<div
											style={{
												fontSize: "60px",
												color: "white",
												fontWeight: "normal",
											}}
										>
											{fraudCount}
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</Content>

				<Content className="margin-container">
					<div className="flex-container">
						{/* Content for Transactions by Type */}
						<div className="flex-item">
							<div className="card-container-TBT">
								Transactions by Type
								<div
									className="TopofPie"
									style={{ marginLeft: "650px", marginTop: "100px" }}
								>
									{Object.keys(transactionTypes).map((type) => (
										<div key={type}>
											<label style={{ marginTop: "150px" }}>{type}</label>
											<div>
												<Progress
													trailColor="#2e3037"
													strokeColor="#ff6358"
													percent={(transactionTypes[type] / data.number) * 100} // Calculate progress based on type count and total number of transactions
													size={[400, 30]}
													style={{
														marginTop: "10px",
														borderRadius: "5px",
														width: "400px",
														color: "white",
													}}
													format={(percent) => (
														<span style={{ color: "white" }}>{percent}%</span>
													)}
												/>
											</div>
										</div>
									))}
									{/* Display Utility Payment progress bar */}
									<div>
										<label style={{ marginTop: "150px" }}>
											Utility Payment
										</label>
										<div>
											<Progress
												trailColor="#2e3037"
												strokeColor="#ff6358"
												percent={(utilityPaymentAmount / data.number) * 100} // Calculate progress based on Utility Payment amount and total number of transactions
												size={[400, 30]}
												style={{
													marginTop: "10px",
													borderRadius: "5px",
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
								<div className="mt-9 size-2 h-4">
									<CJSPie transactions={transactionsData} />
								</div>
							</div>
						</div>
						{/* Content for Unusual Alerts Identified */}
						<div className="half-width">
							<div className="card-container-UAI">
								Unusual Alerts Identified
								<div style={{ marginTop: "40px" }}>
									{transactionsData
										.slice(-6) // Get the last 6 transactions
										.filter((transaction) => transaction.isFraud === "Y") // Filter out transactions where isFraud is not 'Y'
										.map((transaction) => (
											<Alert
												key={transaction.id}
												message={`Transaction ID ${transaction.id} is identified as a fraud`}
												type="warning"
												style={{
													padding: "10px",
													marginTop: "15px",
													fontSize: "15px",
													fontWeight: "500",
												}}
											/>
										))}
								</div>
							</div>
						</div>
					</div>
				</Content>

				<Content className="margin-container">
					<div className="flex-container">
						{/* Content for Fraud Analytics */}
						<div className="flex-item">
							<div className="card-container">
								Fraud Analytics
								<div className="mt-16 size-2 h-4">
									<LineChart />
								</div>
							</div>
						</div>

						{/* Content for Alert Analytics */}
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
													marginLeft: "0px",
													marginBottom: "40px",
												}}
											>
												<RangePicker
													defaultValue={[defaultStartDate, defaultEndDate]} // Set default values
													style={{ color: "black", backgroundColor: "white" }}
												/>
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
												borderRadius: "5px",
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
												borderRadius: "5px",
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
