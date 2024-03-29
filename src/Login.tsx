import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Input, Checkbox, Button, Row, Col } from "antd";
import Layout from "antd/es/layout/layout";
import React from "react";

const Login = () => {
	const onFinish = (values: any) => {
		console.log("Received values of form: ", values);
	};

	return (
		<>
			<Row>
				<Col className="w-0.5" span={50}>
					col-12
				</Col>
				<Col className="w-0.5" span={50}>
					col-12
				</Col>
			</Row>
			{/* <Layout style={{ backgroundColor: "#020617" }}>
    <div className="flex-container">
      <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <a href="">register now!</a>
      </Form.Item>
    </Form>
    </div>
    </Layout> */}
		</>
	);
};
export default Login;
