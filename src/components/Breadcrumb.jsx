import React from 'react'

const Breadcrumb = () => {
    return (
        <div className="dashboard_head">
            <div className="breadcm">
                <h4>Dashboard</h4>

                <ul className="breadcm_rigth">
                    <li><a href="javascript:void(0)" className="free">Free</a></li>
                    <li><a href="javascript:void(0)" className="upgrade">UPGRADE</a></li>
                </ul>
            </div>

            <ul className="breadcm_rigth">
                <li><a href="javascript:void(0)" className="user"><i className="fa fa-user"></i></a></li>
                <li><a href="javascript:void(0)" className="share">SHARE</a></li>
            </ul>
        </div>

    );
}

export default Breadcrumb;