import React from "react"
import { Avatar, Pill, toaster, Pane, Heading, Text, Button, Badge } from "evergreen-ui"
import { navigate } from "gatsby"
import _ from 'lodash'

const PageList = ({ projects }) => {

    let bgColors = ["id_170", "id_174", "id_177", "id_173", "id_175", "id_171"]
    //bgColors = [];
    let start = "170"
    _.times(20, () => {
        //bgColors.push("id_"+(start++));
    });

    return (
        <div className="row">
            {projects && projects.map((project, index) => (
                <div className="col col5" key={index}>
                    <div className="dashboard_box text-center">
                        <a href="javascript:void(0)" onClick={() => navigate("/dashboard/page/details", { state: { pageDetails: project } })}>
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
                    <a href="/dashboard/page/select">
                        <Avatar name="+" color="neutral" size={100} />
                        <h3>Add a Site</h3>
                    </a>
                </div>
            </div>            
        </div>
    );
}

export default PageList;