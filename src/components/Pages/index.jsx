import React from "react"
import { useState } from "react"
import { getUser, getUserExtras, getUserType } from "../../utils/auth"
import { refreshUserExtras } from "../../utils/firebaseHelpers"
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
        if (loading && (!userExtras || !userExtras.projects)) {
            refreshUserExtras(user);            
            setTimeout(function () { //this is done so that userextras get loaded properly
                userExtras = getUserExtras();
                if (userExtras && userExtras.projects) {
                    setProjects(Object.values(userExtras.projects));
                }
                setLoading(false);
            }, 3000);
        }
        if (loading && !projects.length && userExtras && userExtras.projects) {
            setProjects(Object.values(userExtras.projects));
            setLoading(false);
        }
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
