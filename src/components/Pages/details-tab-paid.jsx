import React from "react"
import _ from 'lodash'
import { navigate } from "gatsby"
import { Form, Tabs, Tab } from 'react-bootstrap';
import { getUser, getUserExtras, getUserType } from "../../utils/auth"
import { refreshUserExtras } from "../../utils/firebaseHelpers"
import firebase from "gatsby-plugin-firebase"
import { Alert, Icon, toaster, Pane, Heading, Text, Link, Code, Dialog, Switch } from "evergreen-ui"
import Loader from 'react-loader-spinner'
import NetlifyAPI from 'netlify'
import SiteConfig from "../../config/site"

const PageDetailsTabPaid = ({ pageDetails }) => {

    const user = getUser();
    let userExtras = getUserExtras();

    const plan = getUserType();

    const customDomainCount = (userExtras && userExtras.projects) ? _.filter(userExtras.projects, (project) => project.customDomain != null).length : 0;

    //paid
    const [usermgmtProcessing, setUsermgmtProcessing] = React.useState(false);
    const [usermgmtState, setUsermgmtState] = React.useState(pageDetails && pageDetails.usermanagement);
    const [accessmgmtProcessing, setAccessmgmtProcessing] = React.useState(false);
    const [accessmgmtState, setAccessmgmtState] = React.useState(pageDetails && pageDetails.accessmanagement);
    const [isRtlProcessing, setIsRtlProcessing] = React.useState(false);
    const [isRtlState, setIsRtlState] = React.useState(pageDetails && pageDetails.isrtl);
    
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

    const [crispChatID, setCrispChatID] = React.useState(pageDetails.crispChatId);
    const [crispChatValidated, setCrispChatValidated] = React.useState(false);
    const [crispChatProcessing, setCrispChatProcessing] = React.useState(false);
    const [crispChatHelpShown, setCrispChatHelpShown] = React.useState(false);

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

    const changeIsRtl = (slug, newstate) => {
        console.log("********** " + slug + ", " + newstate)
        toaster.closeAll()
        setIsRtlProcessing(true)
        //Free plan restriction
        if (plan == "free") {
            toaster.danger(
                "Feature to enable RTL for a site is NOT available on FREE plan. Please upgrade to use this feature", {
                id: 'forbidden-action'
            }
            )
            setIsRtlProcessing(false);
            return;
        }

        firebase
            .database()
            .ref()
            .child(`users/${user.uid}/projects/${slug}/isrtl`)
            .set(newstate)
            .then(() => { refreshUserExtras(user); })
            .then(() => { setIsRtlProcessing(false) })
            .then(() => { toaster.success('RTL(Right-To-Left) feature ' + (newstate ? 'activated' : 'deactivated') + ' successfully. You will be redirected to Dashboard in 5 seconds') })
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

    const updateCrispChatInfo = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        setCrispChatValidated(true);
        if (form.checkValidity()) {
            toaster.closeAll()
            setCrispChatProcessing(true)
            //Free plan restriction
            if (plan && plan == "free") {
                toaster.danger("Crisp Chat feature is NOT available on FREE plan. Please upgrade to use this feature")
                setCrispChatProcessing(false);
                return;
            }

            firebase
                .database()
                .ref()
                .child(`users/${user.uid}/projects/${pageDetails.slug}/crispChatId`)
                .set(crispChatID)
                .then(() => { refreshUserExtras(user); })
                .then(() => { setCrispChatProcessing(false) })
                .then(() => { toaster.success('Crisp Chat ID is updated successfully. You will be redirected to Dashboard in 5 seconds') })
                .then(() => { setTimeout(function () { navigate(`/dashboard/`, { replace: true }) }, 5000); })
        }
    };

    return (
        <>
            <Heading size={600} margin={10}>Manage different paid features here</Heading>
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
                    <Pane display="flex" padding={10} background="tint2" borderRadius={3} elevation={4}>
                        <Pane display="flex" float="left" flexDirection="column">
                            <Pane display="flex">
                                <Switch margin={10}
                                    checked={isRtlState}
                                    onChange={e => { setIsRtlState(e.target.checked); changeIsRtl(pageDetails.slug, !pageDetails.isrtl) }}
                                />
                                <Heading margin={8} size={500}>{`  `}Is Site RTL? (Right-to-Left)</Heading>
                                {isRtlProcessing && <Pane marginTop={5}><Loader type="Bars" color="#3d8bd4" height={16} width={24} /></Pane>}
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
                            <h6>Enter Google Universal Analytics Tracking ID</h6>
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
                            <h6>Enter custom domain or sub-domain url here</h6>
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

            {plan && plan != "free" &&
                <Pane marginTop={20} marginLeft={10}>
                    <Text size={400}>Crisp Chat</Text>
                    <Pane display="flex" padding={20} background="tint2" borderRadius={3} elevation={4}>
                        <Pane display="flex" float="left" flexDirection="column">
                            <h6>
                                Enter Website ID of Crisp Chat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Icon size={24} style={{ cursor: "hand" }} marginLeft={5} icon="help" title="Click to see more details" color="muted" onClick={() => setCrispChatHelpShown(true)} />
                            </h6>
                            <Form noValidate validated={crispChatValidated} onSubmit={updateCrispChatInfo}>
                                <Form.Control
                                    name="crispchatid"
                                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                    width="100%"
                                    required
                                    value={crispChatID}
                                    onChange={e => { setCrispChatID(e.target.value) }}
                                />
                                <button type="submit" className="btn btn-info btn-sm mt-2">
                                    Update Crisp Chat Info
                                    {crispChatProcessing && <Loader type="Bars" color="#FFF" className="d-inline" height={16} width={24} />}
                                </button>
                            </Form>
                            <Dialog
                                isShown={crispChatHelpShown}
                                title="Help - How to get Crisp Chat Website ID"
                                confirmLabel="Close"
                                onCloseComplete={() => setCrispChatHelpShown(false)}
                            >
                                <Pane display="flex" flexDirection='column' margin={10} padding={10} background="tealTint" borderRadius={3} elevation={4}>
                                    <Text>
                                        <b>Follow below steps to get the "Website ID" from your "Crisp Chat" account:</b>
                                        <ol>
                                            <li>Create an account on Crisp. OR Login to Crisp account</li>
                                            <li>Go to <Code>Settings</Code>. Then, <Code>Website Settings.</Code></li>
                                            <li>Next to your website, click on <Code>Settings.</Code></li>
                                            <li>Click on <Code>Setup instructions.</Code></li>
                                            <li>Select and Copy <Code>Website ID</Code></li>
                                        </ol>
                                    </Text>

                                </Pane>                                
                            </Dialog>
                        </Pane>
                    </Pane>
                </Pane>
            }
        </>
    )
}

export default PageDetailsTabPaid;