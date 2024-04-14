import React, { useState } from "react";
import { Button, Space, Table, Tag } from "antd";

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

const TableComponent = () => {
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const columns: any[] = [
		{
			dataIndex: "createdDate",
			key: "createdDate",
			title: "Transaction ID",
		},
		{
			dataIndex: "branchName",
			key: "branchName",
			title: "Date",
		},
		{
			dataIndex: "businessUnit",
			key: "businessUnit",
			title: "Amount",
			render: (text: any) => <p>{text ? text : "-"}</p>,
		},
		{
			dataIndex: "transferMethod",
			key: "transferMethod",
			title: "Transaction Type",
			render: (text: any) => <p>{text ? text : "-"}</p>,
		},
		{
			dataIndex: "transferMethod",
			key: "transferMethod",
			title: "Customer ID",
			render: (text: any) => <p>{text ? text : "-"}</p>,
		},
		{
			dataIndex: "status",
			key: "status",
			title: "Flagged as Fraud",
			render: (text: string) => {
				const colorMap: { [key: string]: string } = {
					ACCEPTED: "green",
					PENDING: "orange",
					IN_TRANSIT: "yellow",
					REJECTED: "red",
				};
				return <Tag color={colorMap[text]}>{text}</Tag>;
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
	return (
		<Table
			// dataSource={data}
			style={{ backgroundColor: "#f4f4f4", borderRadius: "10px" }}
			columns={columns}
		></Table>
	);
};

export default TableComponent;
