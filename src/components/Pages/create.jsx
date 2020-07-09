import React from "react"
import { CornerDialog, IconButton, toaster, Pane, Heading, Text, TextInputField, Button } from "evergreen-ui"

const ProjectCreate = ({ location }) => {
    const { state = {} } = location
    const { template } = state

    const [isStep1HelpShown, setIsStep1HelpShown] = React.useState(false);
    const [isStep3HelpShown, setIsStep3HelpShown] = React.useState(false);
    const [selectedTemplate, setSelectedTemplate] = React.useState(template);

    React.useEffect(() => {

    })

    return (
        <>
            <div className="container m-2">
                <div className="row">
                    <div className="col mb-3">
                        <Pane display="flex" margin={10} flexDirection="column">
                            <Heading size={600} marginBottom={5}>Selected Template : {selectedTemplate && selectedTemplate.name}</Heading>
                        </Pane>

                        <Pane display="flex" margin={10} padding={10} background="tealTint" borderRadius={3} elevation={4}>
                            <Pane display="flex">
                                <Pane display="flex" float="left" flexDirection="column">
                                    <Heading size={500}>Step.1</Heading>
                                    <Text>
                                        Copy our airtable template base by clicking "Copy Template Base" button.
                                        It will open a new browser tab. Switch to the newly opend tab and
                                        click on "Copy base" (in the upper right corner) to copy it to your Airtable account.
                                </Text>
                                    <Pane display="flex">
                                        <Button appearance="primary" iconAfter="share" marginTop={10}>
                                            Copy Template Base
                                    </Button>
                                    </Pane>
                                </Pane>
                                <IconButton height={40} marginLeft={5} icon="help" title="Click to see more details" appearance="minimal" onClick={() => setIsStep1HelpShown(true)} />
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
                            <Pane display="flex">
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
                                <IconButton height={40} marginLeft={5} icon="help" title="Click to see more details" appearance="minimal" onClick={() => setIsStep3HelpShown(true)} />
                            </Pane>
                        </Pane>

                        <Pane display="flex" margin={10} padding={10} background="tealTint" borderRadius={3} elevation={4}>
                            <Pane display="flex" float="left" flexDirection="column">
                                <Heading size={500}>Step.4</Heading>
                                <Pane display="flex">
                                    <TextInputField
                                        label="Enter Page Title"
                                        placeholder="Page Title"
                                        hint="This title will be shown on the top of your page"
                                        required
                                        width="100%"
                                        marginRight={10}
                                    />
                                    <TextInputField
                                        label="Your Page Slug"
                                        hint="This text would be appended to the resultant page url"
                                        disabled
                                        width="100%"
                                    />
                                </Pane>
                            </Pane>
                        </Pane>

                        <Pane marginLeft={10}>
                            <Button appearance="primary" intent="success" onClick={() => { }}>
                                Create Page
                            </Button>
                        </Pane>
                    </div>
                </div>
            </div>
            <CornerDialog
                isShown={isStep1HelpShown}
                title="Step.1 - Help"
                confirmLabel="Ok"
                onCloseComplete={() => setIsStep1HelpShown(false)}
            >
                <Pane display="flex" flexDirection='column' margin={10} padding={10} background="tealTint" borderRadius={3} elevation={4}>
                    <Text marginBottom={10}>
                        Clicking "Copy Template Base" will open a new browser tab.
                        Switch to the newly opend tab and click on "Copy base" (in the upper right corner) to copy it to your Airtable account.
                    </Text>
                    <img src="/images/copy-base-example.png" width="100%" />
                </Pane>
            </CornerDialog>
            <CornerDialog
                isShown={isStep3HelpShown}
                title="Step.3 - Help"
                confirmLabel="Ok"
                onCloseComplete={() => setIsStep3HelpShown(false)}
            >
                <Pane display="flex" flexDirection='column' margin={10} padding={10} background="tealTint" borderRadius={3} elevation={4}>
                    <Heading marginBottom={10}>
                        To find your Airtable Base ID, go to https://airtable.com/api/. Then Click on your base and copy the ID from the URL.
                    </Heading>
                    <img src="/images/get-baseid-example.png" width="100%" />
                </Pane>
            </CornerDialog>
        </>
    )
}

export default ProjectCreate
