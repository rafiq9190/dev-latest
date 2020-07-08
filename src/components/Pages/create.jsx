import React from "react"
import styled from "styled-components"
import Loader from 'react-loader-spinner'
import { Card } from 'react-bootstrap'
import { SideSheet, IconButton, toaster, Pane, Heading, Text, TextInputField, Button, Badge } from "evergreen-ui"

const ProjectCreate = ({ location }) => {

    const [loading, setLoading] = React.useState(true);
    const [isSideSheetShown, setIsSideSheetShown] = React.useState(false);
    const [selectedTemplate, setSelectedTemplate] = React.useState();

    React.useEffect(() => {

    })

    const selectTemplateToCreatePage = (template) => {
        setSelectedTemplate(template)
        setIsSideSheetShown(true);
    }

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
                                    <Button height={32} marginRight={16} iconBefore="applications" appearance="primary" intent="success" onClick={() => selectTemplateToCreatePage(item)}>
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
            <SideSheet
                isShown={isSideSheetShown}
                containerProps={{
                    display: 'flex',
                    flex: '1',
                    flexDirection: 'column',
                }}
                width={"300"}
                onCloseComplete={() => setIsSideSheetShown(false)}
            >
                <Pane display="flex" margin={10} flexDirection="column">
                    <Heading size={600} marginBottom={5}>{selectedTemplate && selectedTemplate.title}</Heading>

                    {/*<Pane>
                        <Button height={24} iconBefore="cloud-download" appearance="primary" intent="warning" onClick={() => {  }}>
                            UnPublish Now
                        </Button>
                        <Button height={24} marginLeft={15} iconBefore="link" appearance="primary" intent="success" onClick={() => { }}>
                            Public URL
                        </Button>
                    </Pane>*/}
                </Pane>

                <Pane display="flex" margin={10} padding={10} background="tealTint" borderRadius={3} elevation={4}>
                    <Pane display="flex" float="left" flexDirection="column">
                        <Heading size={500}>Step.1</Heading>
                        <Text>
                            Copy our airtable template base by clicking "Copy Template Base" button.<br />
                            It will open a new browser tab. Switch to the newly opend tab and <br />
                            click on "Copy base" (in the upper right corner) to copy it to your Airtable account.
                        </Text>
                        <Pane display="flex" marginTop={10}>
                            <Button appearance="primary">
                                Copy Template Base
                        </Button>
                            <IconButton icon="help" appearance="primary" intent="warning" />
                        </Pane>
                    </Pane>
                </Pane>

                <Pane display="flex" margin={10} padding={10} background="tealTint" borderRadius={3} elevation={4}>
                    <Pane display="flex" float="left" flexDirection="column">
                        <Heading size={500}>Step.2</Heading>
                        <TextInputField
                            label="Enter your Airtable API Key"
                            description=""
                            placeholder="Airtable API Key"
                            required
                        />
                    </Pane>
                </Pane>

                <Pane display="flex" margin={10} padding={10} background="tealTint" borderRadius={3} elevation={4}>
                    <Pane display="flex" float="left" flexDirection="column">
                        <Heading size={500}>Step.3</Heading>                        
                        <Pane display="flex" marginTop={10}>
                            <TextInputField
                                label="Enter your Airtable Base ID"
                                hint="Use help button to know from where to get your Airtable Base ID "
                                placeholder="Airtable Base ID"
                                required
                            />                            
                        </Pane>
                    </Pane>
                </Pane>

                <Pane display="flex" margin={10} padding={10} background="tealTint" borderRadius={3} elevation={4}>
                    <Pane display="flex" float="left" flexDirection="column">
                        <Heading size={500}>Step.4</Heading>
                        <TextInputField
                            label="Enter Page Title"
                            placeholder="Page Title"
                            required
                        />
                        <TextInputField
                            label="Your Page Slug"
                            disabled
                            required
                        />
                    </Pane>
                </Pane>

                <Pane margin={10} padding={10}>
                    <Button appearance="primary" intent="success" onClick={() => { }}>
                        Create Page
                    </Button>
                </Pane>

            </SideSheet>
        </>
    )
}

export default ProjectCreate
