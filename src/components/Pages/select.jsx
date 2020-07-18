import React from "react"
import { navigate } from "gatsby"
import firebase from "gatsby-plugin-firebase"
import Loader from 'react-loader-spinner'
import { Card } from 'react-bootstrap'
import { IconButton, toaster, Pane, Heading, Text, Button, Pill } from "evergreen-ui"
import _ from 'lodash'

const TemplateSelect = ({ location }) => {

    const [loading, setLoading] = React.useState(true);
    const [templates, setTemplates] = React.useState([]);

    React.useEffect(() => {
        if (loading && !templates.length) {
            firebase
                .database()
                .ref(`templates`)
                .once("value")
                .then(snapshot => {
                    const publishedTemplates = _.filter(snapshot.val(), ( item ) => item.published == "true")
                    setTemplates(publishedTemplates);                    
                    setLoading(false);
                    console.log(templates);
                }); //end of loading of all templates            
        }
    }, [loading, templates])

    return (
        <>
            {loading &&
                <div className="text-center"><Loader type="Bars" color="#00BFFF" height={30} width={80} /></div>
            }
            <div className="container m-2">
                <div className="row">
                    {templates && Object.values(templates).map((item,index) => (
                        <div className="col-lg-4 mb-3" key={index}>
                            <Card>
                                <Card.Img variant="top" height="280px" style={{ objectFit: 'cover' }} src={`/images/${item.id}.png`} />
                                <Card.Body>
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Subtitle>{item.description}</Card.Subtitle>
                                    <Button height={32} marginTop={10} marginRight={16} iconBefore="applications" appearance="primary" intent="success" onClick={() => navigate("/dashboard/page/create", { state: { template: item } })}>
                                        Select
                                    </Button>
                                    <Button height={32} iconAfter="share" onClick={() => { window.open(item.demoURL, '_blank') }}>
                                        Demo
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default TemplateSelect
