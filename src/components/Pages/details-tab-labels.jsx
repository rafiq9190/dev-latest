import React from "react"
import _ from 'lodash'
import { navigate } from "gatsby"
import { getUser } from "../../utils/auth"
import { refreshUserExtras } from "../../utils/firebaseHelpers"
import firebase from "gatsby-plugin-firebase"
import { toaster, Pane, Heading, TextInputField, Button } from "evergreen-ui"
import Loader from 'react-loader-spinner'


const PageDetailsTabLabels = ({ pageDetails }) => {
    const user = getUser();

    //settings
    const labelsData = pageDetails.data && pageDetails.data.labels ? pageDetails.data.labels : [];
    const [labelsProcessing, setLabelsProcessing] = React.useState(false);
    const [errorMsgNoAccess, setErrorMsgNoAccess] = React.useState(labelsData.errorMsgNoAccess || 'Please Login OR Register for this feature');
    const [lblLogin, setLblLogin] = React.useState(labelsData.lblLogin || 'Log In');
    const [lblSignup, setLblSignup] = React.useState(labelsData.lblSignup || 'Sign Up');
    const [lblLogout, setLblLogout] = React.useState(labelsData.lblLogout || 'Log Out');
    const [titleList, setTitleList] = React.useState(labelsData.titleList || 'Today');
    const [titleLoginForm, setTitleLoginForm] = React.useState(labelsData.titleLoginForm || 'Login on the site');
    const [descriptionLoginForm, setDescriptionLoginForm] = React.useState(labelsData.descriptionLoginForm || 'Login to our community of friendly folks.');
    const [lblEmailLoginForm, setLblEmailLoginForm] = React.useState(labelsData.lblEmailLoginForm || 'E-mail');
    const [placeholderEmailLoginForm, setPlaceholderEmailLoginForm] = React.useState(labelsData.placeholderEmailLoginForm || 'E-mail');
    const [lblPasswordLoginForm, setLblPasswordLoginForm] = React.useState(labelsData.lblPasswordLoginForm || 'Password');
    const [placeholderPasswordLoginForm, setPlaceholderPasswordLoginForm] = React.useState(labelsData.placeholderPasswordLoginForm || 'Password');
    const [footerLoginForm, setFooterLoginForm] = React.useState(labelsData.footerLoginForm || 'We will never post to any of your accounts without your permission.');
    const [btnLoginLoginForm, setBtnLoginLoginForm] = React.useState(labelsData.btnLoginLoginForm || 'Login');
    const [btnCloseLoginForm, setBtnCloseLoginForm] = React.useState(labelsData.btnCloseLoginForm || 'Close');
    const [successMsgLoginForm, setSuccessMsgLoginForm] = React.useState(labelsData.successMsgLoginForm || 'Logged in successfully');
    const [titleSignupForm, setTitleSignupForm] = React.useState(labelsData.titleSignupForm || 'Signup with us');
    const [descriptionSignupForm, setDescriptionSignupForm] = React.useState(labelsData.descriptionSignupForm || 'Signup with our community of friendly folks.');
    const [lblEmailSignupForm, setLblEmailSignupForm] = React.useState(labelsData.lblEmailSignupForm || 'Enter your E-mail address');
    const [placeholderEmailSignupForm, setPlaceholderEmailSignupForm] = React.useState(labelsData.placeholderEmailSignupForm || 'E-mail');
    const [lblPasswordSignupForm, setLblPasswordSignupForm] = React.useState(labelsData.lblPasswordSignupForm || 'Enter your Password');
    const [placeholderPasswordSignupForm, setPlaceholderPasswordSignupForm] = React.useState(labelsData.placeholderPasswordSignupForm || 'Password');
    const [lblFullnameSignupForm, setLblFullnameSignupForm] = React.useState(labelsData.lblFullnameSignupForm || 'Enter your Fullname');
    const [placeholderFullnameSignupForm, setPlaceholderFullnameSignupForm] = React.useState(labelsData.placeholderFullnameSignupForm || 'Fullname');
    const [footerSignupForm, setFooterSignupForm] = React.useState(labelsData.footerSignupForm || 'We will never post to any of your accounts without your permission.');
    const [btnRegisterSignupForm, setBtnRegisterSignupForm] = React.useState(labelsData.btnRegisterSignupForm || 'Register');
    const [btnCloseSignupForm, setBtnCloseSignupForm] = React.useState(labelsData.btnCloseSignupForm || 'Close');
    const [successMsgSignupForm, setSuccessMsgSignupForm] = React.useState(labelsData.successMsgSignupForm || 'User registration successful. Please use your credentials to login to the site now.');
    const [warningBeforeLogout, setWarningBeforeLogout] = React.useState(labelsData.warningBeforeLogout || 'Are you sure you want to Logout from the Site?');
    const [successMsgLogout, setSuccessMsgLogout] = React.useState(labelsData.successMsgLogout || 'Logged out successfully');
    const [titleCreateForm, setTitleCreateForm] = React.useState(labelsData.titleCreateForm || 'Submit a Record');
    const [lblRecordName, setLblRecordName] = React.useState(labelsData.lblRecordName || 'Record Name');
    const [placeholderRecordName, setPlaceholderRecordName] = React.useState(labelsData.placeholderRecordName || 'Supply the name of the record');
    const [lblTagline, setLblTagline] = React.useState(labelsData.lblTagline || 'Tagline');
    const [placeholderTagline, setPlaceholderTagline] = React.useState(labelsData.placeholderTagline || 'Concise tagline for the record');
    const [lblDescription, setLblDescription] = React.useState(labelsData.lblDescription || 'Description');
    const [placeholderDescription, setPlaceholderDescription] = React.useState(labelsData.placeholderDescription || 'Brief description of the record');
    const [lblRecordURL, setLblRecordURL] = React.useState(labelsData.lblRecordURL || 'Record URL');
    const [placeholderRecordURL, setPlaceholderRecordURL] = React.useState(labelsData.placeholderRecordURL || 'Record URL');
    const [btnUploadRecordImage, setBtnUploadRecordImage] = React.useState(labelsData.btnUploadRecordImage || 'Upload Record Image');
    const [lblSubmit, setLblSubmit] = React.useState(labelsData.lblSubmit || 'Submit Record');
    const [errorMsgCreateForm, setErrorMsgCreateForm] = React.useState(labelsData.errorMsgCreateForm || 'Error while submitting the record');
    const [successMsgCreateForm, setSuccessMsgCreateForm] = React.useState(labelsData.successMsgCreateForm || 'Record submitted successfully');
    const [lblPoweredBy, setLblPoweredBy] = React.useState(labelsData.lblPoweredBy || 'Powered By');

    const saveLabels = (slug) => {
        toaster.closeAll()
        setLabelsProcessing(true)

        const labelsData = {
            errorMsgNoAccess,
            lblLogin,
            lblSignup,
            lblLogout,
            titleList,
            titleLoginForm,
            descriptionLoginForm,
            lblEmailLoginForm,
            placeholderEmailLoginForm,
            lblPasswordLoginForm,
            placeholderPasswordLoginForm,
            footerLoginForm,
            btnLoginLoginForm,
            btnCloseLoginForm,
            successMsgLoginForm,
            titleSignupForm,
            descriptionSignupForm,
            lblEmailSignupForm,
            placeholderEmailSignupForm,
            lblPasswordSignupForm,
            placeholderPasswordSignupForm,
            lblFullnameSignupForm,
            placeholderFullnameSignupForm,
            footerSignupForm,
            btnRegisterSignupForm,
            btnCloseSignupForm,
            successMsgSignupForm,
            warningBeforeLogout,
            successMsgLogout,
            titleCreateForm,
            lblRecordName,
            placeholderRecordName,
            lblTagline,
            placeholderTagline,
            lblDescription,
            placeholderDescription,
            lblRecordURL,
            placeholderRecordURL,
            btnUploadRecordImage,
            lblSubmit,
            errorMsgCreateForm,
            successMsgCreateForm,
            lblPoweredBy,
        }

        firebase
            .database()
            .ref()
            .child(`users/${user.uid}/projects/${slug}/data/labels`)
            .set(labelsData)
            .then(() => { refreshUserExtras(user); })
            .then(() => { setLabelsProcessing(false) })
            .then(() => { toaster.success('Labels Saved Successfully. You will be redirected to Dashboard in 5 seconds') })
            .then(() => { setTimeout(function () { navigate(`/dashboard/`, { replace: true }) }, 5000); })
    };

    return (
        <Pane margin={10}>
            <Heading size={600} marginBottom={10}>Manage site labels here</Heading>
            <Button height={24} iconBefore="floppy-disk" appearance="primary" onClick={() => { saveLabels(pageDetails.slug) }}>
                Save Changes
                {labelsProcessing && <Loader type="Bars" color="#FFF" height={16} width={24} />}
            </Button>
            <Pane padding={20} background="tint2" borderRadius={3} elevation={4}>
                <TextInputField label='errorMsgNoAccess' placeholder='Enter value for errorMsgNoAccess' value={errorMsgNoAccess} onChange={e => setErrorMsgNoAccess(e.target.value)} hint='Message will be visible when the user try to perform a task which is under access management' />
                <TextInputField label='lblLogin' placeholder='Enter value for lblLogin' value={lblLogin} onChange={e => setLblLogin(e.target.value)} hint='Label of Login link' />
                <TextInputField label='lblSignup' placeholder='Enter value for lblSignup' value={lblSignup} onChange={e => setLblSignup(e.target.value)} hint='Label of Signup link' />
                <TextInputField label='lblLogout' placeholder='Enter value for lblLogout' value={lblLogout} onChange={e => setLblLogout(e.target.value)} hint='Label of Logout link' />
                <TextInputField label='titleList' placeholder='Enter value for titleList' value={titleList} onChange={e => setTitleList(e.target.value)} hint='Title on top of list' />
                <TextInputField label='titleLoginForm' placeholder='Enter value for titleLoginForm' value={titleLoginForm} onChange={e => setTitleLoginForm(e.target.value)} hint='Title of Login form' />
                <TextInputField label='descriptionLoginForm' placeholder='Enter value for descriptionLoginForm' value={descriptionLoginForm} onChange={e => setDescriptionLoginForm(e.target.value)} hint='Description of Login form' />
                <TextInputField label='lblEmailLoginForm' placeholder='Enter value for lblEmailLoginForm' value={lblEmailLoginForm} onChange={e => setLblEmailLoginForm(e.target.value)} hint='Label of email field on Login form' />
                <TextInputField label='placeholderEmailLoginForm' placeholder='Enter value for placeholderEmailLoginForm' value={placeholderEmailLoginForm} onChange={e => setPlaceholderEmailLoginForm(e.target.value)} hint='Placeholder text of email field on Login form' />
                <TextInputField label='lblPasswordLoginForm' placeholder='Enter value for lblPasswordLoginForm' value={lblPasswordLoginForm} onChange={e => setLblPasswordLoginForm(e.target.value)} hint='Label of password field on Login form' />
                <TextInputField label='placeholderPasswordLoginForm' placeholder='Enter value for placeholderPasswordLoginForm' value={placeholderPasswordLoginForm} onChange={e => setPlaceholderPasswordLoginForm(e.target.value)} hint='Placeholder text of password field on Login form' />
                <TextInputField label='footerLoginForm' placeholder='Enter value for footerLoginForm' value={footerLoginForm} onChange={e => setFooterLoginForm(e.target.value)} hint='Footer text of Login form' />
                <TextInputField label='btnLoginLoginForm' placeholder='Enter value for btnLoginLoginForm' value={btnLoginLoginForm} onChange={e => setBtnLoginLoginForm(e.target.value)} hint='Login button text on Login form' />
                <TextInputField label='btnCloseLoginForm' placeholder='Enter value for btnCloseLoginForm' value={btnCloseLoginForm} onChange={e => setBtnCloseLoginForm(e.target.value)} hint='Close button text on Login form' />
                <TextInputField label='successMsgLoginForm' placeholder='Enter value for successMsgLoginForm' value={successMsgLoginForm} onChange={e => setSuccessMsgLoginForm(e.target.value)} hint='Message after successful login' />
                <TextInputField label='titleSignupForm' placeholder='Enter value for titleSignupForm' value={titleSignupForm} onChange={e => setTitleSignupForm(e.target.value)} hint='Title of Signup form' />
                <TextInputField label='descriptionSignupForm' placeholder='Enter value for descriptionSignupForm' value={descriptionSignupForm} onChange={e => setDescriptionSignupForm(e.target.value)} hint='Description of Signup form' />
                <TextInputField label='lblEmailSignupForm' placeholder='Enter value for lblEmailSignupForm' value={lblEmailSignupForm} onChange={e => setLblEmailSignupForm(e.target.value)} hint='Label of email on Signup form' />
                <TextInputField label='placeholderEmailSignupForm' placeholder='Enter value for placeholderEmailSignupForm' value={placeholderEmailSignupForm} onChange={e => setPlaceholderEmailSignupForm(e.target.value)} hint='Placeholder text of email on Signup form' />
                <TextInputField label='lblPasswordSignupForm' placeholder='Enter value for lblPasswordSignupForm' value={lblPasswordSignupForm} onChange={e => setLblPasswordSignupForm(e.target.value)} hint='Label of password on Signup form' />
                <TextInputField label='placeholderPasswordSignupForm' placeholder='Enter value for placeholderPasswordSignupForm' value={placeholderPasswordSignupForm} onChange={e => setPlaceholderPasswordSignupForm(e.target.value)} hint='Placeholder text of password on Signup form' />
                <TextInputField label='lblFullnameSignupForm' placeholder='Enter value for lblFullnameSignupForm' value={lblFullnameSignupForm} onChange={e => setLblFullnameSignupForm(e.target.value)} hint='Label of fullname on Signup form' />
                <TextInputField label='placeholderFullnameSignupForm' placeholder='Enter value for placeholderFullnameSignupForm' value={placeholderFullnameSignupForm} onChange={e => setPlaceholderFullnameSignupForm(e.target.value)} hint='Placeholder text of fullname on Signup form' />
                <TextInputField label='footerSignupForm' placeholder='Enter value for footerSignupForm' value={footerSignupForm} onChange={e => setFooterSignupForm(e.target.value)} hint='Footer on Signup form' />
                <TextInputField label='btnRegisterSignupForm' placeholder='Enter value for btnRegisterSignupForm' value={btnRegisterSignupForm} onChange={e => setBtnRegisterSignupForm(e.target.value)} hint='Login button text on Signup form' />
                <TextInputField label='btnCloseSignupForm' placeholder='Enter value for btnCloseSignupForm' value={btnCloseSignupForm} onChange={e => setBtnCloseSignupForm(e.target.value)} hint='Close button text on Signup form' />
                <TextInputField label='successMsgSignupForm' placeholder='Enter value for successMsgSignupForm' value={successMsgSignupForm} onChange={e => setSuccessMsgSignupForm(e.target.value)} hint='Message after successful signup' />
                <TextInputField label='warningBeforeLogout' placeholder='Enter value for warningBeforeLogout' value={warningBeforeLogout} onChange={e => setWarningBeforeLogout(e.target.value)} hint='Warning message before logout' />
                <TextInputField label='successMsgLogout' placeholder='Enter value for successMsgLogout' value={successMsgLogout} onChange={e => setSuccessMsgLogout(e.target.value)} hint='Message after successful logout' />
                <TextInputField label='titleCreateForm' placeholder='Enter value for titleCreateForm' value={titleCreateForm} onChange={e => setTitleCreateForm(e.target.value)} hint='Title of the Create form' />
                <TextInputField label='lblRecordName' placeholder='Enter value for lblRecordName' value={lblRecordName} onChange={e => setLblRecordName(e.target.value)} hint='Label of the name of the record on Create form' />
                <TextInputField label='placeholderRecordName' placeholder='Enter value for placeholderRecordName' value={placeholderRecordName} onChange={e => setPlaceholderRecordName(e.target.value)} hint='Placeholder text for name of the record on Create form' />
                <TextInputField label='lblTagline' placeholder='Enter value for lblTagline' value={lblTagline} onChange={e => setLblTagline(e.target.value)} hint='Label of the record tagline on Create form' />
                <TextInputField label='placeholderTagline' placeholder='Enter value for placeholderTagline' value={placeholderTagline} onChange={e => setPlaceholderTagline(e.target.value)} hint='Placeholder text for the record tagline on Create form' />
                <TextInputField label='lblDescription' placeholder='Enter value for lblDescription' value={lblDescription} onChange={e => setLblDescription(e.target.value)} hint='Label of the Record description on Create form' />
                <TextInputField label='placeholderDescription' placeholder='Enter value for placeholderDescription' value={placeholderDescription} onChange={e => setPlaceholderDescription(e.target.value)} hint='Placeholder text for the record description on Create form' />
                <TextInputField label='lblRecordURL' placeholder='Enter value for lblRecordURL' value={lblRecordURL} onChange={e => setLblRecordURL(e.target.value)} hint='Label of the url of the record on Create form' />
                <TextInputField label='placeholderRecordURL' placeholder='Enter value for placeholderRecordURL' value={placeholderRecordURL} onChange={e => setPlaceholderRecordURL(e.target.value)} hint='Placeholder text for url of the record on Create form' />
                <TextInputField label='btnUploadRecordImage' placeholder='Enter value for btnUploadRecordImage' value={btnUploadRecordImage} onChange={e => setBtnUploadRecordImage(e.target.value)} hint='Label of the upload image button of the record on Create form' />
                <TextInputField label='lblSubmit' placeholder='Enter value for lblSubmit' value={lblSubmit} onChange={e => setLblSubmit(e.target.value)} hint='Text of submit button on Create form' />
                <TextInputField label='errorMsgCreateForm' placeholder='Enter value for errorMsgCreateForm' value={errorMsgCreateForm} onChange={e => setErrorMsgCreateForm(e.target.value)} hint='Error message while submitting a new record' />
                <TextInputField label='successMsgCreateForm' placeholder='Enter value for successMsgCreateForm' value={successMsgCreateForm} onChange={e => setSuccessMsgCreateForm(e.target.value)} hint='Message after successfully submitting a record' />
                {/* <TextInputField label='lblPoweredBy' placeholder='Enter value for Powered By text' value={lblPoweredBy} onChange={e => setLblPoweredBy(e.target.value)} hint='Powered By text in the footer' /> */}
            </Pane>
        </Pane>
    )
}

export default PageDetailsTabLabels;