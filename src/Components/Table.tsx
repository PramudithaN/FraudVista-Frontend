import React from "react";
import { Space, Table, Tag } from "antd";

const { Column, ColumnGroup } = Table;

interface DataType {
	key: React.Key;
	firstName: string;
	lastName: string;
	age: number;
	address: string;
	tags: string[];
}

const data: DataType[] = [
	{
		key: "1",
		firstName: "John",
		lastName: "Brown",
		age: 32,
		address: "New York No. 1 Lake Park",
		tags: ["nice", "developer"],
	},
	{
		key: "2",
		firstName: "Jim",
		lastName: "Green",
		age: 42,
		address: "London No. 1 Lake Park",
		tags: ["loser"],
	},
	{
		key: "3",
		firstName: "Joe",
		lastName: "Black",
		age: 32,
		address: "Sydney No. 1 Lake Park",
		tags: ["cool", "teacher"],
	},
];

const TableComponent: React.FC = () => (
	<Table dataSource={data}>
		<Column title="TXN Id" dataIndex="firstName" key="firstName" />
		<Column title="Date" dataIndex="lastName" key="lastName" />
		<Column title="Amount" dataIndex="age" key="age" />
		<Column title="TXN Type" dataIndex="address" key="address" />
		<Column title="Customer ID" dataIndex="address" key="address" />
		<Column
			title="Flagged as Fraud"
			dataIndex="tags"
			key="tags"
			render={(tags: string[]) => (
				<>
					{tags.map((tag) => {
						let color = tag.length > 5 ? "geekblue" : "green";
						if (tag === "loser") {
							color = "volcano";
						}
						return (
							<Tag color={color} key={tag}>
								{tag.toUpperCase()}
							</Tag>
						);
					})}
				</>
			)}
		/>
		<Column
			title="Action"
			key="action"
			render={(_: any, record: DataType) => (
				<Space size="middle">
					<a>View </a>
					<a>Notes</a>
				</Space>
			)}
		/>
	</Table>
);

export default TableComponent;
