import { Form, Input, DatePicker, Button, Layout, Select, Space } from "antd";
import React from "react";
import TableComponent from "./Components/Table";

const { RangePicker } = DatePicker;

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 6 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 14 },
	},
};
const { Option } = Select;

const Transactions: React.FC = () => (
	<Layout style={{ backgroundColor: "#fff" }}>
		<Form {...formItemLayout} variant="filled" style={{ maxWidth: 600 }}>
			<Form.Item>
				<Space.Compact>
					<Form.Item name={["address", "province"]} noStyle>
						<Select placeholder="Select Search">
							<Option value="transactionId">Transaction ID</Option>
							<Option value="customerId">Customer ID</Option>
						</Select>
					</Form.Item>
					<Form.Item name={["address", "street"]} noStyle>
						<Input style={{ width: "100%" }} placeholder="Search..." />
					</Form.Item>
				</Space.Compact>
			</Form.Item>
			<TableComponent />
		</Form>
	</Layout>
);

export default Transactions;
