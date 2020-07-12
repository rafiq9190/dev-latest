import React from "react"
import _ from 'lodash'
import { navigate } from "gatsby"
import { getUser, getUserExtras, getUserType } from "../../utils/auth"
import { refreshUserExtras } from "../../utils/firebaseHelpers"
import firebase from "gatsby-plugin-firebase"
import { Alert, IconButton, toaster, Pane, Heading, Text, Button, Pill } from "evergreen-ui"
import Loader from 'react-loader-spinner'

const PageDetails = ({ location }) => {
    const { state = {} } = location
    const { pageDetails } = state

    const user = getUser();
    let userExtras = getUserExtras();
    const plan = getUserType();
    const publicdomain = userExtras.custom_domain ? ("http://" + userExtras.custom_domain) : "https://sites.hyperlyst.com"

    const publishedCount = (userExtras && userExtras.projects) ? _.filter(userExtras.projects, { published: true }).length : 0;
    const MaxProjectsInFreePlan = 1;

    const [isDetailsShown, setIsDetailsShown] = React.useState(false);
    const [publishProcessing, setPublishProcessing] = React.useState(false);

    const changePagePublishState = (slug, newstate) => {
        console.log("********** " + slug)
        console.log("********** " + newstate)
        toaster.closeAll()
        setPublishProcessing(true)
        if (newstate) {
            //Free plan restriction
            if (plan == "free" && publishedCount >= MaxProjectsInFreePlan) {
                toaster.danger(
                    "Only '" + MaxProjectsInFreePlan + "' pages are allowed to be published in FREE plan", {
                        id: 'forbidden-action',
                        duration: 10
                    }
                )
                return;
            }
        }

        firebase
            .database()
            .ref()
            .child(`users/${user.uid}/projects/${slug}/published`)
            .set(newstate)
            .then(() => { refreshUserExtras(user); })
            .then(() => { setPublishProcessing(false) })
            .then(() => { toaster.success('Page ' + (newstate ? '' : 'un') + 'published successfully. You will be redirected to Dashboard in 5 seconds') })
            .then(() => { setTimeout(function () { navigate(`/dashboard/`, { replace: true }) }, 5000); })
    };

    const deleteProject = (slug) => {
        console.log("*********** deleteProject")
        console.log(`users/${user.uid}/projects/${slug}`)
        firebase
            .database()
            .ref()
            .child(`users/${user.uid}/projects/${slug}`)
            .remove()
            .then(() => { refreshUserExtras(user); })
            .then(() => { setIsDetailsShown(false); })
            .then(() => { toaster.success('Deletion successfully. You will be redirected to Dashboard in 5 seconds') })
            .then(() => { setTimeout(function () { navigate(`/dashboard/`, { replace: true }) }, 5000); })
    };

    return (
        <>
            <div className="container m-2">
                <div className="row">
                    <div className="col">
                        <Pane display="flex" margin={10} flexDirection="column">
                            <Heading size={600} marginBottom={5}>{pageDetails && pageDetails.title}</Heading>
                            <Pane>
                                {pageDetails && pageDetails.published &&
                                    <>
                                        <Alert
                                            intent="success"
                                            title="This page is Published"
                                        />
                                        <Button height={24} iconBefore="cloud-download" appearance="primary" intent="warning" onClick={() => { changePagePublishState(pageDetails.slug, false) }}>
                                            UnPublish Now
                                    {publishProcessing && <Loader type="Bars" color="#FFF" height={16} width={24} />}
                                        </Button>
                                    </>
                                }
                                {pageDetails && !pageDetails.published &&
                                    <>
                                        <Alert
                                            intent="warning"
                                            title="This page is NOT Published"
                                        />
                                        <Button height={24} iconBefore="cloud-upload" appearance="primary" intent="primary" onClick={() => { changePagePublishState(pageDetails.slug, true) }}>
                                            Publish Now
                                    {publishProcessing && <Loader type="Bars" color="#FFF" height={16} width={24} />}
                                        </Button>
                                    </>
                                }
                                <Button height={24} marginLeft={15} iconBefore="link" appearance="primary" intent="success" onClick={() => { window.open(`${publicdomain}/public/${user.uid}/project/${pageDetails.slug}`, '_blank') }}>
                                    Public URL
                        </Button>
                            </Pane>
                        </Pane>

                        <Pane display="flex" marginLeft={10} marginRight={10} padding={10} background="tealTint" borderRadius={3} elevation={4}>
                            <Pane display="flex" float="left" flexDirection="column">
                                <Heading size={500}>Project Template Code</Heading>
                                <Text size={400} marginBottom={10}>{pageDetails && pageDetails.selectedTemplate}</Text>
                                <Heading size={500}>Airtable API Key</Heading>
                                <Text size={400} marginBottom={10}>{pageDetails && pageDetails.apiKey}</Text>
                                <Heading size={500}>Airtable Base ID</Heading>
                                <Text size={400} marginBottom={10}>{pageDetails && pageDetails.baseId}</Text>
                                <Heading size={500}>Airtable Table Name</Heading>
                                <Text size={400} marginBottom={10}>{pageDetails && pageDetails.tableName}</Text>
                                <Heading size={500}>Airtable View Name</Heading>
                                <Text size={300}>{pageDetails && pageDetails.viewName}</Text>
                            </Pane>
                        </Pane>

                        <Pane display="flex" margin={10}>
                            <IconButton icon="trash" appearance="primary" intent="danger" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteProject(pageDetails.slug) }}></IconButton>
                        </Pane>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PageDetails
