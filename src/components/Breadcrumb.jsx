import React from 'react'
import { getUser, isLoggedIn, logout, getUserType } from "../utils/auth"
import _ from 'lodash'

const Breadcrumb = () => {
    let loggedInUser = null;

    if (isLoggedIn()) {
        loggedInUser = getUser();
    }
    const plan = getUserType();

    return (
        <div className="dashboard_head">
            <div className="breadcm">
                <h4>Dashboard</h4>

                <ul className="breadcm_rigth">
                    {/*<li><a href="javascript:void(0)" className="free">{_.capitalize(plan)}</a></li>*/}
                    {plan && plan === 'free' &&
                        <li><a href="https://gum.co/WHvhf?wanted=true" target="_blank" data-gumroad-single-product="true" className="upgrade">UPGRADE</a></li>
                    }
                </ul>
            </div>

            <ul className="breadcm_rigth">
                <li><a href="javascript:void(0)" className="share">SHARE</a></li>
            </ul>
        </div>

    );
}

export default Breadcrumb;