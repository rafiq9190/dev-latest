import React from "react"
import { navigate } from "gatsby"
import styled from "styled-components"
import Loader from 'react-loader-spinner'
import { Card } from 'react-bootstrap'
import { SideSheet, IconButton, toaster, Pane, Heading, Text, TextInputField, Button, Badge } from "evergreen-ui"

const TemplateSelect = ({ location }) => {

    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {

    })

    const dummyData = [
        { title: "Template-1" },
        { title: "Template-2" },
        { title: "Template-3" },
        { title: "Template-4" },
        { title: "Template-5" },
        { title: "Template-6" },
        { title: "Template-7" },
        { title: "Template-8" },
        { title: "Template-9" },
        { title: "Template-10" },
        { title: "Template-11" }
    ];

    return (
        <>
            {loading &&
                <div className="text-center"><Loader type="Bars" color="#00BFFF" height={30} width={80} /></div>
            }
            <div className="container m-2">
                <div className="row">
                    {dummyData.map((item) => (
                        <div className="col-lg-4 mb-3">
                            <Card>
                                <Card.Img variant="top" src={`https://source.unsplash.com/180x180/?abstract,pattern,macro${item.title}`} />
                                <Card.Body>
                                    <Card.Title>{item.title}</Card.Title>
                                    <Button height={32} marginRight={16} iconBefore="applications" appearance="primary" intent="success" onClick={() => navigate("/dashboard/page/create",{state:{template:item}}) }>
                                        Select
                                    </Button>
                                    <Button height={32} iconAfter="share">
                                        Demo
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default TemplateSelect
