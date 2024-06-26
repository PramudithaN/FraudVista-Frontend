import {
	Button,
	DatePicker,
	FloatButton,
	Form,
	Input,
	Layout,
	Modal,
	NotificationArgsProps,
	Select,
	Table,
	Tag,
	message,
	notification,
} from "antd";
import { useEffect, useState } from "react";
import { Row, Col } from "antd";
import { Header } from "antd/es/layout/layout";
import axios from "axios";
import moment, { Moment } from "moment";
import dayjs, { Dayjs } from "dayjs";
import DonutChart from "./Charts/DonutChart";

type NotificationType = "success" | "info" | "warning" | "error";
type NotificationPlacement = NotificationArgsProps["placement"];

interface FraudRuleOption {
	id: number;
	rule: string;
	description: string;
	type: string;
}

interface TransactionDetails {
	remark: string;
	severity: string;
	fraudRule: string;
	ruleDescription: string;
	transactionId: string;
}

interface Transaction {
	id: number;
	createdDate: string;
	amount: number;
	transactionType: string;
	customerId: string;
	flag: string;
}

const Transactions = () => {
	const [form] = Form.useForm();
	const { RangePicker } = DatePicker;
	const [tableData, setTableData] = useState<Transaction[]>([]);
	const [transactionId, setTransactionId] = useState("");
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
		null,
		null,
	]);
	const [searchCriteria, setSearchCriteria] = useState<string>("");
	const [transactionsData, setTransactionsData] = useState<any[]>([]);
	const [selectedCustomerId, setSelectedCustomerId] = useState("");

	const handleSearchCriteriaChange = (criteria: string) => {
		setSearchCriteria(criteria);
	};
	const [transactionDetails, setTransactionDetails] =
		useState<TransactionDetails | null>(null);
	const [fraudRuleOptions, setFraudRuleOptions] = useState<
		{
			value: string;
			label: string;
			id?: number;
			description?: string;
			rule?: string;
		}[]
	>([]);

	const [selectedCategory, setSelectedCategory] = useState<any>("");
	const [cancelButtonClicked, setCancelButtonClicked] = useState(false);
	const [api, contextHolder] = notification.useNotification();

	//Add Notes States
	const { Option } = Select;
	const { TextArea } = Input;
	const [addNotesModalVisible, setAddNotesModalVisible] = useState(false);
	const [selectedRule, setSelectedRule] = useState("");
	const [remark, setRemark] = useState("");
	const [fraudStatus, setFraudStatus] = useState("");
	const [severity, setSeverity] = useState("");
	const [putSeverity, setPutSeverity] = useState("");
	// ------------------------------------------------------------------------------------------------------------------------------

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

	//Table Columns
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
			align: "left",
			render: (text: any) => (
				<p style={{ textAlign: "left" }}>
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
			dataIndex: "customer",
			key: "customerId",
			title: "Customer ID",
			render: (customer: any) => (
				<p>{customer && customer.id ? customer.id : "-"}</p>
			),
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
							handleNotFlaggedClick(record.id);
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
							disabled={record.isFraud === "N" || record.isFraud === null} // Disable the button if isFraud is "N"
							onClick={(e) => {
								setViewModalOpen(true);
								handleViewDetails(record.id);
							}}
						>
							View
						</Button>
					</>
				);
			},
		},
	];

	//API s--------------------------------------------------------------------------------------------------------------

	// API for searching by Customer ID
	const searchByCustomerID = async (customerId: string) => {
		try {
			const result = await axios(
				`http://localhost:8080/transaction/customer/${customerId}`
			);
			setTransactionsData(result.data);
			setTableData(result.data);
			setSelectedCustomerId(customerId);
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

	// API get all transactions
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
		}
	};

	// Fetch data on date range change
	useEffect(() => {
		fetchData();
	}, [dateRange]);

	// API to fetch View Notes
	const fetchTransactionDetails = async (transactionId: any) => {
		try {
			const response = await axios.get(
				`http://localhost:8080/viewDetails/${transactionId}`
			);
			setTransactionDetails(response.data);
			setSeverity(response.data.severity);

			if (response.data.remark === "N/A") {
				response.data.remark = "-";
			} else {
				console.log("Error");
			}

			setViewModalOpen(true); // Open the view modal after fetching data
		} catch (error) {
			console.error("Error fetching transaction details:", error);
		}
	};

	//Refresh data from all APIs
	const fetchDataFromAllApis = async () => {
		try {
			// Fetch data by Customer ID
			if (searchCriteria === "CustomerId") {
				await searchByCustomerID(selectedCustomerId); // Use the stored customer ID
			}
			// Fetch data by Transaction ID
			else if (searchCriteria === "TransactionId") {
				await searchByTransactionID(transactionId);
			}
			// Fetch all transactions
			else if (searchCriteria === "DateRange") {
				await fetchData();
			}
		} catch (error) {
			console.error("Error fetching data from all APIs:", error);
		}
	};

	//Api to mark transaction as fraud
	const handleAddNotes = async () => {
		if (
			(remark === "" || remark === null) &&
			(selectedRule === "" || selectedRule === null)
		) {
			// message.error("Please enter a remark and select a fraud rule.");
			errorNotification("error", "bottomRight");
			return;
		} else {
			// message.success("Transaction has been marked as fraud.");
			successNotification("success", "bottomRight");
			console.log("SUCESS");

			// try {
				await axios.put("http://localhost:8080/fraud/transaction/flag", {
					transactionId: transactionId,
					fraudRule: selectedCategory,
					remark: remark,
					severity: putSeverity,
					flag: "Y",
					modifiedBy: "lakshika",
				});

				setFraudStatus("Y");
				setSeverity(putSeverity);
				setAddNotesModalVisible(false);
				setSelectedCategory("");
				setSelectedRule("");
				setRemark("");
				setTransactionId("");

				// Fetch data from all APIs after adding notes
				fetchDataFromAllApis();
			// } catch (error) {
			// 	console.error("Error marking transaction as fraud:", error);
			// }
		}
	};

	// Api to fetch fraud rules
	useEffect(() => {
		const fetchFraudRuleOptions = async () => {
			try {
				const response = await axios.get<FraudRuleOption[]>(
					"http://localhost:8080/fraud/rules"
				);
				// Map through the response data and construct the options with description
				const optionsWithDescription = response.data.map((option) => ({
					id: option.id,
					value: option.rule,
					label: option.description,
					type: option.type,
				}));
				setFraudRuleOptions(optionsWithDescription);
			} catch (error) {
				console.error("Error fetching fraud rule options:", error);
			}
		};

		fetchFraudRuleOptions();
	}, []);

	// Functions --------------------------------------------------------------------------------------------------------------

	// Function to display success notification
	const successNotification = (
		type: NotificationType,
		placement: NotificationPlacement
	) => {
		api[type]({
			message: "Success",
			placement: placement,
			description: "Transaction has been marked as fraud.",
		});
	};

	const errorNotification = (
		type: NotificationType,
		placement: NotificationPlacement
	) => {
		api[type]({
			message: "Error",
			placement: placement,
			description: "Please enter a remark and select a fraud rule.",
		});
	};
	// Handler for date range change
	const handleDateRangeChange = (
		dates: [Dayjs | null, Dayjs | null],
		dateStrings: [string, string]
	) => {
		// Update dateRange state with selected dates
		setDateRange(dates);
	};

	// Handler for view button click
	const handleViewDetails = (transactionId: any) => {
		fetchTransactionDetails(transactionId);
	};

	// Handler for not flagged button click
	const handleNotFlaggedClick = (record: any) => {
		setTransactionId(record);
		setAddNotesModalVisible(true);
	};

	// Function to extract severity in fraud rules
	const handleChange = (value: string, option: any) => {
		setSelectedCategory(value); // Update selected category state
		// Find the selected option by its ID
		const selectedOption = fraudRuleOptions.find(
			(opt: any) => opt.id === parseInt(value)
		);

		// Check if selectedOption is defined and has a 'type' property
		if (
			selectedOption &&
			"type" in selectedOption &&
			typeof selectedOption.type === "string"
		) {
			const typeValue = selectedOption.type; // Access the 'type' property
			setPutSeverity(typeValue); // Update putSeverity state with type
		}
	};

	return (
		<>
			{contextHolder}
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
						<Col span={8} style={{ display: "flex", flexDirection: "column" }}>
							<span
								style={{
									color: "white",
									marginBottom: "5px",
									fontSize: "20px",
								}}
							>
								Transaction ID
							</span>
							<Form.Item name="TransactionId">
								<Input
									style={{
										backgroundColor: "white",
										color: "black",
										width: "120%",
									}}
								/>
							</Form.Item>
						</Col>

						<Col span={8} style={{ display: "flex", flexDirection: "column" }}>
							<span
								style={{
									color: "white",
									marginBottom: "5px",
									fontSize: "20px",
								}}
							>
								Customer ID
							</span>
							<Form.Item name="CustomerId">
								<Input
									style={{
										backgroundColor: "white",
										color: "black",
										width: "120%",
									}}
								/>
							</Form.Item>
						</Col>

						<Col span={8} style={{ display: "flex", flexDirection: "column" }}>
							<span
								style={{
									color: "white",
									marginBottom: "5px",
									fontSize: "20px",
								}}
							>
								Date Range
							</span>
							<Form.Item name="RangePicker">
								<div>
									<DatePicker.RangePicker
										value={dateRange}
										onChange={handleDateRangeChange}
										style={{
											backgroundColor: "white",
											color: "black",
											width: "120%",
										}}
									/>
								</div>
							</Form.Item>
						</Col>
					</Row>

					{/* Search Button */}
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

					{/* Display Tag */}
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
						style={{
							backgroundColor: "#f4f4f4",
							borderRadius: "10px",
							marginBottom: "50px",
						}}
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
								{tableData.length === 0 ? (
									<p style={{ marginLeft: "170px" }}>No data available</p>
								) : (
									<>
										Transactions by Type
										<div
											className="mt-9 size-2 h-4"
											style={{
												scale: "1",
												marginTop: "-80px",
												paddingTop: "10px",
												paddingLeft: "40px",
											}}
										>
											<DonutChart transactions={transactionsData} />
										</div>
									</>
								)}
							</div>
						</div>
					)}

					{/* View Notes Modal */}
					<Modal
						title="View Notes"
						width={650}
						visible={viewModalOpen}
						onCancel={() => setViewModalOpen(false)}
						footer={null}
					>
						<Form style={{ marginLeft: "10px", marginTop: "30px" }}>
							<Row gutter={16}>
								<Form.Item label="Transaction ID" style={{ fontWeight: 480 }}>
									{transactionDetails?.transactionId}
								</Form.Item>
							</Row>
							<Row gutter={16}>
								<Form.Item label="Remark" style={{ fontWeight: 480 }}>
									{transactionDetails?.remark}
								</Form.Item>
							</Row>
							<Row gutter={16}>
								<Form.Item label="Severity" style={{ fontWeight: 480 }}>
									{transactionDetails?.severity}
								</Form.Item>
							</Row>
							<Row gutter={16}>
								<Form.Item label="Fraud Rule" style={{ fontWeight: 480 }}>
									{transactionDetails?.fraudRule}
								</Form.Item>
							</Row>
							<Row gutter={16}>
								<Form.Item label="Rule Description" style={{ fontWeight: 480 }}>
									{transactionDetails?.ruleDescription}
								</Form.Item>
							</Row>
						</Form>
					</Modal>

					{/* Add Notes Modal */}
					<Modal
						title="Add Notes"
						width={650}
						visible={addNotesModalVisible}
						onCancel={() => {
							setSelectedCategory("");
							setAddNotesModalVisible(false);
							setSelectedRule("");
							setRemark("");
							setSeverity("");
							setTransactionId("");
							if (cancelButtonClicked) {
								setSelectedCategory("");
								setRemark("");
								setCancelButtonClicked(false);
							}

							// Clear UI elements manually, handling null case
							const fraudRuleSelect =
								document.getElementById("selectedCategory");
							if (fraudRuleSelect instanceof HTMLSelectElement) {
								fraudRuleSelect.selectedIndex = 0;
							}

							const remarkTextArea = document.getElementById("remark");
							if (remarkTextArea instanceof HTMLTextAreaElement) {
								remarkTextArea.value = "";
							}
						}}
						footer={[
							<Button
								style={{ width: "100px" }}
								key="submit"
								type="primary"
								onClick={handleAddNotes}
							>
								Flag
							</Button>,
						]}
					>
						<Form style={{ marginTop: "40px" }}>
							<Form.Item label="Fraud Rule">
								<Select value={selectedCategory} onChange={handleChange}>
									<option value={""} disabled>
										Select a Fraud Rule
									</option>
									{fraudRuleOptions.map((category) => (
										<option key={category.id} value={category.id}>
											{category.label}
										</option>
									))}
								</Select>
							</Form.Item>

							<Form.Item label="Remark">
								<TextArea
									rows={4}
									value={remark}
									onChange={(e) => setRemark(e.target.value)}
								/>
							</Form.Item>
						</Form>
					</Modal>
				</Form>
				<FloatButton.BackTop />
			</Layout>
		</>
	);
};

export default Transactions;
