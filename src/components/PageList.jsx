import React from "react"
import { Avatar, SideSheet, IconButton, Alert, Pill, toaster, Pane, Heading, Text, Button, Badge } from "evergreen-ui"
import _ from 'lodash'
import { getUser, getUserExtras, getUserType } from "../utils/auth"
import { refreshUserExtras } from "../utils/firebaseHelpers"
import firebase from "gatsby-plugin-firebase"
import Loader from 'react-loader-spinner'

const PageList = ({ projects }) => {

    const user = getUser();
    let userExtras = getUserExtras();
    const plan = getUserType();
    const publicdomain = userExtras.custom_domain ? ("http://"+userExtras.custom_domain) : "https://sites.hyperlyst.com"

    const publishedCount = (userExtras && userExtras.projects) ? _.filter(userExtras.projects, { published: true }).length : 0;
    const MaxProjectsInFreePlan = 3;

    const [isDetailsShown, setIsDetailsShown] = React.useState(false);
    const [publishProcessing, setPublishProcessing] = React.useState(false);
    const [pageDetails, setPageDetails] = React.useState();

    let bgColors = ["id_170", "id_174", "id_177", "id_173", "id_175", "id_171"]
    //bgColors = [];
    let start = "170"
    _.times(20, () => {
        //bgColors.push("id_"+(start++));
    });

    const showPageDetails = (project) => {
        setPageDetails(project)
        setIsDetailsShown(true);
    }

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
            .then(() => { toaster.success('Page ' + (newstate ? '' : 'un') + 'published successfully. Page will reload in 5 seconds to refresh the data') })
            .then(() => { setTimeout(function () { window.location.reload(); }, 5000); })
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
            .then(() => { toaster.success('Deletion successfully. Page will reload in 5 seconds to refresh the data') })
            .then(() => { setTimeout(function () { window.location.reload(); }, 5000); })
    };

    return (
        <div className="row">
            {projects && projects.map((project, index) => (
                <div className="col col5" key={index}>
                    <div className="dashboard_box text-center">
                        <a href="javascript:void(0)" onClick={() => showPageDetails(project)}>
                            <Avatar name={project.title} hashValue={bgColors[index % 6]} isSolid size={100} style={{ borderRadius: "12px" }} />
                            {project.published &&
                                <Pill display="inline-flex" color="green" isSolid style={{ color: "#47b881" }}>.</Pill>
                            }
                            <h3>{project.title}</h3>
                        </a>
                    </div>
                </div>
            ))}
            <div className="col col5">
                <div className="dashboard_box text-center">
                    <a href="/dashboard/page/create">
                        <Avatar name="+" color="neutral" size={100} />
                        <h3>Add a Site</h3>
                    </a>
                </div>
            </div>
            <SideSheet
                isShown={isDetailsShown}
                containerProps={{
                    display: 'flex',
                    flex: '1',
                    flexDirection: 'column',
                }}
                width={"300"}
                onCloseComplete={() => setIsDetailsShown(false)}
            >
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
            </SideSheet>
        </div>
    );
}

export default PageList;