import {
	CopyOutlined,
	DollarOutlined,
	LogoutOutlined,
	PieChartOutlined,
	TeamOutlined,
} from "@ant-design/icons";
import { Layout, MenuProps, theme, Menu } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import MyChart from "./MyChart";

const { Header, Content, Sider } = Layout;

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
	getItem("Transactions", "2", <DollarOutlined />),
	getItem("Reports", "3", <CopyOutlined />),
	getItem("Profile", "4", <TeamOutlined />),
	getItem("Logout", "9", <LogoutOutlined />),
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
			{/* Header-TopNavbar*/}
			<Header className="header-container">
				<div className="demo-logo" />
				<div className="label-container">
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
				{/* SideNavbar*/}
				<Sider
					collapsible
					collapsed={collapsed}
					onCollapse={(value) => setCollapsed(value)}
				>
					<div className="demo-logo-vertical" />

					{/* User Image Icon*/}
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
							style={{
								width: collapsed ? "60px" : "120px",
								height: collapsed ? "60px" : "120px",
								transition: "all 0.3s",
							}}
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
							display: collapsed ? "none" : "block",
						}}
					>
						<label className="">Andrew Garfield</label>
					</div>

					{/* User Role*/}
					<div
						style={{
							color: "white",
							justifyContent: "center",
							alignItems: "center",
							paddingLeft: "60px",
							fontSize: "10px",
							paddingBottom: "40px",
							display: collapsed ? "none" : "block",
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

				<Layout style={{ backgroundColor: "#020617" }}>
					{/* Header */}
					<Header style={{ padding: 0, background: "#020617" }} />

					{/* Content  for Real-Time Transactions*/}
					<Content className="margin-container">
						<div className="flex-container">
							<div className="flex-item">
								<div className="card-container-0">
									Real-Time Transactions
									{/* Js Charts*/}
									<div className="mt-9">
										<MyChart />
									</div>
								</div>
							</div>

							{/* Column Cards */}
							<div
								style={{ display: "-ms-grid", justifyContent: "space-evenly" }}
							>
								<div className="half-width">
									<div className="card-content">
										Total No. of Transactions
										<div className="large-text">{data.month}February </div>
										<div
											style={{
												fontSize: "60px",
												color: "white",
												fontWeight: "normal",
											}}
										>
											100{data.number}
										</div>
									</div>
								</div>
								<div className="half-width">
									<div className="card-content">
										Total No. of Flagged Transactions
										<div className="large-text">{data.month}February </div>
										<div
											style={{
												fontSize: "60px",
												color: "white",
												fontWeight: "normal",
											}}
										>
											2{data.number}
										</div>
									</div>
								</div>
							</div>
						</div>
					</Content>

					{/* Content for Transactions by Type */}
					<Content className="margin-container">
						<div className="flex-container">
							<div className="flex-item">
								<div className="card-container">Transactions by Type</div>
							</div>
							<div className="half-width">
								<div className="card-container">Unusual Alerts Identified</div>
							</div>
						</div>
					</Content>

					{/* Content for Fraud Analytics */}
					<Content className="margin-container">
						<div className="flex-container">
							<div className="flex-item">
								<div className="card-container">Fraud Analytics</div>
							</div>
							<div className="half-width">
								<div className="card-container">Alert Analytics</div>
							</div>
						</div>
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
};

export default Navbar;
