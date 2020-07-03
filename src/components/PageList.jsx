import React from "react"

const PageList = () => {
    return (
        <div className="row">
            <div className="col col5">
                <div className="dashboard_box text-center">
                    <a href="javascript:void(0)">
                        <img src="/images/icon-1.png" className="blue" />
                        <h3>Product planning</h3>
                    </a>
                </div>
            </div>

            <div className="col col5">
                <div className="dashboard_box text-center">
                    <a href="javascript:void(0)">
                        <img src="/images/icon-2.png" className="orange" />
                        <h3>Product launch</h3>
                    </a>
                </div>
            </div>

            <div className="col col5">
                <div className="dashboard_box text-center">
                    <a href="javascript:void(0)">
                        <img src="/images/icon-3.png" className="purple" />
                        <h3>User research</h3>
                    </a>
                </div>
            </div>

            <div className="col col5">
                <div className="dashboard_box text-center">
                    <a href="javascript:void(0)">
                        <img src="/images/icon-4.png" className="orange" />
                        <h3>Sales CRM</h3>
                    </a>
                </div>
            </div>

            <div className="col col5">
                <div className="dashboard_box text-center">
                    <a href="javascript:void(0)">
                        <img src="/images/icon-5.png" className="seagreen" />
                        <h3>Content calender</h3>
                    </a>
                </div>
            </div>

            <div className="col col5">
                <div className="dashboard_box text-center">
                    <a href="javascript:void(0)">
                        <img src="/images/icon-6.png" className="darkblue" />
                        <h3>Project Tracker</h3>
                    </a>
                </div>
            </div>

            <div className="col col5">
                <div className="dashboard_box text-center">
                    <a href="javascript:void(0)">
                        <img src="/images/icon-7.png" className="grey" />
                        <h3>Add a site</h3>
                    </a>
                </div>
            </div>

        </div>
    );
}

export default PageList;