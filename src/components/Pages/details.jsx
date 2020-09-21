import React from "react"
import { navigate } from "gatsby"
import { Tabs, Tab } from 'react-bootstrap';
import { Button } from "evergreen-ui"
import PageDetailsTabGeneral from "./details-tab-general"
import PageDetailsTabSettings from "./details-tab-settings"
import PageDetailsTabAccess from "./details-tab-access"
import PageDetailsTabLabels from "./details-tab-labels"
import PageDetailsTabPaid from "./details-tab-paid"
import PageDetailsTabDangerZone from "./details-tab-dangerzone"

const tabContent = {
    borderLeft: "1px solid #ddd",
    borderRight: "1px solid #ddd",
    borderBottom: "1px solid #ddd",
    borderRadius: "0px 0px 5px 5px",
    padding: "10px"
}

const PageDetails = ({ location }) => {
    const { state = {} } = location
    const { pageDetails } = state

    return (
        <div className="container m-2">
            <div className="row">
                <div className="col">
                    <Button height={20} marginBottom={10} iconBefore="arrow-left" appearance="minimal" onClick={() => navigate("/dashboard/")}>
                        Back to Dashboard
                    </Button>
                    <h5 className="mb-2">Manage all settings here for <span style={{fontSize: "small"}}>&quot;{pageDetails.title} ({pageDetails.slug})&quot;</span></h5>
                    <Tabs className="nav-fill px-2"
                        id="page-settings"
                        onSelect={(k) => console.log("**** Selected tab = " + k)}
                    >
                        <Tab eventKey="general" title="General" style={tabContent}>
                            <PageDetailsTabGeneral pageDetails={pageDetails} />
                        </Tab>
                        <Tab eventKey="settings" title="Settings" style={tabContent}>
                            <PageDetailsTabSettings pageDetails={pageDetails} />
                        </Tab>
                        <Tab eventKey="labels" title="Text Replacements" style={tabContent}>
                            <PageDetailsTabLabels pageDetails={pageDetails} />
                        </Tab>
                        <Tab eventKey="paid" title="Paid Features" style={tabContent}>
                            <PageDetailsTabPaid pageDetails={pageDetails} />
                        </Tab>
                        <Tab eventKey="access" title="Access" style={tabContent}>
                            <PageDetailsTabAccess pageDetails={pageDetails} />
                        </Tab>
                        <Tab eventKey="dangerzone" title="Danger Zone" style={tabContent}>
                            <PageDetailsTabDangerZone pageDetails={pageDetails} />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default PageDetails
