import React from "react"
import { useState } from "react"
import { getUser, getUserExtras, getUserType } from "../../utils/auth"
import Loader from 'react-loader-spinner'
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

    React.useEffect(() => {
        if (loading && !projects.length && userExtras && userExtras.projects) {
            setProjects(Object.values(userExtras.projects));
        }
        setLoading(false);
    }, [loading, projects])

    return (
        <>
            {loading &&
                <div className="text-center"><Loader type="Bars" color="#00BFFF" height={30} width={80} /></div>
            }
            <Breadcrumb />
            <Statistics />
            <PageList projects={projects} />
        </>
    )
}

export default Projects
