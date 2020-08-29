import React from "react"
import _ from 'lodash'
import { navigate } from "gatsby"
import { getUser, getUserExtras, getUserType } from "../../utils/auth"
import { refreshUserExtras } from "../../utils/firebaseHelpers"
import firebase from "gatsby-plugin-firebase"
import { Alert, IconButton, toaster, Pane, Heading, Text, TextInputField, FilePicker, Button, Switch } from "evergreen-ui"
import Loader from 'react-loader-spinner'

const PageDetailsTabAccess = ({ pageDetails }) => {
    const user = getUser();
    let userExtras = getUserExtras();

    //access
    const accessData = pageDetails.data && pageDetails.data.access ? pageDetails.data.access : [];
    const [accessProcessing, setAccessProcessing] = React.useState(false);
    
    const [likeItems, setLikeItems] = React.useState(accessData.likeItems || false);
    const [submitNewItem, setSubmitNewItem] = React.useState(accessData.submitNewItem || false);
    const [submitComments, setSubmitComments] = React.useState(accessData.submitComments || false);

    const saveAccess = (slug) => {
        toaster.closeAll()
        setAccessProcessing(true)

        const accessData = {
            likeItems,
            submitNewItem,
            submitComments
        }

        firebase
            .database()
            .ref()
            .child(`users/${user.uid}/projects/${slug}/data/access`)
            .set(accessData)
            .then(() => { refreshUserExtras(user); })
            .then(() => { setAccessProcessing(false) })
            .then(() => { toaster.success('Access data Saved Successfully. You will be redirected to Dashboard in 5 seconds') })
            .then(() => { setTimeout(function () { navigate(`/dashboard/`, { replace: true }) }, 5000); })
    };

    return (
        <Pane margin={10}>
            <Heading size={600} marginBottom={10}>Manage what site actions would be access-driven</Heading>
            <Button height={24} iconBefore="floppy-disk" appearance="primary" onClick={() => { saveAccess(pageDetails.slug) }}>
                Save Changes
                {accessProcessing && <Loader type="Bars" color="#FFF" height={16} width={24} />}
            </Button>
            <Pane display="flex" padding={10} background="tint2" borderRadius={3} elevation={4}>
                <Pane display="flex" float="left" flexDirection="column">
                    <Pane display="flex">
                        <Switch margin={10} 
                            checked={likeItems}
                            onChange={e => { setLikeItems(e.target.checked); }}
                        />
                        <Heading margin={8} size={500}>{`  `}Like items</Heading>
                    </Pane>
                    <Pane display="flex">
                    <Switch margin={10} 
                            checked={submitNewItem}
                            onChange={e => { setSubmitNewItem(e.target.checked); }}
                        />
                        <Heading margin={8} size={500}>{`  `}Submit new item</Heading>
                    </Pane>
                    <Pane display="flex">
                    <Switch margin={10} 
                            checked={submitComments}
                            onChange={e => { setSubmitComments(e.target.checked); }}
                        />
                        <Heading margin={8} size={500}>{`  `}Add comments</Heading>
                    </Pane>
                </Pane>
            </Pane>
        </Pane>
    )
}

export default PageDetailsTabAccess;