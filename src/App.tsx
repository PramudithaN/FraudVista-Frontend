import React from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	useLocation,
} from "react-router-dom";
import Login from "./Login";
import "./custom-antd.less";
import { createFromIconfontCN } from "@ant-design/icons";

// Initialize icon font
const IconFont = createFromIconfontCN({
	scriptUrl: "//at.alicdn.com/t/font_1234567_xyz.js",
});

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/*" element={<Navbar />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
