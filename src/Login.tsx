import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {
	Form,
	Input,
	Checkbox,
	Button,
	Row,
	Col,
	Spin,
	notification,
	NotificationArgsProps,
} from "antd";
import Layout from "antd/es/layout/layout";
import React, { useState } from "react";

type NotificationType = "success" | "info" | "warning" | "error";
type NotificationPlacement = NotificationArgsProps["placement"];

const Login = () => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(true);
	const [api, contextHolder] = notification.useNotification();

  // Function to display success notification
	const successNotification = (
		type: NotificationType,
		placement: NotificationPlacement
	) => {
		api[type]({
			message: "Success",
			placement: placement,
			description: "Login Successful.",
		});
	};

  // Function to display error notification
	const errorNotification = (
		type: NotificationType,
		placement: NotificationPlacement
	) => {
		api[type]({
			message: "Login Error",
			placement: placement,
			description: "Login Failed! Invalid email or password.",
		});
	};

  // Function to handle form submission
	const onFinish = (values: any) => {
		// Hardcoded email and password
		const email = "shiku@gmail.com";
		const password = "shikus";
		console.log("Received values of form: ", form.getFieldsValue());

		// Check if the entered email and password match the hardcoded values
		if (values.email === email && values.password === password) {
			console.log("Login successful");
			successNotification("success", "bottomRight");
			window.location.href = "/dashboard";
		} else {
			errorNotification("error", "bottomRight");
			console.log("Invalid email or password");
		}
	};

	return (
		<>
			{contextHolder}
			<Layout style={{ backgroundColor: "#020617", height: "100%" }}>
				<Row>
					{/* Image */}
					<Col
						span={9}
						style={{
							backgroundColor: "#191c24",
							height: "100vh",
							width: "700px",
						}}
					>
						{loading && (
							<Spin
								style={{
									justifyContent: "center",
									alignItems: "center",
									paddingLeft: "300px",
									paddingTop: "300px",
								}}
							/>
						)}
						<img
							src="images/FRDIMG.png"
							alt="FraudImg"
							onLoad={() => setLoading(false)}
							style={{
								display: loading ? "none" : "block",
								width: "720px",
								height: "650px",
							}}
						/>
					</Col>

					{/* Login Container */}
					<Col span={15}>
						<h1
							style={{
								color: "white",
								marginLeft: "430px",
								paddingTop: "230px",
								paddingBottom: "*10px",
								fontWeight: "500",
							}}
						>
							WELCOME TO FRAUDVISTA!
						</h1>
						<div
							className="flex-container"
							style={{
								marginTop: "30px",
								marginLeft: "240px",
								width: "700px",
								color: "white",
								marginRight: "400px",
							}}
						>
              {/* Form Fields */}
							<Form
								form={form}
								name="normal_login"
								className="login-form"
								initialValues={{ remember: true }}
								onFinish={onFinish}
								style={{
									backgroundColor: "#191c24",
									paddingTop: "50px",
									paddingBottom: "30px",
									borderRadius: "10px",
									width: "1200px",
								}}
							>
								<label style={{ color: "white", marginLeft: "200px" }}>
									Email Address
								</label>
								<Form.Item
									name="email"
									rules={[
										{ required: true, message: "Please input your Email!" },
										{
											type: "email",
											message: "The input is not valid E-mail!",
										},
									]}
									style={{ width: "300px", marginLeft: "200px" }}
								>
									<Input
										prefix={<UserOutlined className="site-form-item-icon" />}
										placeholder="Email"
									/>
								</Form.Item>
								<label style={{ color: "white", marginLeft: "200px" }}>
									Password
								</label>
								<Form.Item
									name="password"
									rules={[
										{ required: true, message: "Please input your Password!" },
									]}
									style={{ width: "300px", marginLeft: "200px" }}
								>
									<Input
										prefix={<LockOutlined className="site-form-item-icon" />}
										type="password"
										placeholder="Password"
									/>
								</Form.Item>

                {/* Login Button */}
								<Form.Item>
									<Button
										type="primary"
										htmlType="submit"
										className="login-form-button"
										style={{ width: "200px", marginLeft: "200px" }}
									>
										LogIn
									</Button>
								</Form.Item>
							</Form>
						</div>
					</Col>
				</Row>
			</Layout>
		</>
	);
};

export default Login;
