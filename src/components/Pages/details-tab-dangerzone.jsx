import React from "react"
import _ from 'lodash'
import { Form, Tabs, Tab } from 'react-bootstrap';
import { getUser, getUserExtras, getUserType } from "../../utils/auth"
import { refreshUserExtras } from "../../utils/firebaseHelpers"
import firebase from "gatsby-plugin-firebase"
import { Alert, IconButton, toaster, Pane, Heading, Text, TextInputField, FilePicker, Button, Switch } from "evergreen-ui"
import Loader from 'react-loader-spinner'
import { CloudinaryContext } from "cloudinary-react";
import { openUploadWidget } from "../../utils/cloudinaryService"


const PageDetailsTabDangerZone = ({ pageDetails }) => {
	const user = getUser();
    
    return (
        <>
        </>
    )
}

export default PageDetailsTabDangerZone;