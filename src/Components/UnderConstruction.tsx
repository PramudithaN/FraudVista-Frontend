import { Layout, Spin } from "antd";
import React, { useState } from "react";

const UnderConstruction = () => {
	const [loading, setLoading] = useState(true);

	//Function to go back to the previous page
	const goback = () => {
		window.history.back();
	};

	return (
		<Layout style={{ backgroundColor: "#020617" }}>
			<div className="uc-container">
				<div className="uc-content">
					<p className="custom-text text-white">404 error</p>
					<h1
						className="mt-3 text-2xl font-semibold text-white md:text-3xl"
						style={{ color: "white" }}
					>
						We're hard at work building an amazing website for you!
					</h1>
					<p className="custom-text">
						Sorry, the page you are looking for is under construction
					</p>
					<div className="btn-container mt-6 flex items-center gap-x-3">
						<button
							type="button"
							onClick={() => goback()}
							className="btn-go-back"
							style={{ backgroundColor: "#FFD700" }}
						>
							Go back
						</button>
					</div>
				</div>
				<div className="hidden lg:block">
					{/* Add a loading spinner until the image is loaded */}
					{loading && <Spin />}
					<img
						src="images/UC.png"
						alt="404"
						className="underConstruction"
						onLoad={() => setLoading(false)}
						style={{ display: loading ? "none" : "block" }}
					/>
				</div>
			</div>
		</Layout>
	);
};

export default UnderConstruction;
