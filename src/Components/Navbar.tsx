import {
	DesktopOutlined,
	FileOutlined,
	PieChartOutlined,
	TeamOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Layout, MenuProps, theme, Menu, Breadcrumb } from "antd";
import { useState } from "react";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[]
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
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

//   State Management--> Make Sidebar Collapsible
const Navbar: React.FC = () => {
	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	return (
		<Layout style={{ minHeight: "100vh" }}>
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
                <div className="m-4" style={{color:'white',fontWeight:'600',fontSize:'15px',  width:'150px',justifyContent:'center',borderRadius:'10px',paddingLeft:'5px'}}>
                <label className="m-2"
                // style={{color:'white',fontWeight:'600',fontSize:'15px', backgroundColor:'#616161', width:'150px',height:'100px',justifyContent:'center',borderRadius:'10px',paddingLeft:'5px'}}
                >
                    ANDREW GARFIELD
                </label>
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
				<Sider
					collapsible
					collapsed={collapsed}
					onCollapse={(value) => setCollapsed(value)}
				>
					<div className="demo-logo-vertical" />
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
					<div style={{color:'white',justifyContent: "center",
							alignItems: "center",paddingLeft:'30px' ,fontSize:'20px'}}>
						<label className="">Andrew Garfield</label>
					</div>
                    <div  style={{color:'white',justifyContent: "center",
							alignItems: "center",paddingLeft:'60px' ,fontSize:'10px',paddingBottom:'40px'}}>
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
				<Layout>
					<Header style={{ padding: 0, background: colorBgContainer }} />
					<Content style={{ margin: "0 16px" }}>
						<Breadcrumb style={{ margin: "16px 0" }}>
							<Breadcrumb.Item>User</Breadcrumb.Item>
							<Breadcrumb.Item>Bill</Breadcrumb.Item>
						</Breadcrumb>
						<div
							style={{
								padding: 24,
								minHeight: 360,
								background: "#1f1f1f",
								borderRadius: borderRadiusLG,
							}}
						>
							Bill is a cat.
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
