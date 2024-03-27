import {
	DesktopOutlined,
	FileOutlined,
	PieChartOutlined,
	TeamOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Layout, MenuProps, theme, Menu, Breadcrumb, Switch } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	path?: string
): MenuItem {
	return {
		key,
		icon,
		children,
		label: path ? <Link to={path}>{label}</Link> : label,
	} as MenuItem;
}

// SideNavbar Items
const items: MenuItem[] = [
	getItem("Dashboard", "1", <PieChartOutlined />),
	getItem("Transactions", "2", <DesktopOutlined />),
	getItem("Reports", "3", <UserOutlined />),
	getItem("Profile", "4", <TeamOutlined />),
	getItem("Logout", "9", <FileOutlined />),
];

// TopNavbar Items
const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
	key,
	label: `nav ${key}`,
}));

// Navbar Component
const Navbar: React.FC = () => {
	const [collapsed, setCollapsed] = useState(false); //   State Management--> Make Sidebar Collapsible
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();
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
		<Layout style={{ minHeight: "100vh", backgroundColor: "#000000" }}>
			{/* Header-TopNavbar */}
			<Header
				style={{
					display: "flex",
					flexDirection: "revert",
					alignItems: "flex-end",
					justifyContent: "flex-end",
					paddingLeft: "1590px",
				}}
			>
				<div className="demo-logo" />
				<div
					className="m-4"
					style={{
						color: "white",
						fontWeight: "600",
						fontSize: "15px",
						width: "150px",
						justifyContent: "center",
						borderRadius: "10px",
						paddingLeft: "5px",
					}}
				>
					<label className="m-2">ANDREW GARFIELD</label>
				</div>
				{/* <Menu
					theme="dark"
					mode="horizontal"
					defaultSelectedKeys={["2"]}
					items={items1}
					style={{ flex: 1, minWidth: 0 }}
				/> */}
			</Header>

			<Layout>
				{/* SideNavbar */}
				<Sider
					collapsible
					collapsed={collapsed}
					onCollapse={(value) => setCollapsed(value)}
				>
					<div className="demo-logo-vertical" />

					{/* User Image Icon */}
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							paddingTop: "4px",
							paddingBottom: "10px",
						}}
					>
						<img
							src="images/ProfIcon.png"
							alt="Profile"
							style={{ width: "120px", height: "120px" }}
						/>
					</div>

					{/* User Name */}
					<div
						style={{
							color: "white",
							justifyContent: "center",
							alignItems: "center",
							paddingLeft: "30px",
							fontSize: "20px",
						}}
					>
						<label className="">Andrew Garfield</label>
					</div>

					{/* User Role */}
					<div
						style={{
							color: "white",
							justifyContent: "center",
							alignItems: "center",
							paddingLeft: "60px",
							fontSize: "10px",
							paddingBottom: "40px",
						}}
					>
						<label className="">FRAUD ANALYST</label>
					</div>
					<div className="demo-logo-vertical" />
					<Menu
						theme="dark"
						defaultSelectedKeys={["1"]}
						mode="inline"
						items={items}
					/>
				</Sider>

				<Layout style={{ backgroundColor: "#ffffff" }}>
					{/* Header */}
					<Header style={{ padding: 0, background: colorBgContainer }} />

					{/* Content  for Real-Time Transactions*/}
					<Content style={{ margin: "0 16px", marginBottom: "20px" }}>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<div style={{ flex: 1, marginRight: "10px" }}>
								<div
									style={{
										padding: 24,
										minHeight: 360,
										fontSize: "20px",
										background: "#191c24",
										borderRadius: borderRadiusLG,
										color: "white",
										height: "740px",
										marginBottom: "20px",
									}}
								>
									Real-Time Transactions
								</div>
							</div>

							{/* Column Cards */}
							<div
								style={{ display: "-ms-grid", justifyContent: "space-evenly" }}
							>
								<div style={{ flex: 0.5, marginLeft: "10px" }}>
									<div
										style={{
											padding: 24,
											minHeight: 360,
											fontSize: "30px",
											background: "#191c24",
											borderRadius: borderRadiusLG,
											color: "white",
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											flexDirection: "column",
											paddingBottom: "80px",
											marginBottom: "20px",
										}}
									>
										Total No. of Transactions
										<div style={{ fontSize: "60px", paddingTop: "30px" }}>
											{data.month}:{" "}
										</div>
										<div style={{ fontSize: "60px" }}>{data.number}</div>
									</div>
								</div>
								<div style={{ flex: 0.5, marginLeft: "10px" }}>
									<div
										style={{
											padding: 24,
											minHeight: 360,
											fontSize: "22px",
											background: "#191c24",
											borderRadius: borderRadiusLG,
											color: "white",
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											flexDirection: "column",
											paddingBottom: "80px",
											marginBottom: "20px",
										}}
									>
										Total No. of Flagged Transactions
										<div style={{ fontSize: "60px", paddingTop: "30px" }}>
											{data.month}:{" "}
										</div>
										<div style={{ fontSize: "60px" }}>{data.number}</div>
									</div>
								</div>
							</div>
						</div>
					</Content>

					{/* Content for Transactions by Type */}
					<Content style={{ margin: "0 16px", marginBottom: "20px" }}>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<div style={{ flex: 1, marginRight: "10px" }}>
								<div
									style={{
										padding: 24,
										minHeight: 360,
										fontSize: "20px",
										background: "#191c24",
										borderRadius: borderRadiusLG,
										color: "white",
									}}
								>
									Transactions by Type
								</div>
							</div>
							<div style={{ flex: 0.5, marginLeft: "10px" }}>
								<div
									style={{
										padding: 24,
										minHeight: 360,
										fontSize: "20px",
										background: "#191c24",
										borderRadius: borderRadiusLG,
										color: "white",
									}}
								>
									Unusual Alerts Identified
								</div>
							</div>
						</div>
					</Content>

					{/* Content for Fraud Analytics */}
					<Content style={{ margin: "0 16px", marginBottom: "20px" }}>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<div style={{ flex: 1, marginRight: "10px" }}>
								<div
									style={{
										padding: 24,
										minHeight: 360,
										fontSize: "20px",
										background: "#191c24",
										borderRadius: borderRadiusLG,
										color: "white",
									}}
								>
									Fraud Analytics
								</div>
							</div>
							<div style={{ flex: 0.5, marginLeft: "10px" }}>
								<div
									style={{
										padding: 24,
										minHeight: 360,
										fontSize: "20px",
										background: "#191c24",
										borderRadius: borderRadiusLG,
										color: "white",
									}}
								>
									Alert Analytics
								</div>
							</div>
						</div>
					</Content>

					{/* <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
				</Layout>
			</Layout>
		</Layout>
	);
};

export default Navbar;
