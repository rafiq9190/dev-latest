import React from "react"
import { CornerDialog, IconButton, toaster, Pane, Heading, Text, TextInputField, Button } from "evergreen-ui"
import _ from 'lodash'
import { Form } from 'react-bootstrap'
import { getUser, getUserExtras, getUserType } from "../../utils/auth"
import { refreshUserExtras } from "../../utils/firebaseHelpers"
import firebase from "gatsby-plugin-firebase"
import { navigate } from "gatsby"
import Loader from 'react-loader-spinner'

const PageCreate = ({ location }) => {
    const { state = {} } = location
    const { template } = state

    const user = getUser();
    const userExtras = getUserExtras();
    const plan = getUserType();

    const [validated, setValidated] = React.useState(false);
    const [processing, setProcessing] = React.useState(false);

    const [isStep1HelpShown, setIsStep1HelpShown] = React.useState(false);
    const [isStep3HelpShown, setIsStep3HelpShown] = React.useState(false);
    const [selectedTemplate, setSelectedTemplate] = React.useState(template);
    const [title, setTitle] = React.useState();
    const [slug, setSlug] = React.useState("");
    const [apiKey, setApiKey] = React.useState("");
    const [baseId, setBaseId] = React.useState("");
    const [tableName, setTableName] = React.useState(selectedTemplate.airtableDefaultTablename);
    const [viewName, setViewName] = React.useState(selectedTemplate.airtableDefaultViewname);

    React.useEffect(() => {

    })

    function handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);

        if (!selectedTemplate || !title || !slug || !apiKey || !baseId || !tableName || !viewName) {
            toaster.danger("Please enter details for all mandatory fields")
            return;
        }

        //check if the page with new slug already exists for this user
        if (userExtras && userExtras.projects && userExtras.projects[`${slug}`]) {
            toaster.danger("Page with this slug '" + slug + "' already exists")
            return;
        }

        if (form.checkValidity()) {
            setProcessing(true);

            const newPage = {
                selectedTemplate: selectedTemplate.id,
                title,
                slug,
                apiKey,
                baseId,
                tableName,
                viewName
            };

            console.log("*********** createpage")
            console.log(newPage)
            console.log(`users/${user.uid}/projects/${slug}`)
            firebase
                .database()
                .ref()
                .child(`users/${user.uid}/projects/${slug}`)
                .set(newPage)
                .then(() => { refreshUserExtras(user); })
                .then(() => { toaster.success('Page creted successfully. You will be redirected to Dashboard in 5 seconds') })
                .then(() => { setTimeout(function () { setProcessing(false); navigate(`/dashboard/`, { replace: true }) }, 5000); })
        }

    }

    return (
        <>
            <div className="container m-2">
                <div className="row">
                    <div className="col mb-3">
                        <Pane display="flex" margin={10} flexDirection="column">
                            <Heading size={600} marginBottom={5}>Selected Template : {selectedTemplate && selectedTemplate.name}</Heading>
                        </Pane>

                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
                                            <Button appearance="primary" iconAfter="share" marginTop={10} onClick={() => { window.open(selectedTemplate.airtableBaseCopy, '_blank') }}>
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
                                        value={apiKey}
                                        onChange={({ target: { value } }) => {
                                            setApiKey(value);
                                        }}
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
                                                value={baseId}
                                                required
                                                onChange={({ target: { value } }) => {
                                                    setBaseId(value);
                                                }}
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
                                            value={title}
                                            marginRight={10}
                                            onChange={({ target: { value } }) => {
                                                setTitle(value);
                                                setSlug(_.kebabCase(value));
                                            }}
                                        />
                                        <TextInputField
                                            label="Your Page Slug"
                                            hint="This text would be appended to the resultant page url"
                                            disabled
                                            width="100%"
                                            value={slug}
                                        />
                                    </Pane>
                                </Pane>
                            </Pane>

                            <Pane marginLeft={10}>
                                <button type="submit" className="btn btn-info btn-sm mt-3">
                                    Create Page
                                    {processing && <Loader type="Bars" color="#FFF" className="d-inline" height={16} width={24} />}
                                </button>
                            </Pane>
                        </Form>
                    </div>
                </div>
            </div>
            <CornerDialog
                isShown={isStep1HelpShown}
                title="Step.1 - Help"
                confirmLabel="Ok"
                width="50%"
                onCloseComplete={() => setIsStep1HelpShown(false)}
            >
                <Pane display="flex" flexDirection='column' margin={10} padding={10} background="tealTint" borderRadius={3} elevation={4}>
                    <Heading>
                        Clicking "Copy Template Base" will open a new browser tab.
                        Switch to the newly opend tab and click on "Copy base" (in the upper right corner) to copy it to your Airtable account.
                    </Heading>
                </Pane>
                <Pane display="flex" flexDirection='column' margin={10} padding={10} background="tealTint" borderRadius={3} elevation={4}>
                    <img src="/images/copy-base-example.png" width="100%" />
                </Pane>
            </CornerDialog>
            <CornerDialog
                isShown={isStep3HelpShown}
                title="Step.3 - Help"
                confirmLabel="Ok"
                width="40%"
                onCloseComplete={() => setIsStep3HelpShown(false)}
            >
                <Pane display="flex" flexDirection='column' margin={10} padding={10} background="tealTint" borderRadius={3} elevation={4}>
                    <Heading marginBottom={10}>
                        To find your Airtable Base ID, go to <a href="https://airtable.com/api/">https://airtable.com/api/</a>. Then Click on your base and copy the ID from the URL.
                    </Heading>
                </Pane>
                <Pane display="flex" flexDirection='column' margin={10} padding={10} background="tealTint" borderRadius={3} elevation={4}>
                    <img src="/images/get-baseid-example.png" width="100%" />
                </Pane>
            </CornerDialog>
        </>
    )
}

export default PageCreate
