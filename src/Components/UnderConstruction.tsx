import { Layout } from "antd";
import React from "react";

const UnderConstruction = () => {
    return (
        <Layout style={{ backgroundColor: "#020617" }}>
        <div className="uc-container">
            <div className="uc-content">
                <p className="custom-text text-white">404 error</p>
                <h1 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
                    We're hard at work building an amazing website for you!
                </h1>
                <p className="custom-text">
                    Sorry, the page you are looking for is under construction
                </p>
                <div className="btn-container mt-6 flex items-center gap-x-3">
                    <button
                        type="button"
                        // onClick={() => goback()}
                        className="btn-go-back"
                    >
                        Go back
                    </button>
                    <button
                        type="button"
                        // onClick={() => contact()}
                        className="btn-contact"
                    >
                        Contact us
                    </button>
                </div>
            </div>
            <div className="hidden lg:block">
                <img src="images/UC.png" alt="404" className="underConstruction" />
            </div>
        </div>
        </Layout>
    );
};

export default UnderConstruction;
