import React, { useState } from "react";
import { Button, Layout, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import {
	RadiusBottomrightOutlined,
	WarningFilled,
	WarningOutlined,
} from "@ant-design/icons";

const ModalPop: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();

	const handleOk = () => {
		navigate("/login");
	};

	const handleCancel = () => {
		navigate("/dashboard");
	};

	return (
		<>
			<Layout style={{ backgroundColor: "#020617" }}>
				<h2
					className="logoutText"
					style={{
						color: "white",
						flex: "justify-center",
						marginLeft: "700px",
						marginTop: "300px",
					}}
				>
					<WarningFilled /> Are you sure you want to logout?
				</h2>
				<Button
					type="primary"
					onClick={handleOk}
					style={{
						width: "30%",
						alignItems: "center",
						marginLeft: "600px",
						marginTop: "20px",
					}}
				>
					Yes
				</Button>
				<Button
					type="primary"
					onClick={handleCancel}
					style={{
						width: "30%",
						alignItems: "center",
						marginLeft: "600px",
						marginTop: "20px",
					}}
				>
					No
				</Button>
			</Layout>
		</>
	);
};

export default ModalPop;
