import React from "react"
import _ from 'lodash'
import { navigate } from "gatsby"
import SiteConfig from "../../config/site"
import { getUser, getUserExtras, getUserType } from "../../utils/auth"
import { refreshUserExtras } from "../../utils/firebaseHelpers"
import firebase from "gatsby-plugin-firebase"
import { Alert, toaster, Pane, Heading, Text, Button, Code } from "evergreen-ui"
import Loader from 'react-loader-spinner'

const PageDetailsTabGeneral = ({ pageDetails }) => {
    const user = getUser();
    let userExtras = getUserExtras();

    const plan = getUserType();
    const publicdomain = pageDetails.customDomain ? ("http://" + pageDetails.customDomain) : "https://sites.hyperlyst.com"
    const publishedCount = (userExtras && userExtras.projects) ? _.filter(userExtras.projects, { published: true }).length : 0;
    const MaxProjectsInFreePlan = 1;

    const [publishProcessing, setPublishProcessing] = React.useState(false);

    const changePagePublishState = (slug, newstate) => {
        console.log("********** " + slug)
        console.log("********** " + newstate)
        toaster.closeAll()
        setPublishProcessing(true)
        if (newstate) {
            //Free plan restriction
            if (plan == "free" && publishedCount >= SiteConfig.plan.free.maxSites) {
                toaster.danger("Only '" + SiteConfig.plan.free.maxSites + "' pages are allowed to be published in FREE plan")
                return;
            }
            //Pro plan restriction
            if (plan == "pro" && publishedCount >= SiteConfig.plan.pro.maxSites) {
                toaster.danger("Only '" + SiteConfig.plan.pro.maxSites + "' pages are allowed to be published in PRO plan")
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

    return (
        <>
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
                            <Button height={24} iconBefore="cloud-upload" appearance="primary" onClick={() => { changePagePublishState(pageDetails.slug, true) }}>
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

            <Pane display="flex" marginLeft={10} marginRight={10} padding={10} background="tint2" borderRadius={3} elevation={4}>
                <Pane display="flex" float="left" flexDirection="column">
                    <Heading size={500}>Page Template Code</Heading>
                    <Text size={400} marginBottom={10}>{pageDetails && pageDetails.selectedTemplate}</Text>
                    <Heading size={500}>Page Slug</Heading>
                    <Text size={400} marginBottom={10}>{pageDetails && pageDetails.slug}</Text>
                    <Heading size={500}>Page Data Source is</Heading>
                    <Text size={400} marginBottom={10}><Code>{pageDetails && pageDetails.googleSheetID ? "Google Sheet" : "Airtable"}</Code></Text>
                    
                    {pageDetails && pageDetails.apiKey &&
                        <>
                            <Heading size={500}>Airtable API Key</Heading>
                            <Text size={400} marginBottom={10}>{pageDetails.apiKey}</Text>
                        </>
                    }
                    {pageDetails && pageDetails.baseId &&
                        <>
                            <Heading size={500}>Airtable Base ID</Heading>
                            <Text size={400} marginBottom={10}>{pageDetails.baseId}</Text>
                        </>
                    }
                    {pageDetails && pageDetails.tableName &&
                        <>
                            <Heading size={500}>Airtable Table Name</Heading>
                            <Text size={400} marginBottom={10}>{pageDetails.tableName}</Text>
                        </>
                    }
                    {pageDetails && pageDetails.viewName &&
                        <>
                            <Heading size={500}>Airtable View Name</Heading>
                            <Text size={400} marginBottom={10}>{pageDetails.viewName}</Text>
                        </>
                    }
                    {pageDetails && pageDetails.googleSheetID &&
                        <>
                            <Heading size={500}>Google sheets ID</Heading>
                            <Text size={400} marginBottom={10}>{pageDetails.googleSheetID}</Text>
                        </>
                    }
                    {pageDetails && pageDetails.googleSheetsClientEmail &&
                        <>
                            <Heading size={500}>Google sheets client email</Heading>
                            <Text size={400} marginBottom={10}>{pageDetails.googleSheetClientEmail}</Text>
                        </>
                    }
                    {pageDetails && pageDetails.googleSheetPrivateKey &&
                        <>
                            <Heading size={500}>Google sheets private key</Heading>
                            <Text size={400} marginBottom={10}>{pageDetails.googleSheetPrivateKey}</Text>
                        </>
                    }
                </Pane>
            </Pane>
        </>
    )
}

export default PageDetailsTabGeneral;