import React from "react"
import { Card } from "react-bootstrap"
import { getUserExtras } from "../../utils/auth"
import _ from 'lodash'

const Statistics = () => {
    const userExtras = getUserExtras();
    const projectCount = (userExtras && userExtras.projects) ? Object.keys(userExtras.projects).length : 0;
    const publishedCount = (userExtras && userExtras.projects) ? _.filter(userExtras.projects, { published: true }).length : 0;

    return (
        <div className="row m-3">
            <div className="col-lg-6">
                <Card border="warning" className="text-center">
                    <Card.Body>
                        <Card.Title>Total Pages</Card.Title>
                        <Card.Text>
                            {projectCount}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
            <div className="col-lg-6">
                <Card border="success" className="text-center">
                    <Card.Body>
                        <Card.Title>Published Pages</Card.Title>
                        <Card.Text>
                            {publishedCount}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

export default Statistics
