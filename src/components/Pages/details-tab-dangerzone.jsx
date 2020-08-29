import React from "react"
import _ from 'lodash'
import { navigate } from "gatsby"
import { getUser, getUserExtras, getUserType } from "../../utils/auth"
import { refreshUserExtras } from "../../utils/firebaseHelpers"
import firebase from "gatsby-plugin-firebase"
import { Alert, IconButton, toaster, Pane, Heading, Text, TextInputField, FilePicker, Button, Switch } from "evergreen-ui"

const PageDetailsTabDangerZone = ({ pageDetails }) => {
    const user = getUser();

    const deleteProject = (slug) => {
        console.log("*********** deleteProject")
        console.log(`users/${user.uid}/projects/${slug}`)
        firebase
            .database()
            .ref()
            .child(`users/${user.uid}/projects/${slug}`)
            .remove()
            .then(() => { refreshUserExtras(user); })
            .then(() => { toaster.success('Deletion successfully. You will be redirected to Dashboard in 5 seconds') })
            .then(() => { setTimeout(function () { navigate(`/dashboard/`, { replace: true }) }, 5000); })
    };


    return (
        <Pane margin={10} padding={10} background="tint2" borderRadius={3} elevation={4}>
            <Text size={400} color="red">Delete Page</Text>
            <Pane display="flex" margin={10}>
                <IconButton icon="trash" appearance="primary" intent="danger" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteProject(pageDetails.slug) }}></IconButton>
            </Pane>
        </Pane>
    )
}

export default PageDetailsTabDangerZone;