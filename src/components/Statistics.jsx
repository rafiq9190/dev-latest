import React from "react"
import { Badge, Pill } from "evergreen-ui"
import { getUserExtras } from "../utils/auth"
import _ from 'lodash'

const Statistics = () => {
    const userExtras = getUserExtras();
    const projectCount = (userExtras && userExtras.projects) ? Object.keys(userExtras.projects).length : 0;
    const publishedCount = (userExtras && userExtras.projects) ? _.filter(userExtras.projects, { published: true }).length : 0;

    return (
        <div style={{marginBottom:"25px"}}>
            <Badge color="blue">Total Pages</Badge>
            <Pill display="inline-flex" margin={8} color="blue" isSolid>{projectCount}</Pill>
            <Badge color="yellow">Published Pages</Badge>
            <Pill display="inline-flex" margin={8} color="yellow" isSolid>{publishedCount}</Pill>
        </div>
    )
}

export default Statistics
