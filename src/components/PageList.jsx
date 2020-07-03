import React from "react"
import { Avatar } from "evergreen-ui"

const PageList = ({projects}) => {

    return (
        <div className="row">
            {projects && projects.map((project, index) => (
                <div className="col col5">
                    <div className="dashboard_box text-center">
                        <a href="javascript:void(0)">
                            <Avatar name={project.title} isSolid size={100} />
                            <h3>{project.title}</h3>
                        </a>
                    </div>
                </div>

            ))}
            <div className="col col5">
                <div className="dashboard_box text-center">
                    <a href="/dashboard/page/create">
                        <Avatar name="+" color="neutral" size={100} />
                        <h3>Add a page</h3>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default PageList;