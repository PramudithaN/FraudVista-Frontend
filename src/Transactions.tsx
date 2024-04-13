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
	const [tableData, setTableData] = useState<TableDataItem[]>([]); // replace [] with your actual data
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
	const [dateRange, setDateRange] = useState<[Moment | null, Moment | null]>([
		null,
		null,
	]);


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
	const onAddNoteButtonClick = () => {
		// Open the modal and pass the addNote function as a prop
		setViewModalOpen(true);
		setOpen(true);
	};

	const handleUnblock = async (record: DataItem) => {
		try {
			//API call to update the user's status to "ACTIVE"
			await axios.put(`http://localhost:8080/fraud/transaction/flag`, {
				responseDetails: notes,
			});

			message.success("Flag as Fraud successfully");
		} catch (error) {
			console.error("Error unblocking user:", error);
			message.error("Failed to unblock user");
		}
	};

	// Fraud Confirmation Modal
	// 	const confirm = (transactionId: string) => {
	// 		const textAreaRef = useRef();
	// 		 Modal.confirm({
	//     centered: true,
	//     title: "Confirm",
	//     icon: <ExclamationCircleOutlined />,
	//     content: (
	//       <div>
	//         <p>Are you sure you want to mark this transaction as fraud?</p>
	//         <Input.TextArea ref={textAreaRef} />
	//       </div>
	//     ),
	//     onOk: (record:any) => {
	//       const comment = textAreaRef.current?.state.value;
	//       console.log(comment); // You can replace this line with your own logic
	//       handleUnblock(record);
	//       setFraudTransactions((prev) => [...prev, transactionId]);
	//     },
	//     cancelText: "No",
	//   });
	// };

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
				const isFraud = fraudTransactions.includes(record.id);
				return (
					<Tag
						color={isFraud ? "red" : "green"}
						onClick={() => {
							setIsModalOpen(true);
							addNote(record);
						}}
						//   style={{
						// 	cursor: "pointer",
						// 	backgroundColor: "#4096ff",
						// 	color: "white",
						// 	paddingTop: "3px",
						// 	width: "102px",
						// 	height: "30px",
						// 	fontSize: "15px",
						//   }}
					>
						{isFraud ? "Flagged" : text}
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
							disabled={record.flag === "Flagged"}
							onClick={(e) => {
								setViewModalOpen(true);

								//   setSelectedRecord(record);
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

	const fetchData = async () => {
		try {
			console.log("Fetching data for date range:", dateRange);
			const response = await axios.get<Transaction[]>(
				"http://localhost:8080/allTransaction"
			);
			console.log("Response Data:", response.data); // Log the response data
			const filteredData = response.data.filter((transaction) => {
				const transactionDate = moment(transaction.createdDate);
				const startDate = moment(dateRange[0]);
				const endDate = moment(dateRange[0]).endOf("day"); // Set the end date to the end of the selected day

				// Check if the transaction date is within the selected date range
				return (
					transactionDate.isSameOrAfter(startDate) &&
					transactionDate.isSameOrBefore(endDate)
				);
			});
			console.log("Filtered Data:", filteredData); // Log the filtered data
			setTableData(filteredData);
		} catch (error) {
			console.error("Error fetching data:", error);
			message.error("Failed to fetch data");
		}
	};
	useEffect(() => {
		console.log("Date Range:", dateRange);
		fetchData();
	}, [dateRange]);
	
	const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
		const convertedDates: [Moment | null, Moment | null] = [
			moment(dates[0]),
			moment(dates[1]),
		];
		setDateRange(convertedDates);
	};

	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleOk = (record: any) => {
		handleUnblock(record);
		setFraudTransactions((prev) => [...prev, transactionId]);
		setIsModalOpen(false);
	};

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
						} else if (CustomerId) {
							searchByCustomerID(CustomerId);
						} else if (dateRange) {
							fetchData();
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
										marginRight: "10px",
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
							<RangePicker
								onChange={(dates, dateStrings) =>
									handleDateRangeChange(dates, dateStrings)
								}
								style={{
									backgroundColor: "white",
									color: "black",
									width: "100%",
								}}
							/>
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
				<div
					style={{
						color: "white",
						// width: "15%",
						marginBottom: "40px",
						marginLeft: "250px",
						height: "40px",
						fontSize: "18px",
						paddingTop: "-100px",
						paddingLeft: "200px",
						paddingRight: "40px",
						fontWeight: "400",
						fontStyle: "italic",
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
						Please search using any of the above criteria to inquire transaction
						details.
					</Tag>
				</div>

				{/* <TableComponent /> */}
				<Table
					dataSource={tableData}
					style={{ backgroundColor: "#f4f4f4", borderRadius: "10px" }}
					columns={columns}
					rowKey="id" // Set a unique key for each row
				/>

				{/* Content for Transactions by Type */}
				<div className="flex-item" style={{ marginTop: "50px" }}>
					<div className="card-container">
						Transactions by Type
						<div className="mt-9 size-2 h-4">{/* <PieChart /> */}</div>
					</div>
				</div>

				{/* Add Notes */}
				{/* <Modal
					title="Add Notes"
					centered
					open={open}
					onOk={() => setOpen(false)}
					onCancel={() => setOpen(false)}
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
				</Modal> */}

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
