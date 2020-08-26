import React from "react"
import _ from 'lodash'
import { navigate } from "gatsby"
import { Form, Tabs, Tab } from 'react-bootstrap';
import { getUser, getUserExtras, getUserType } from "../../utils/auth"
import { refreshUserExtras } from "../../utils/firebaseHelpers"
import firebase from "gatsby-plugin-firebase"
import { Alert, IconButton, toaster, Pane, Heading, Text, TextInputField, FilePicker, Button, Switch } from "evergreen-ui"
import Loader from 'react-loader-spinner'
import NetlifyAPI from 'netlify'
import SiteConfig from "../../config/site"

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
    const user = getUser();
    let userExtras = getUserExtras();
    const plan = getUserType();
    const publicdomain = pageDetails.customDomain ? ("http://" + pageDetails.customDomain) : "https://sites.hyperlyst.com"

    const publishedCount = (userExtras && userExtras.projects) ? _.filter(userExtras.projects, { published: true }).length : 0;
    const customDomainCount = (userExtras && userExtras.projects) ? _.filter(userExtras.projects, (project) => project.customDomain != null).length : 0;
    const MaxProjectsInFreePlan = 1;

    const [isDetailsShown, setIsDetailsShown] = React.useState(false);
    const [publishProcessing, setPublishProcessing] = React.useState(false);
    const [usermgmtProcessing, setUsermgmtProcessing] = React.useState(false);
    const [usermgmtState, setUsermgmtState] = React.useState(pageDetails && pageDetails.usermanagement);
    const [accessmgmtProcessing, setAccessmgmtProcessing] = React.useState(false);
    const [accessmgmtState, setAccessmgmtState] = React.useState(pageDetails && pageDetails.accessmanagement);
    const [commentsmgmtProcessing, setCommentsmgmtProcessing] = React.useState(false);
    const [commentsmgmtState, setCommentsmgmtState] = React.useState(pageDetails && pageDetails.commentsmanagement);
    const [gaID, setGaID] = React.useState(pageDetails.googleAnalyticsId);
    const [gaValidated, setGaValidated] = React.useState(false);
    const [gaProcessing, setGaProcessing] = React.useState(false);
    const [customDomainValidated, setCustomDomainValidated] = React.useState(false);
    const [customDomainProcessing, setCustomDomainProcessing] = React.useState(false);
    const [newCustomDomain, setNewCustomDomain] = React.useState(pageDetails.customDomain);
    const [netlifySite, setNetlifySite] = React.useState();
    const [existingDomains, setExistingDomains] = React.useState();

    React.useEffect(() => {
        console.log("**** useEffect")
        console.log("***** customDomainCount = " + customDomainCount)
        console.log(netlifySite)
        console.log(existingDomains)
        if (!netlifySite && !existingDomains) {
            initializeNetlifyData();
        }
    }, [netlifySite, existingDomains])

    async function initializeNetlifyData() {
        const client = new NetlifyAPI(process.env.GATSBY_NETLIFY_API_TOKEN)
        const sites = await client.listSites();
        sites.map((site) => {
            if (site.custom_domain === process.env.GATSBY_NETLIFY_SITE_DOMAIN) {
                setNetlifySite(site);
                setExistingDomains(site.domain_aliases);
            }
        });
    }

    async function addDomainToNetlifySite() {
        const client = new NetlifyAPI(process.env.GATSBY_NETLIFY_API_TOKEN)
        try {
            let updatedDomainAliases = existingDomains;
            updatedDomainAliases.push(newCustomDomain);
            await client.updateSite({
                site_id: netlifySite.site_id,
                body: {
                    "domain_aliases": updatedDomainAliases
                }
            })
            console.log("Domain successfully added to Netlify")
            //now save custom domain to firebase
            addDomainToFirebase()
        } catch (e) {
            console.error(e)
            toaster.danger('Error while adding Custom Domain to your site. Please try later.')
        }
    }

    function addDomainToFirebase() {
        firebase
            .database()
            .ref()
            .child(`users/${user.uid}/projects/${pageDetails.slug}/customDomain`)
            .set(newCustomDomain)
            .then(() => { refreshUserExtras(user); })
            .then(() => { setCustomDomainProcessing(false); })
            .then(() => { toaster.success('Custom Domain added successfully. You will be redirected to Dashboard in 5 seconds') })
            .then(() => { setTimeout(function () { navigate(`/dashboard/`, { replace: true }) }, 5000); })
    }

    const handleNewDomainSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        setCustomDomainValidated(true);
        if (form.checkValidity()) {
            //check if the user is paid user
            setCustomDomainProcessing(true);
            if (plan && plan === "free") {
                toaster.danger("This feature is available only to our Paid Customers. Please upgrade to avail this feature.", { id: 'toaster' });
                setCustomDomainProcessing(false);
                return;
            }

            //check if the supplied domain is available or not (this check is on netlify) 
            if (pageDetails.customDomain != newCustomDomain && existingDomains && existingDomains.indexOf(newCustomDomain) >= 0) {
                toaster.danger("Sorry this domain ['" + newCustomDomain + "'] is already used. Please configure some other custom domain.", { id: 'toaster' });
                setCustomDomainProcessing(false);
                return;
            }

            //check for pro plan restrictions
            if (plan && plan == "pro" && customDomainCount >= SiteConfig.plan.pro.customDomains) {
                toaster.danger("Custom domain is allowed only on '" + SiteConfig.plan.pro.customDomains + "' site for 'pro' plan. Please upgrade to increase this limit.", { id: 'toaster' });
                setCustomDomainProcessing(false);
                return;
            }

            //add domain alias to netlify
            addDomainToNetlifySite();
        }
    };

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

    const updateTrackingInfo = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        setGaValidated(true);
        if (form.checkValidity()) {
            toaster.closeAll()
            setGaProcessing(true)
            //Free plan restriction
            if (plan && plan == "free") {
                toaster.danger("Google Analytics feature is NOT available on FREE plan. Please upgrade to use this feature")
                setGaProcessing(false);
                return;
            }

            firebase
                .database()
                .ref()
                .child(`users/${user.uid}/projects/${pageDetails.slug}/googleAnalyticsId`)
                .set(gaID)
                .then(() => { refreshUserExtras(user); })
                .then(() => { setGaProcessing(false) })
                .then(() => { toaster.success('Google Analytics Information updated successfully. You will be redirected to Dashboard in 5 seconds') })
                .then(() => { setTimeout(function () { navigate(`/dashboard/`, { replace: true }) }, 5000); })
        }
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
        <div className="container m-2">
            <div className="row">
                <div className="col">
                    <Button height={20} marginBottom={10} iconBefore="arrow-left" appearance="minimal" onClick={() => navigate("/dashboard/")}>
                        Back to Dashboard
                    </Button>
                    <h5 className="mb-2">Manage all settings here</h5>
                    <Tabs className="nav-fill px-2"
                        id="page-settings"
                        onSelect={(k) => console.log("**** Selected tab = " + k)}
                    >
                        <Tab eventKey="general" title="General" style={tabContent}>
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

                            <Pane display="flex" marginLeft={10} marginRight={10} padding={10} background="tint2" borderRadius={3} elevation={4}>
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
                        </Tab>
                        <Tab eventKey="settings" title="Settings" style={tabContent}>
                            <Heading size={400}>Manage site settings here</Heading>
                            <button type="button" className="btn btn-info btn-sm mt-2">
                                Save Changes
                            </button>
                            <Pane padding={20} background="tint2" borderRadius={3} elevation={4}>
                                <TextInputField
                                    label="Site Title"
                                    placeholder="Enter title for the site"
                                    hint=""
                                />
                                <TextInputField
                                    label="Site Subtitle"
                                    placeholder="Enter subtitle of the site"
                                    hint=""
                                />
                                <TextInputField
                                    label="Primary color"
                                    placeholder="Enter primary color of the site"
                                    hint="eg. #3b4e5c"
                                />
                                <TextInputField
                                    label="Fonts"
                                    placeholder="Enter font family"
                                    hint=""
                                />
                                <TextInputField
                                    label="Meta Description"
                                    placeholder="Enter meta description of the site"
                                    hint="For SEO"
                                />
                                <TextInputField
                                    label="Meta Keywords"
                                    placeholder="Enter meta keywords of the site"
                                    hint="For SEO"
                                />
                                <Pane marginBottom={20}>
                                    <Heading size={400} marginBottom={5}>Logo Image</Heading>
                                    <FilePicker
                                        placeholder="Select logo of the site"
                                    />
                                </Pane>
                                <TextInputField
                                    label="Hero Title"
                                    placeholder="Enter title of the hero section"
                                    hint=""
                                />
                                <TextInputField
                                    label="Hero Description"
                                    placeholder="Enter description of the hero section"
                                    hint=""
                                />
                                <Pane marginBottom={20}>
                                    <Heading size={400} marginBottom={5}>Hero Image</Heading>
                                    <FilePicker
                                        placeholder="Select image of the hero section"
                                    />
                                </Pane>
                            </Pane>
                        </Tab>
                        <Tab eventKey="labels" title="Text Replacements" style={tabContent}>
                            <Heading size={400}>Manage site labels here</Heading>
                            <button type="button" className="btn btn-info btn-sm mt-2">
                                Save Changes
                            </button>
                            <Pane padding={20} background="tint2" borderRadius={3} elevation={4}>
                                <TextInputField
                                    label="errorMsgNoAccess"
                                    placeholder="Enter errorMsgNoAccess"
                                    hint="Message will be visible when the user try to perform a task which is under access management"
                                />
                                <TextInputField
                                    label="lblLogin"
                                    placeholder="Enter lblLogin"
                                    hint="Label of Login link/button"
                                />
                                <TextInputField
                                    label="lblSignup"
                                    placeholder="Enter lblSignup"
                                    hint="Label of Signup link/button"
                                />
                            </Pane>
                            <Heading>All other labels will come here one after another</Heading>
                        </Tab>
                        <Tab eventKey="paid" title="Paid Features" style={tabContent}>
                            {plan && plan != "free" &&
                                <Pane marginTop={20} marginLeft={10}>
                                    <Pane display="flex" padding={10} background="tint2" borderRadius={3} elevation={4}>
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
                                    <Pane display="flex" padding={20} background="tint2" borderRadius={3} elevation={4}>
                                        <Pane display="flex" float="left" flexDirection="column">
                                            <Heading marginBottom={8} size={500}>Enter Google Universal Analytics Tracking ID</Heading>
                                            <Form noValidate validated={gaValidated} onSubmit={updateTrackingInfo}>
                                                <Form.Control
                                                    name="gaid"
                                                    placeholder="UA-XXXXXXX-XX"
                                                    width="100%"
                                                    required
                                                    value={gaID}
                                                    onChange={e => { setGaID(e.target.value) }}
                                                />
                                                <button type="submit" className="btn btn-info btn-sm mt-2">
                                                    Update Tracking Info
                                                {gaProcessing && <Loader type="Bars" color="#FFF" className="d-inline" height={16} width={24} />}
                                                </button>
                                            </Form>
                                        </Pane>
                                    </Pane>
                                </Pane>
                            }

                            {plan && plan != "free" &&
                                <Pane marginTop={20} marginLeft={10}>
                                    <Text size={400}>Add Custom Domain</Text>
                                    <Pane display="flex" padding={20} background="tint2" borderRadius={3} elevation={4}>
                                        <Pane display="flex" float="left" flexDirection="column">
                                            <Heading marginBottom={8} size={500}>Enter custom domain or sub-domain url here</Heading>
                                            <Form noValidate validated={customDomainValidated} onSubmit={handleNewDomainSubmit}>
                                                <Form.Control
                                                    type="text"
                                                    name="customdomain"
                                                    placeholder="Domain/Subdomain URL"
                                                    width="100%"
                                                    required
                                                    value={newCustomDomain}
                                                    onChange={e => { setNewCustomDomain(e.target.value) }}
                                                />
                                                <button type="submit" className="btn btn-info btn-sm mt-2">
                                                    Submit Custom Domain
                                                {customDomainProcessing && <Loader type="Bars" color="#FFF" className="d-inline" className="d-inline" height={16} width={24} />}
                                                </button>
                                                {pageDetails.customDomain &&
                                                    <>
                                                        <Alert intent="none" marginTop={20} title="Custom Domain Exists">
                                                            You have already configured the custom domain ['{pageDetails.customDomain}'] for this account. You can update it if required.
                                                    </Alert>
                                                        <Pane display="flex" flexDirection="column" marginTop={5} padding={10} background="purpleTint" borderRadius={3} elevation={4}>
                                                            <Heading size={600} marginBottom={15}>DNS Configuration to make custom domain work<span>*</span></Heading>
                                                            <Heading size={500} marginBottom={10}>Point {pageDetails.customDomain.split(".")[0]} CNAME record to hyperlyst-sites.netlify.app</Heading>
                                                            <Text size={400} marginBottom={10}>Log in to the account you have with your DNS provider, and add a CNAME record for testcustom1 pointing to hyperlyst-sites.netlify.app.</Text>
                                                            <kbd className="p-3">{pageDetails.customDomain.split(".")[0]} CNAME hyperlyst-sites.netlify.app.</kbd>
                                                            <Text size={400} marginBottom={10} marginTop={10}>If you’ve already done this, allow up to 24 hours for the changes to propagate or check this <a className="text-primary" href="https://docs.netlify.com/domains-https/custom-domains/configure-external-dns/#configure-a-subdomain" target="_blank">documentation</a> for more information.</Text>
                                                            <Text size={300} className="text-primary">* Completion of this step is very important else your pages wont be accessible via your custom domain</Text>
                                                        </Pane>
                                                    </>
                                                }
                                            </Form>
                                        </Pane>
                                    </Pane>
                                </Pane>
                            }
                        </Tab>
                        <Tab eventKey="access" title="Access" style={tabContent}>
                            <Heading size={400}>Manage what site actions would be access-driven</Heading>
                            <button type="button" className="btn btn-info btn-sm mt-2">
                                Save Changes
                            </button>
                            <Pane display="flex" padding={10} background="tint2" borderRadius={3} elevation={4}>
                                <Pane display="flex" float="left" flexDirection="column">
                                    <Pane display="flex">
                                        <Switch margin={10} />
                                        <Heading margin={8} size={500}>{`  `}Like items</Heading>
                                    </Pane>
                                    <Pane display="flex">
                                        <Switch margin={10} />
                                        <Heading margin={8} size={500}>{`  `}Submit new item</Heading>
                                    </Pane>
                                    <Pane display="flex">
                                        <Switch margin={10} />
                                        <Heading margin={8} size={500}>{`  `}Add comments</Heading>
                                    </Pane>
                                </Pane>
                            </Pane>
                        </Tab>
                        <Tab eventKey="dangerzone" title="Danger Zone" style={tabContent}>
                            <Text size={400}>Delete Page</Text>
                            <Pane display="flex" margin={10}>
                                <IconButton icon="trash" appearance="primary" intent="danger" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteProject(pageDetails.slug) }}></IconButton>
                            </Pane>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default PageDetails
