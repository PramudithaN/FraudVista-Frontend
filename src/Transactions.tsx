import {
	Button,
	DatePicker,
	FloatButton,
	Form,
	Input,
	Layout,
	Modal,
	Table,
	Tag,
	message,
} from "antd";
import { useEffect, useState } from "react";
import { Row, Col } from "antd";
import { Header } from "antd/es/layout/layout";
import axios from "axios";
import moment, { Moment } from "moment";
import TextArea from "antd/es/input/TextArea";
import dayjs, { Dayjs } from "dayjs";
import CJSPie from "./Charts/ChartjsPir";

interface TableDataItem {
	// Add the properties of the objects here
	[key: string]: any; // Use this line if the object's properties are dynamic
}

interface DataItem {
	id?: number;
	email: string;
	password: string;
	businessName: string;
	status: string;
	contactNumber: string;
	businessRegistrationNumber: string;
	businessCategory: {
		id: number;
		categoryName: string;
	};
	userRole: {
		id: number;
		roleDescription: string;
	};
}

interface Transaction {
	id: number;
	createdDate: string;
	amount: number;
	transactionType: string;
	customerId: string;
	flag: string;
}

// const TableComponent = () => {
const Transactions = () => {
	const [form] = Form.useForm();
	const { RangePicker } = DatePicker;
	const [tableData, setTableData] = useState<Transaction[]>([]); // replace [] with your actual data
	const [filteredData, setFilteredData] = useState([]);
	const [open, setOpen] = useState(false);
	const [viewNotes, setViewNotes] = useState(false);
	const [notes, setNotes] = useState<string[]>([]);
	const [customerId, setCustomerId] = useState("");
	const [transactionId, setTransactionId] = useState("");
	const [fraudTransactions, setFraudTransactions] = useState<string[]>([]);
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [data, setData] = useState<DataItem[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isTextAreaEmpty, setIsTextAreaEmpty] = useState(true);
	const [dataMonth, setDataMonth] = useState({ allMonth: "", number: 0 });
	const [loading, setLoading] = useState(true);
	// const [dateRange, setDateRange] = useState([]);
	const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
		null,
		null,
	]);
	const [searchCriteria, setSearchCriteria] = useState<string>("");
	const [transactionsData, setTransactionsData] = useState<any[]>([]);

	const handleSearchCriteriaChange = (criteria: string) => {
		setSearchCriteria(criteria);
	};

	// Layout for Form
	const formItemLayout = {
		labelCol: {
			xs: { span: 32 },
			sm: { span: 6 },
		},
		wrapperCol: {
			xs: { span: 32 },
			sm: { span: 14 },
		},
	};

	const addNote = (note: string) => {
		setNotes((prevNotes) => [...prevNotes, note]);
	};

	const columns: any[] = [
		{
			dataIndex: "id",
			key: "id",
			title: "Transaction ID",
			render: (text: any) => <p>{text ? text : "-"}</p>,
		},
		{
			dataIndex: "createdDate",
			key: "createdDate",
			title: "Date",
			render: (text: any, record: any) => (
				<p>{text ? moment(text).format("DD/MM/YYYY") : "-"}</p>
			),
		},
		{
			dataIndex: "amount",
			key: "amount",
			title: "Amount",
			align: "right",
			render: (text: any) => (
				<p style={{ textAlign: "right" }}>
					{text
						? parseFloat(text).toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
						  })
						: "-"}
				</p>
			),
		},
		{
			dataIndex: "transactionType",
			key: "transactionType",
			title: "Transaction Type",
			render: (text: any) => <p>{text ? text : "-"}</p>,
		},
		{
			dataIndex: "customerId",
			key: "customerId",
			title: "Customer ID",
			render: (text: any) => <p>{text ? text : "-"}</p>,
		},
		{
			dataIndex: "flag",
			key: "flag",
			title: "Flagged as Fraud",
			render: (text: string, record: any) => {
				const isFraud = record.isFraud === "Y"; // Check if the record is marked as fraud
				return isFraud ? (
					<Tag style={{ cursor: "not-allowed" }} color={"red"}>
						Flagged
					</Tag> // Display "Flagged" in the Tag
				) : (
					<Tag
						color={"green"}
						style={{ cursor: "pointer" }}
						onClick={() => {
							setIsModalOpen(true);
							addNote(record);
						}}
					>
						Not Flagged {/* Display "Not Flagged" in the Tag */}
					</Tag>
				);
			},
		},

		{
			dataIndex: "action",
			key: "action",
			title: "Notes",
			render: (text: string, record: any, index: any) => {
				return (
					<>
						<Button
							type="link"
							size="small"
							disabled={record.isFraud === "N"} // Disable the button if isFraud is "N"
							onClick={(e) => {
								setViewModalOpen(true);
								// setSelectedRecord(record);
							}}
						>
							View
						</Button>
					</>
				);
			},
		},
	];

	// API for searching by Customer ID
	const searchByCustomerID = async (customerId: string) => {
		try {
			const result = await axios(
				`http://localhost:8080/transaction/customer/${customerId}`
			);
			setTransactionsData(result.data);
			setTableData(result.data);
		} catch (error) {
			console.error(
				"Error occurred while fetching data by Customer ID: ",
				error
			);
		}
	};

	// API for searching by Transaction ID
	const searchByTransactionID = async (transactionId: string) => {
		try {
			const result = await axios(
				`http://localhost:8080/transaction/${transactionId}`
			);
			setTableData([result.data]);
		} catch (error) {
			console.error(
				"Error occurred while fetching data by Transaction ID: ",
				error
			);
		}
	};

	const handleDateRangeChange = (
		dates: [Dayjs | null, Dayjs | null],
		dateStrings: [string, string]
	) => {
		// Update dateRange state with selected dates
		setDateRange(dates);
		console.log("Selected date range:", dates);
		console.log("Formatted date strings:", dateStrings);
	};

	const fetchData = async () => {
		try {
			// Check if both start and end dates are selected
			if (!dateRange[0] || !dateRange[1]) {
				console.log("Please select both start and end dates.");
				return;
			}

			const startDate = dayjs(dateRange[0] as Dayjs);
			const endDate = dayjs(dateRange[1] as Dayjs).endOf("day");

			const response = await axios.get<Transaction[]>(
				"http://localhost:8080/allTransaction"
			);

			// Filter the data based on the selected date range
			const filteredData = response.data.filter((transaction) => {
				const transactionDate = dayjs(transaction.createdDate);
				return (
					transactionDate.isSame(startDate, "day") ||
					(transactionDate.isAfter(startDate, "day") &&
						(transactionDate.isSame(endDate, "day") ||
							transactionDate.isBefore(endDate, "day")))
				);
			});

			setTableData(filteredData); // Update table data with filtered data
		} catch (error) {
			console.error("Error fetching data:", error);
			message.error("Failed to fetch data");
		}
	};

	useEffect(() => {
		console.log("Date Range:", dateRange);
		fetchData();
	}, [dateRange]);

	const handleOk = async (record: any) => {
		try {
			// Make the API call to update the transaction as fraud
			await axios.put(`http://localhost:8080/fraud/transaction/flag`, {
				transactionId: record.id,
				fraudTransactionDetailResponses: notes, // Pass the notes entered by the user
			});

			// Update the state or perform any necessary actions
			setFraudTransactions((prev) => [...prev, record.id]);
			message.success("Transaction marked as fraud successfully");
			setIsModalOpen(false); // Close the modal
		} catch (error) {
			console.error("Error marking transaction as fraud:", error);
			message.error("Failed to mark transaction as fraud");
		}
		// handleUnblock(record);
		setFraudTransactions((prev) => [...prev, transactionId]);
		setIsModalOpen(false);
	};
	console.log("Notes:", notes);

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	return (
		<Layout style={{ backgroundColor: "#020617" }}>
			<Header style={{ padding: 0, background: "#020617" }} />
			<h1 className="Heading">Transaction Inquiry Details</h1>
			<Form
				{...formItemLayout}
				form={form}
				onFinish={(values) => {
					{
						const { TransactionId, CustomerId } = values;
						if (TransactionId) {
							searchByTransactionID(TransactionId);
							handleSearchCriteriaChange("TransactionId");
						} else if (CustomerId) {
							searchByCustomerID(CustomerId);
							handleSearchCriteriaChange("CustomerId");
						} else if (dateRange) {
							fetchData();
							handleSearchCriteriaChange("DateRange");
						}
						form.resetFields();
					}
				}}
				variant="filled"
				style={{
					maxWidth: 3200,
					marginTop: "100px",
					marginLeft: "50px",
					marginRight: "50px",
				}}
			>
				{/* Search Fields */}
				<Row gutter={4} style={{ marginBottom: "20px" }}>
					<Col span={8}>
						<Form.Item
							label={
								<span
									style={{
										color: "white",
										marginBottom: "5px",
										fontSize: "20px",
									}}
								>
									Transaction ID
								</span>
							}
							name="TransactionId"
						>
							<Input
								style={{
									backgroundColor: "white",
									color: "black",
									width: "100%",
									// marginLeft: "10px",
								}}
							/>
						</Form.Item>
					</Col>

					<Col span={8}>
						<Form.Item
							label={
								<span
									style={{
										color: "white",
										marginBottom: "5px",
										fontSize: "20px",
									}}
								>
									Customer ID
								</span>
							}
							name="CustomerId"
						>
							<Input
								style={{
									backgroundColor: "white",
									color: "black",
									width: "100%",
								}}
							/>
						</Form.Item>
					</Col>

					<Col span={8}>
						<Form.Item
							label={
								<span
									style={{
										color: "white",
										marginBottom: "5px",
										fontSize: "20px",
									}}
								>
									Date Range
								</span>
							}
							name="RangePicker"
						>
							<div>
								<DatePicker.RangePicker
									value={dateRange}
									onChange={handleDateRangeChange}
									style={{
										backgroundColor: "white",
										color: "black",
										width: "100%",
									}}
								/>
							</div>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item wrapperCol={{ offset: 6, span: 16 }}>
					<Button
						type="primary"
						htmlType="submit"
						onClick={fetchData}
						style={{
							// width: "15%",
							marginBottom: "20px",
							marginLeft: "250px",
							height: "40px",
							fontSize: "22px",
							paddingTop: "1px",
							paddingLeft: "40px",
							paddingRight: "40px",
							fontWeight: "600",
						}}
					>
						Search
					</Button>
				</Form.Item>
				<Form.Item>
					<div
						style={{
							alignItems: "center",
							justifyContent: "center",
							display: "flex",
							marginLeft: "540px",
							marginTop: "20px",
						}}
					>
						<Tag
							style={{
								color: "#4096ff",
								backgroundColor: "#292e3c",
								borderColor: "#434b62",
								stroke: "#292e3c",
								height: "40px",
								fontSize: "18px",
								paddingTop: "8px",
								fontWeight: "400",
								fontStyle: "italic",
							}}
						>
							Please search using any of the above criteria to inquire
							transaction details.
						</Tag>
					</div>
				</Form.Item>
				{/* <TableComponent /> */}
				<Table
					dataSource={tableData}
					style={{ backgroundColor: "#f4f4f4", borderRadius: "10px" }}
					columns={columns}
					rowKey="id" // Set a unique key for each row
					pagination={{ pageSize: 5 }}
				/>

				{/* Content for Transactions by Type */}
				{searchCriteria === "CustomerId" && (
					<div
						className="flex-item"
						style={{ marginTop: "50px", marginBottom: "30px" }}
					>
						<div className="card-container-TChart">
							Transactions by Type
							<div
								className="mt-9 size-2 h-4"
								style={{
									scale: "0.9",
									marginTop: "-80px",
									paddingTop: "100px",
									paddingLeft: "50px",
									// marginBottom: "-180px",
								}}
							>
								<CJSPie transactions={transactionsData} />
							</div>
						</div>
					</div>
				)}

				{/* View Notes */}
				<Modal
					title="View Notes"
					centered
					open={viewNotes}
					onOk={() => setViewNotes(false)}
					onCancel={() => setViewNotes(false)}
					width={500}
					style={{ color: "white" }}
					className="custom-modal"
				>
					<Row gutter={16}>
						<Form.Item name={["addNotes", "introduction"]}>
							<TextArea
								rows={4}
								placeholder="Add your Notes here..."
								maxLength={250}
								disabled
								style={{
									width: "600px",
									paddingTop: "20px",
									marginTop: "20px",
									paddingBottom: "-10px",
									marginLeft: "50px",
								}}
							/>
						</Form.Item>
					</Row>
				</Modal>

				{/* Fraud Confirmation Modal */}
				<Modal
					title="Are you sure you want to mark this transaction as fraud?"
					open={isModalOpen}
					onOk={handleOk}
					onCancel={handleCancel}
				>
					{" "}
					<Row gutter={16}>
						<Form.Item name={["addNotes", "introduction"]}>
							<TextArea
								rows={4}
								placeholder="Add your Notes here..."
								maxLength={250}
								style={{
									width: "600px",
									paddingTop: "20px",
									marginTop: "20px",
									paddingBottom: "-10px",
									marginLeft: "50px",
								}}
								// onChange={(e) => setNotes(e.target.value)}
							/>
						</Form.Item>
					</Row>
				</Modal>
			</Form>
			<FloatButton.BackTop />
		</Layout>
	);
};

export default Transactions;
