import {
	Button,
	Cascader,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Layout,
	Mentions,
	Radio,
	Select,
	TreeSelect,
} from "antd";
import React, { useState } from "react";
import TableComponent from "./Components/Table";
import { Row, Col } from "antd";
import { Header } from "antd/es/layout/layout";

const Transactions: React.FC = () => {
	const [form] = Form.useForm();
	const { RangePicker } = DatePicker;

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
	return (
		<Layout style={{ backgroundColor: "#020617" }}>
			<Header style={{ padding: 0, background: "#020617" }} />
			<h1 className="Heading">Transaction Inquiry Details</h1>
			<Form
				{...formItemLayout}
				variant="filled"
				style={{
					maxWidth: 3200,
					marginTop: "100px",
					marginLeft: "50px",
					marginRight: "50px",
				}}
			>
				<Row gutter={4} style={{ marginBottom: "20px" }}>
					<Col span={8}>
						<Form.Item
							label={
								<span style={{ color: "white", marginBottom: "10px" }}>
									Transaction Id
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
								<span style={{ color: "white", marginBottom: "10px" }}>
									Customer Id
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
								<span style={{ color: "white", marginBottom: "10px" }}>
									RangePicker
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
						style={{ width: "80%", marginBottom: "40px" }}
					>
						Search
					</Button>
				</Form.Item>
				<TableComponent />
			</Form>
		</Layout>
	);
};

export default Transactions;
