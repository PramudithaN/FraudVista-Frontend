import {
	CopyOutlined,
	DollarOutlined,
	PieChartOutlined,
	TeamOutlined,
} from "@ant-design/icons";
import { Layout, MenuProps, theme, Menu } from "antd";
import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import SubMenu from "antd/es/menu/SubMenu";
import Dashboard from "../Dashboard";
import Profile from "../Profile";
import UnderConstruction from "./UnderConstruction";
import Transactions from "../Transactions";
import ModalPop from "../Modal";

const { Header, Content, Sider } = Layout;

// type MenuItem = Required<MenuProps>["items"][number];

type MenuItem = {
	label: React.ReactNode;
	key: React.Key;
	icon: React.ReactNode;
	path?: string;
	children?: MenuItem[];
	type?: "group";
};

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon: React.ReactNode,
	path?: string,
	children?: MenuItem[],
	type?: "group"
): MenuItem {
	return {
		label,
		key,
		icon,
		path,
		children,
		type,
	};
}

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
	// SideNavbar Items
	const items: MenuItem[] = [
		getItem("Dashboard", "1", <PieChartOutlined />, "/dashboard"),
		getItem("Transactions", "2", <DollarOutlined />, "/transactions"),
		getItem("Reports", "3", <CopyOutlined />, "/reports"),
		getItem("Profile", "4", <TeamOutlined />, "/profile"),
		// getItem("Logout", "9", <LogoutOutlined />, "/logout"),
	];
	const [isModalOpen, setIsModalOpen] = useState(false);

	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			<Content className="bg-slate-950">
				<Layout style={{ minHeight: "100vh", backgroundColor: "#000000" }}>
					{/* Header-TopNavbar*/}
					<Header
						className="bg-slate-800 p-0 flex justify-between"
						style={{
							display: "flex",
							justifyContent: "flex-end",
							alignItems: "flex-start",
							color: "white",
							fontWeight: "600",
							fontSize: "25px",
						}}
					>
						<Link to="/profile">Andrew Garfield</Link>
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
							{/* <Menu
						theme="dark"
						defaultSelectedKeys={["1"]}
						mode="inline"
						items={items}
					/> */}
							<Menu theme="dark" mode="inline">
								{items.map((item) => {
									if (item) {
										if (item.children) {
											return (
												<SubMenu
													key={item.key}
													icon={item.icon}
													title={item.label}
												>
													{item.children.map((subItem) => (
														<Menu.Item key={subItem.key}>
															<Link to={subItem.path!}>{subItem.label}</Link>
														</Menu.Item>
													))}
												</SubMenu>
											);
										} else {
											return (
												<Menu.Item key={item.key} icon={item.icon}>
													<Link to={item.path ?? "/"}>{item.label}</Link>
												</Menu.Item>
											);
										}
									}
								})}
							</Menu>
							<Link to="/" className="font-regular flex justify-around">
								<div
									style={{
										// position: "fixed",

										// height: "48px",
										// width: `${collapsed ? "80px" : "20%"}`,
										color: "#9e9e9e",
										lineHeight: "48px",
										fontWeight: 400,
										paddingTop: "20px",
										paddingLeft: "60px",
										cursor: "pointer",
									}}
								>
									<i className="fi fi-rr-sign-out-alt mr-3"></i>
									{!collapsed ? "Sign Out" : ""}
								</div>
							</Link>
						</Sider>

						<Routes>
							<Route path="dashboard" element={<Dashboard />} />
							<Route path="reports" element={<UnderConstruction />} />
							<Route path="profile" element={<Profile />} />
							<Route path="transactions" element={<Transactions />} />
							<Route path="logout" element={<ModalPop />} />
						</Routes>
					</Layout>
				</Layout>
			</Content>
		</>
	);
};

export default Navbar;
