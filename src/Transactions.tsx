import {
	Button,
	Cascader,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Layout,
	Mentions,
	Modal,
	Radio,
	Select,
	Table,
	Tag,
	TreeSelect,
	message,
} from "antd";
import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import { Header } from "antd/es/layout/layout";
import TableComponent from "./Components/Table";
import axios from "axios";
import { ExclamationCircleOutlined, WarningOutlined } from "@ant-design/icons";
import modal from "antd/es/modal";
import moment from "moment";
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

// const TableComponent = () => {
const Transactions = () => {
	const [form] = Form.useForm();
	const { RangePicker } = DatePicker;
	const [tableData, setTableData] = useState<TableDataItem[]>([]); // replace [] with your actual data
	const [filteredData, setFilteredData] = useState([]);
	const [open, setOpen] = useState(false);
	const [viewNotes, setViewNotes] = useState(false);
	const [notes, setNotes] = useState('');
	const [customerId, setCustomerId] = useState("");
	const [transactionId, setTransactionId] = useState("");
	const [fraudTransactions, setFraudTransactions] = useState<string[]>([]);
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [data, setData] = useState<DataItem[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isTextAreaEmpty, setIsTextAreaEmpty] = useState(true);

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

	const handleUnblock = async (record: DataItem) => {
		try {
			//API call to update the user's status to "ACTIVE"
			await axios.put(`http://localhost:8080/fraud/transaction/flag`, {
				remark: viewNotes,
			});

			// Update the local data array with the updated record
			// const updatedRecord = { ...record, status: "ACTIVE" };
			// const updatedData = data.map((item) =>
			// 	item.id === record.id ? updatedRecord : item
			// );
			// setData(updatedData);
			// setFilteredData(updatedData);

			message.success("User unblocked successfully");
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
			render: (text: any) => (
				<p>
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
						onClick={() => setIsModalOpen(true)}
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
							onClick={(e) => {
								setViewModalOpen(true);
								setViewNotes(true);
								//   setSelectedRecord(record);
							}}
						>
							View
						</Button>
						<Button
							type="link"
							size="small"
							onClick={(e) => {
								setViewModalOpen(true);
								setOpen(true);

								// setSelectedRecord(record);
							}}
						>
							Add Notes
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

	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleOk = (record: any) => {
		// const comment = textAreaRef.current?.state.value;
		//   console.log(comment); // You can replace this line with your own logic
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
					const { TransactionId, CustomerId } = values;
					if (TransactionId) {
						searchByTransactionID(TransactionId);
					} else if (CustomerId) {
						searchByCustomerID(CustomerId);
					}
					form.resetFields();
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
						style={{
							width: "15%",
							marginBottom: "40px",
							marginLeft: "250px",
							height: "50px",
							fontSize: "25px",
							fontWeight: "600",
						}}
					>
						Search
					</Button>
				</Form.Item>

				{/* <TableComponent /> */}
				<Table
					dataSource={tableData}
					style={{ backgroundColor: "#f4f4f4", borderRadius: "10px" }}
					columns={columns}
				/>

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
				>	<Row gutter={16}>
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
						onChange={(e) => setNotes(e.target.value)}
					/>
				</Form.Item>
			</Row></Modal>
			</Form>
		</Layout>
	);
};

export default Transactions;
