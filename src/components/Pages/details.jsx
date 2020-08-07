import React from "react"
import _ from 'lodash'
import { navigate } from "gatsby"
import { getUser, getUserExtras, getUserType } from "../../utils/auth"
import { refreshUserExtras } from "../../utils/firebaseHelpers"
import firebase from "gatsby-plugin-firebase"
import { Alert, IconButton, toaster, Pane, Heading, Text, TextInput, Button, Switch } from "evergreen-ui"
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
    const [usermgmtProcessing, setUsermgmtProcessing] = React.useState(false);
    const [usermgmtState, setUsermgmtState] = React.useState(pageDetails && pageDetails.usermanagement);
    const [accessmgmtProcessing, setAccessmgmtProcessing] = React.useState(false);
    const [accessmgmtState, setAccessmgmtState] = React.useState(pageDetails && pageDetails.accessmanagement);
    const [commentsmgmtProcessing, setCommentsmgmtProcessing] = React.useState(false);
    const [commentsmgmtState, setCommentsmgmtState] = React.useState(pageDetails && pageDetails.commentsmanagement);
    const [gaID, setGaID] = React.useState("");
    const [gaProcessing, setGaProcessing] = React.useState(false);

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

    const changeUserManagement = (slug, newstate) => {
        console.log("********** " + slug + ", " + newstate)
        toaster.closeAll()
        setUsermgmtProcessing(true)
        //Free plan restriction
        if (plan == "free") {
            toaster.danger(
                "User Management feature is NOT available on FREE plan. Please upgrade to use this feature", {
                id: 'forbidden-action'
            }
            )
            setUsermgmtProcessing(false);
            return;
        }

        firebase
            .database()
            .ref()
            .child(`users/${user.uid}/projects/${slug}/usermanagement`)
            .set(newstate)
            .then(() => { refreshUserExtras(user); })
            .then(() => { setUsermgmtProcessing(false) })
            .then(() => { toaster.success('User Management feature ' + (newstate ? 'activated' : 'deactivated') + ' successfully. You will be redirected to Dashboard in 5 seconds') })
            .then(() => { setTimeout(function () { navigate(`/dashboard/`, { replace: true }) }, 5000); })
    };

    const changeAccessManagement = (slug, newstate) => {
        console.log("********** " + slug + ", " + newstate)
        toaster.closeAll()
        setAccessmgmtProcessing(true)
        //Free plan restriction
        if (plan == "free") {
            toaster.danger(
                "Access Management feature is NOT available on FREE plan. Please upgrade to use this feature", {
                id: 'forbidden-action'
            }
            )
            setAccessmgmtProcessing(false);
            return;
        }

        firebase
            .database()
            .ref()
            .child(`users/${user.uid}/projects/${slug}/accessmanagement`)
            .set(newstate)
            .then(() => { refreshUserExtras(user); })
            .then(() => { setAccessmgmtProcessing(false) })
            .then(() => { toaster.success('Access Management feature ' + (newstate ? 'activated' : 'deactivated') + ' successfully. You will be redirected to Dashboard in 5 seconds') })
            .then(() => { setTimeout(function () { navigate(`/dashboard/`, { replace: true }) }, 5000); })
    };

    const changeCommentsManagement = (slug, newstate) => {
        console.log("********** " + slug + ", " + newstate)
        toaster.closeAll()
        setCommentsmgmtProcessing(true)
        //Free plan restriction
        if (plan == "free") {
            toaster.danger(
                "Comments Management feature is NOT available on FREE plan. Please upgrade to use this feature", {
                id: 'forbidden-action'
            }
            )
            setCommentsmgmtProcessing(false);
            return;
        }

        firebase
            .database()
            .ref()
            .child(`users/${user.uid}/projects/${slug}/commentsmanagement`)
            .set(newstate)
            .then(() => { refreshUserExtras(user); })
            .then(() => { setCommentsmgmtProcessing(false) })
            .then(() => { toaster.success('Comments Management feature ' + (newstate ? 'activated' : 'deactivated') + ' successfully. You will be redirected to Dashboard in 5 seconds') })
            .then(() => { setTimeout(function () { navigate(`/dashboard/`, { replace: true }) }, 5000); })
    };
    
    const updateTrackingInfo = (slug) => {
        console.log("********** " + slug)
        toaster.closeAll()
        setGaProcessing(true)
        //Free plan restriction
        if (plan == "free") {
            toaster.danger(
                "Google Analytics feature is NOT available on FREE plan. Please upgrade to use this feature", {
                id: 'forbidden-action'
            }
            )
            setGaProcessing(false);
            return;
        }
        if (gaID.length<=0) {
            toaster.danger("Please provide Google Analytics ID")
            setGaProcessing(false);
            return;
        }

        firebase
            .database()
            .ref()
            .child(`users/${user.uid}/projects/${slug}/googleAnalyticsId`)
            .set(gaID)
            .then(() => { refreshUserExtras(user); })
            .then(() => { setGaProcessing(false) })
            .then(() => { toaster.success('Google Analytics Information updated successfully. You will be redirected to Dashboard in 5 seconds') })
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
                        <Button height={20} marginBottom={10} iconBefore="arrow-left" appearance="minimal" onClick={() => navigate("/dashboard/")}>
                            Back to Dashboard
                        </Button>
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
                                <Text size={400}>{pageDetails && pageDetails.viewName}</Text>
                            </Pane>
                        </Pane>

                        {plan && plan != "free" &&
                            <Pane marginTop={20} marginLeft={10}>
                                <Text size={400}>Paid Features</Text>
                                <Pane display="flex" padding={10} background="tealTint" borderRadius={3} elevation={4}>
                                    <Pane display="flex" float="left" flexDirection="column">
                                        <Pane display="flex">
                                            <Switch margin={10}
                                                checked={usermgmtState}
                                                onChange={e => { setUsermgmtState(e.target.checked); changeUserManagement(pageDetails.slug, !pageDetails.usermanagement) }}
                                            />
                                            <Heading margin={8} size={500}>{`  `}Users</Heading>
                                            {usermgmtProcessing && <Pane marginTop={5}><Loader type="Bars" color="#3d8bd4" height={16} width={24} /></Pane>}
                                        </Pane>
                                        <Pane display="flex">
                                            <Switch margin={10}
                                                checked={accessmgmtState}
                                                onChange={e => { setAccessmgmtState(e.target.checked); changeAccessManagement(pageDetails.slug, !pageDetails.accessmanagement) }}
                                            />
                                            <Heading margin={8} size={500}>{`  `}Access</Heading>
                                            {accessmgmtProcessing && <Pane marginTop={5}><Loader type="Bars" color="#3d8bd4" height={16} width={24} /></Pane>}
                                        </Pane>
                                        <Pane display="flex">
                                            <Switch margin={10}
                                                checked={commentsmgmtState}
                                                onChange={e => { setCommentsmgmtState(e.target.checked); changeCommentsManagement(pageDetails.slug, !pageDetails.commentsmanagement) }}
                                            />
                                            <Heading margin={8} size={500}>{`  `}Comments</Heading>
                                            {commentsmgmtProcessing && <Pane marginTop={5}><Loader type="Bars" color="#3d8bd4" height={16} width={24} /></Pane>}
                                        </Pane>
                                    </Pane>
                                </Pane>
                            </Pane>
                        }

                        {plan && plan != "free" &&
                            <Pane marginTop={20} marginLeft={10}>
                                <Text size={400}>Google Analytics</Text>
                                <Pane display="flex" padding={20} background="tealTint" borderRadius={3} elevation={4}>
                                    <Pane display="flex" float="left" flexDirection="column">
                                        <Heading marginBottom={8} size={500}>Enter Google Universal Analytics Tracking ID</Heading>
                                        <TextInput
                                            name="gaid"
                                            placeholder="UA-XXXXXXX-XX"
                                            width="100%"
                                            onChange={e => { setGaID(e.target.value) }}
                                        />
                                        <Button marginTop={8} height={24} iconBefore="updated" appearance="primary" intent="primary" onClick={() => { updateTrackingInfo(pageDetails.slug) }}>
                                            Update Tracking Info
                                            {gaProcessing && <Loader type="Bars" color="#FFF" height={16} width={24} />}
                                        </Button>
                                    </Pane>
                                </Pane>
                            </Pane>
                        }

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
