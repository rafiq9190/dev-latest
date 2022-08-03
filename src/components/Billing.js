import React, { useState } from "react"

import { Dropdown } from "react-bootstrap"

import Layout from "../components/Layout"

function Billing() {
  return (
    <Layout>
      <div style={{ backgroundColor: "#f8f9fa" }}>
        <div className="user-billing">
          <h2 className="mb-4 mt-2">Billing</h2>
          <div className="billing-wrapper">
            <h4>Subscription</h4>
            <p>Free plan $0 (monthly)</p>
            <div className="tag-info">
              <div className="tag-description">
                Under this plan you can publish one application with limited
                functionality.
              </div>
            </div>
            <hr></hr>
            <div className="mb-4 mt-4">
              <h5 className="text-center mb-4 mt-2">
                Upgrade to any plan free for 30 days
              </h5>
              <div className="d-flex ">
                <div>
                  <ul style={{ listStyle: "none", padding: "0px" }}>
                    <li className="mr-1 mb-2">
                      <i className="sw-chart-icon"></i>
                      <span>Unlock chart blocks</span>
                    </li>
                    <li className="mr-1 mb-2">
                      <i className="sw-user-role"></i>
                      <span>Unlock-user-roles</span>
                    </li>
                    <li className="mr-1 mb-2">
                      <i className="sw-edit-record"></i>
                      <span>Edit-records</span>
                    </li>
                    <li className="mr-1 mb-2">
                      <i className="sw-field-permission"></i>
                      <span>Field level permissions</span>
                    </li>
                    <li className="mr-1 mb-2">
                      <i className="sw-circle-plus"></i>
                      <span>+ 6 more</span>
                    </li>
                  </ul>
                </div>
                <div className="image"></div>
              </div>
            </div>
            <div className="btn-wrapper">
              <button>Start free trail</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Billing
