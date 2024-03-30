import {
	CloseCircleFilled,
	CloseCircleOutlined,
	UserOutlined,
	WarningFilled,
	WarningOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Input, Layout, Modal, Row, Spin } from "antd";
import { Header, Content } from "antd/es/layout/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { CgCloseO } from "react-icons/cg";
import { MdOutlineAddTask } from "react-icons/md";

const Profile = () => {
	const [fraud, setFraud] = useState({ fraudMonth: "", number: 0 }); //state for API data --> month and number of FRAUD transactions
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);

	// API call for Fraud Transactions
	useEffect(() => {
		const fraudTransactions = async () => {
			const result = await axios("http://localhost:8080/fraud/transaction");

			// Get the month from the createdDate of the first object
			const date = new Date(result.data[0]?.createdDate);
			const fraudMonth = date.toLocaleString("default", { month: "long" });

			// Get the number of objects
			const number = result.data.length;

			setFraud({ fraudMonth, number });
			setLoading(false);
		};

		fraudTransactions();
	}, []); // Empty dependency array means this effect runs once on mount

	return (
		<>
			<Layout style={{ backgroundColor: "#020617" }}>
				{/* Header */}
				<Header style={{ padding: 0, background: "#020617" }} />
				<h1 className="Heading">My Profile</h1>

				<Content className="margin-container">
					<div className="flex-container card-container-profile">
						<Avatar
							size={256}
							icon={<UserOutlined className="Avatar" />}
							style={{ marginLeft: "40px", marginTop: "70px" }} // Center the Avatar vertically
						/>

						<div
							className="flex-item"
							style={{ marginLeft: "100px", marginTop: "100px" }}
						>
							{/* Center the div horizontally and vertically */}
							<div
								className="mt-2"
								style={{
									marginTop: "0px",
									fontSize: "50px",
									fontWeight: "600",
								}}
							>
								Andrew Garfield
							</div>
							<div
								className="mt-2"
								style={{ marginTop: "10px", fontWeight: "200" }}
							>
								andrewg@fraudvista.com
							</div>
							<div className="mt-2" style={{ marginTop: "10px" }}>
								Fraud Analyst
							</div>
							<Button
								type="primary"
								htmlType="submit"
								className="login-form-button w-24 mt-2"
								style={{
									marginTop: "30px",
									height: "40px",
									fontSize: "18px",
									fontWeight: "600",
								}}
								onClick={() => setOpen(true)}
							>
								Reset password
							</Button>

							<Modal
								title="Want to reset your Password?"
								centered
								open={open}
								onOk={() => setOpen(false)}
								onCancel={() => setOpen(false)}
								width={700}
								style={{ color: "white" }}
								className="custom-modal"
							>
								<Row gutter={16}>
									<Col span={12}>
										{loading && <Spin />}
										<img
											src="images/passwordReset.png"
											alt="Description"
											onLoad={() => setLoading(false)}
											style={{
												display: loading ? "none" : "block",
												width: "80%",
												marginTop: "20px",
											}}
										/>
									</Col>
									<Col span={12}>
										<div
											style={{
												marginTop: "40px",
												marginRight: "40px",
												marginLeft: "-10px",
											}}
										>
											<label style={{ marginTop: "40px" }}>
												Current Password
											</label>
											<Input.Password
												placeholder="input password"
												style={{ marginBottom: "10px" }}
											/>
											<label style={{ marginTop: "40px" }}>New Password</label>
											<Input.Password
												placeholder="input password"
												style={{ marginBottom: "10px" }}
											/>
											<label className="mt-8" style={{ marginTop: "20px" }}>
												Repeat Password
											</label>
											<Input.Password placeholder="re-enter password" />
										</div>
									</Col>
								</Row>
							</Modal>
						</div>
					</div>
				</Content>
				<Content className="margin-container">
					<div className="flex-container">
						<div className="flex-item">
							<div className="card-container">
								Activity
								<div
									className="mt-9 size-2 h-4"
									style={{
										color: "#d9dadb",
										fontSize: "28px",
										paddingTop: "50px",
										paddingLeft: "60px",
										fontWeight: "200",
									}}
								>
									<div>
										<CgCloseO
											style={{
												marginTop: "5px",
												paddingTop: "5px",
												scale: "1.5",
												marginRight: "10px",
											}}
										/>{" "}
										Flagged as fraud! Transaction ID: 123456{" "}
									</div>
									<div style={{ paddingTop: "20px" }}>
										<MdOutlineAddTask
											style={{
												marginTop: "5px",
												paddingTop: "5px",
												scale: "1.5",
												marginRight: "10px",
											}}
										/>{" "}
										Added a note Transaction ID: 3415
									</div>
									<div style={{ paddingTop: "20px" }}>
										<MdOutlineAddTask
											style={{
												marginTop: "5px",
												paddingTop: "5px",
												scale: "1.5",
												marginRight: "10px",
											}}
										/>{" "}
										Added a note Transaction ID: 16578
									</div>
								</div>
							</div>
						</div>
						<div className="card-container">
							<div
								style={{
									paddingTop: "10px",
								}}
							>
								Total No. of Flagged Transactions
							</div>
							<div
								className="large-text"
								style={{
									fontSize: "60px",
									color: "white",
									fontWeight: "normal",
									alignItems: "center",
									paddingTop: "40px",
									paddingLeft: "50px",
								}}
							>
								{fraud.fraudMonth}{" "}
							</div>
							<div
								style={{
									fontSize: "60px",
									color: "white",
									fontWeight: "normal",
									alignItems: "center",
									paddingTop: "10px",
									paddingLeft: "120px",
								}}
							>
								{fraud.number}
							</div>
						</div>
					</div>
				</Content>
			</Layout>
		</>
	);
};

export default Profile;
