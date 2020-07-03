import React from "react"
import { useState } from "react"
import { getUser, getUserExtras, getUserType } from "../../utils/auth"
import { refreshUserExtras } from "../../utils/firebaseHelpers"
import firebase from "gatsby-plugin-firebase"
import { Link } from "gatsby"
import Loader from 'react-loader-spinner'
import { Alert, Button, Card, CardColumns } from "react-bootstrap"
import { RiDeleteBinLine } from "react-icons/ri"
import Statistics from "../Statistics"
import _ from "lodash"
import Breadcrumb from "../Breadcrumb"
import PageList from "../PageList"

const Projects = () => {
    const user = getUser();
    let userExtras = getUserExtras();
    const plan = getUserType();

    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);

    const publishedCount = (userExtras && userExtras.projects) ? _.filter(userExtras.projects, { published: true }).length : 0;
    const MaxProjectsInFreePlan = 3;

    React.useEffect(() => {
        if (loading && !projects.length && userExtras && userExtras.projects) {
            setProjects(Object.values(userExtras.projects));
        }
        setLoading(false);
    }, [loading, projects])

    const changePagePublishState = (slug, newstate) => {
        if(newstate){
            //Free plan restriction
            if (plan == "free" && publishedCount >= MaxProjectsInFreePlan) {
                alert("Only '" + MaxProjectsInFreePlan + "' pages are allowed to be published in FREE plan")
                return;
            }
        }
        firebase
            .database()
            .ref()
            .child(`users/${user.uid}/projects/${slug}/published`)
            .set(newstate)
            .then(()=>{refreshUserExtras(user);alert('Refresh the page to reload the data');window.location.reload();})
    };

    const deleteProject = (slug) => {
        console.log("*********** deleteProject")
        console.log(`users/${user.uid}/projects/${slug}`)
        firebase
            .database()
            .ref()
            .child(`users/${user.uid}/projects/${slug}`)
            .remove()
            .then(()=>{refreshUserExtras(user);alert('Refresh the page to reload the data');window.location.reload();})
    };
    let currentItemIndex = 0;

    return (
        <>
            {loading &&
                <div className="text-center"><Loader type="Bars" color="#00BFFF" height={30} width={80} /></div>
            }
            <Breadcrumb />
            <PageList projects={projects} />

            <Link to={`/dashboard/page/create`} className="btn btn-primary">Create New Page...</Link>
            <Statistics />
            <h1 className="p-2">List of available Pages: </h1>
            <CardColumns>
                {projects && projects.map((project, index) => (
                    <Card key={project.slug} className={`border-${project.published?"success":"danger"} m-1`}>
                        <Card.Header as="h2" className={`bg-${project.published?"success":"danger"} text-white`}>
                            {project.title}
                        </Card.Header>
                        <Card.Body>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th>Project Template Code</th>
                                        <td>{project.selectedTemplate}</td>
                                    </tr>
                                    <tr>
                                        <th>Airtable API Key</th>
                                        <td>{project.apiKey}</td>
                                    </tr>
                                    <tr>
                                        <th>Airtable Base ID</th>
                                        <td>{project.baseId}</td>
                                    </tr>
                                    <tr>
                                        <th>Airtable Table Name</th>
                                        <td>{project.tableName}</td>
                                    </tr>
                                    <tr>
                                        <th>Airtable View Name</th>
                                        <td>{project.viewName}</td>
                                    </tr>
                                    <tr>
                                        <th>Is Page Published ?</th>
                                        <td>
                                            {project.published &&
                                                <>
                                                    <label className="text-success">true</label>
                                                    <Button variant="primary" className="btn-sm ml-3" onClick={() => { changePagePublishState(project.slug, false) }}>
                                                        UnPublish Now
                                                    </Button>
                                                </>
                                            }
                                            {!project.published &&
                                                <>
                                                    <label className="text-danger">false</label>
                                                    <Button variant="primary" className="btn-sm ml-3" onClick={() => { changePagePublishState(project.slug, true) }}>
                                                        Publish Now
                                                    </Button>
                                                </>
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Card.Body>
                        <Card.Footer>
                            <table className="w-100">
                                <tbody>
                                    <tr>
                                        <td className="w-50">
                                            <Link to={`/public/${user.uid}/project/${project.slug}`} target="_blank">View Public URL... </Link>
                                        </td>
                                        <td className="float-right">
                                            <button className="border-0 p-0" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteProject(project.slug) }}>
                                                <RiDeleteBinLine size="20" className="text-danger" />
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Card.Footer>
                    </Card>
                ))}
            </CardColumns>
            {!loading && projects.length <= 0 &&
                <Alert variant="info">
                    <Alert.Heading>No Pages Found OR Page list is loading !!</Alert.Heading>
                    <p>You can create new page from button above.</p>
                </Alert>
            }
        </>
    )
}

export default Projects
