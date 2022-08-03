import React from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import { Card, Form } from "react-bootstrap"
import { BsSearch, BsPlus } from "react-icons/bs"
import { Link } from "gatsby"

function Modals(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Start with a Template
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container ">
          <div className="row  ">
            <div className="home-left col-lg-2 col-md-12 col-sm-12">
              <div className="case-body-select">
                <h6 style={{ marginTop: "10px" }}>USE CASES</h6>
                <ul>
                  <li>All (38)</li>
                  <li>Client Portals (7)</li>
                  <li>Internal Tools (7)</li>
                  <li>Dashboard (1)</li>
                  <li>Marketplaces (4)</li>
                  <li>Online Communities (3)</li>
                  <li>Resource Directories (9)</li>
                  <li>Websites (12)</li>
                </ul>
              </div>
              <div className="case-select">
                <Form.Select aria-label="Default select example">
                  <option>USE CASES</option>
                  <option value="1">All (38)</option>
                  <option value="2">Client Portals (7)</option>
                  <option value="3">Internal Tools (7)</option>
                  <option value="4">Dashboard (1)</option>
                  <option value="5">Marketplaces (4)</option>
                  <option value="6">Online Communities (3)</option>
                  <option value="7">Resource Directories (9)</option>
                  <option value="7">Websites (12)</option>
                </Form.Select>
              </div>
              <div className="request-link">
                <Link to="#" style={{ color: "#6f87d5", fontSize: "16px" }}>
                  Request new template
                </Link>
              </div>
            </div>
            <div className="home-right col-lg-10 ">
              <Form className="d-flex ">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2 bg-light"
                  aria-label="Search"
                />
                <div className="search-icon">
                  <BsSearch />
                </div>
              </Form>
              <div className="row mt-5">
                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="card ">
                    <button>
                      <BsPlus />
                    </button>
                    <div style={{ fontWeight: 500 }}>create new app</div>
                    <div>Click to start a project from scratch</div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                  {" "}
                  <div className="card-template">
                    <div className="card-template-body">
                      <div className="template-body-buttons">
                        <button className="btn-primary">Use Template</button>
                        <button className="sw-btn">Preview</button>
                      </div>
                    </div>
                    <div className="template-bottom">
                      <div
                        // className="mb-3 "
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginBottom: "2px",
                        }}
                      >
                        Employee Directory
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeigh: 500,
                        }}
                      >
                        View and manage all your company ...
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                  {" "}
                  <div className="card-template">
                    <div className="card-template-body">
                      <div className="template-body-buttons">
                        <button className="btn-primary">Use Template</button>
                        <button className="sw-btn">Preview</button>
                      </div>
                    </div>
                    <div className="template-bottom">
                      <div
                        // className="mb-3 "
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginBottom: "2px",
                        }}
                      >
                        Employee Directory
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeigh: 500,
                        }}
                      >
                        View and manage all your company ...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default Modals
