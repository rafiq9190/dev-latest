import React from "react"
import { Link } from "gatsby"
import { useState } from "react"
import Select from "react-select"
import { navigate } from "@reach/router"
import { getUser, getUserExtras, getUserType } from "../../utils/auth"
import { refreshUserExtras } from "../../utils/firebaseHelpers"
import firebase from "gatsby-plugin-firebase"
import _ from "lodash"
import Loader from 'react-loader-spinner'
import { Alert, Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import styled from "styled-components"

const NumberedList = styled.ol`
  list-style: decimal;
`
const FormTitle = styled.h1`
    font-size: 1.5rem;
    font-color: white;
`

const HelpTitle = styled.h1`
    font-size: 1.75rem;
`

const ProjectCreate = ({ location }) => {
    const user = getUser();
    const userExtras = getUserExtras();
    const plan = getUserType();
    
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState();
    const [validated, setValidated] = React.useState(false);

    const [templates, setTemplates] = useState([]);
    const [options, setOptions] = useState([]);

    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [mandatoryFields, setMandatoryFields] = useState("");
    const [airtableBaseCopy, setAirtableBaseCopy] = useState("#");

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [baseId, setBaseId] = useState("");
    const [tableName, setTableName] = useState("");
    const [viewName, setViewName] = useState("");

    const { state = {} } = location

    const mode = "create";

    React.useEffect(() => {
        if (loading && !templates.length) {
            firebase
                .database()
                .ref(`templates`)
                .once("value")
                .then(snapshot => {
                    const snapshotVal = snapshot.val();
                    //console.log(snapshot.val())
                    //console.log(Object.values(snapshotVal))
                    //console.log(Object.keys(snapshotVal))
                    Object.values(snapshotVal).map((item) => {
                        console.log(item);
                        if (_.findIndex(options, { 'value': item.id }) < 0) {
                            options.push({ label: item.name, value: item.id });
                        }
                    });
                    //let dropDownEle = { label: element["title"], value: element };
                    //options1.push(dropDownEle);

                    setTemplates(snapshotVal);
                    setLoading(false);
                    console.log(templates);
                }); //end of loading of all templates            
        }
    }, [loading, templates])

    function handleSelectOnchange(e) {
        console.log("****** selected on change = " + e.value)
        const selection = _.find(Object.values(templates), { 'id': e.value });
        console.log(selection)
        if (selection) {
            setSelectedTemplate(e.value);
            setMandatoryFields(selection.mandatoryFields);
            setAirtableBaseCopy(selection.airtableBaseCopy);
        }
        console.log("****** selectedTemplate = " + selectedTemplate)
    }

    function handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);

        if (!selectedTemplate || !title || !slug || !apiKey || !baseId || !tableName || !viewName) {
            setError("Please enter details for all mandatory fields")
            return;
        }

        //check if the page with new slug already exists for this user
        if (userExtras && userExtras.projects && userExtras.projects[`${slug}`]) {
            setError("Page with this slug '" + slug + "' already exists")
            return;
        }

        if (form.checkValidity()) {
            const newProject = {
                selectedTemplate,
                title,
                slug,
                apiKey,
                baseId,
                tableName,
                viewName
            };

            console.log("*********** createproject")
            console.log(newProject)
            console.log(`users/${user.uid}/projects/${slug}`)
            firebase
                .database()
                .ref()
                .child(`users/${user.uid}/projects/${slug}`)
                .set(newProject)
                .then(() => { refreshUserExtras(user); navigate(`/`) });
        }

    }

    return (
        <>
            {loading &&
                <div className="text-center"><Loader type="Bars" color="#00BFFF" height={30} width={80} /></div>
            }
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-header bg-primary text-white">
                                <FormTitle>Create Page!</FormTitle>
                                <p> Input details of your Airtable project. All fields are mandatory.</p>
                            </div>
                            <div className="card-body">
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <fieldset className="border p-3">
                                        <legend className="font-bold">Template Selection</legend>
                                        <div>
                                            <label className="py-2">
                                                Select Template to be used
                                            </label>
                                            <Select
                                                name="templateselect"
                                                options={options}
                                                onChange={handleSelectOnchange}
                                            />
                                        </div>
                                        <div className="pt-2">
                                            <label className="py-2">
                                                Default mandatory columns of the template
                                            </label>
                                            <input
                                                className="w-100 p-2"
                                                id="defaultcolumns"
                                                value={mandatoryFields}
                                                onChange={({ target: { value } }) => {
                                                    setMandatoryFields(value);
                                                }}
                                                disabled
                                            />
                                        </div>
                                        <div className="pt-2">
                                            <label className="py-2">
                                                Use below button to Copy Template's Airtable Base
                                            </label>
                                            <div>
                                                <OverlayTrigger key="copybase" placement="top" overlay={<Tooltip id="copybase">Refer <strong>Help Item#1</strong> for more details</Tooltip>}>
                                                    <a href={airtableBaseCopy} target="_blank" rel="noreferrer" className="btn btn-primary">
                                                        Copy Template Base
                                                </a>
                                                </OverlayTrigger>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <div className="form-group">
                                        <Form.Control
                                            className="p-2 mt-3"
                                            id="title"
                                            placeholder="Page Title"
                                            type="text"
                                            value={title}
                                            required
                                            onChange={({ target: { value } }) => {
                                                setTitle(value);
                                                setSlug(_.kebabCase(value));
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            className="form-control p-2 mt-3"
                                            id="slug"
                                            placeholder="Page Slug"
                                            type="text"
                                            value={slug}
                                            required
                                            disabled
                                            onChange={({ target: { value } }) => {
                                                setSlug(value);
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            className="form-control p-2 mt-3"
                                            id="apikey"
                                            placeholder="Airtable API Key"
                                            type="text"
                                            value={apiKey}
                                            required
                                            onChange={({ target: { value } }) => {
                                                setApiKey(value);
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <OverlayTrigger key="baseid" placement="top" overlay={<Tooltip id="baseid">Refer <strong>Help Item#2</strong> for more details on getting Airtable Base ID</Tooltip>}>
                                            <input
                                                className="form-control p-2 mt-3"
                                                id="apikey"
                                                placeholder="Airtable Base ID"
                                                type="text"
                                                value={baseId}
                                                required
                                                onChange={({ target: { value } }) => {
                                                    setBaseId(value);
                                                }}
                                            />
                                        </OverlayTrigger>
                                    </div>
                                    <div className="form-group">
                                        <OverlayTrigger key="copybase" placement="top" overlay={<Tooltip id="copybase">Refer <strong>Help Item#3</strong> for more details on getting Airtable Table Name</Tooltip>}>
                                            <input
                                                className="form-control p-2 mt-3"
                                                id="apikey"
                                                placeholder="Airtable Table Name"
                                                type="text"
                                                value={tableName}
                                                required
                                                onChange={({ target: { value } }) => {
                                                    setTableName(value);
                                                }}
                                            />
                                        </OverlayTrigger>
                                    </div>
                                    <div className="form-group">
                                        <OverlayTrigger key="copybase" placement="top" overlay={<Tooltip id="copybase">Refer <strong>Help Item#3</strong> for more details on getting Airtable View Name</Tooltip>}>
                                            <input
                                                className="form-control p-2 mt-3"
                                                id="apikey"
                                                placeholder="Airtable View Name e.g. Grid view"
                                                type="text"
                                                value={viewName}
                                                required
                                                onChange={({ target: { value } }) => {
                                                    setViewName(value);
                                                }}
                                            />
                                        </OverlayTrigger>
                                    </div>
                                    <div className="mx-auto">
                                        <input type="submit" value={`Create Project`} className="btn btn-primary" />
                                    </div>
                                    {error && error.length > 0 &&
                                        <div className="mx-auto m-2">
                                            <Alert variant="danger">{error}</Alert>
                                        </div>
                                    }
                                </Form>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <HelpTitle>Page Create Help</HelpTitle>
                        <NumberedList>
                            <li className="pt-3">
                                Clicking "Copy Template Base" will open a new browser tab.
                                Switch to the newly opend tab and click on "Copy base" (in the upper right corner) to copy it to your Airtable account.
                                <br /><img src="/images/copy-base-example.png" width="100%" />
                            </li>
                            <li className="pt-3">
                                To find your Airtable Base ID, go to https://airtable.com/api/. Then Click on your base and copy the ID from the URL.
                                <br /><img src="/images/get-baseid-example.png" width="100%" />
                            </li>
                            <li className="pt-3">
                                Go to the actual Base in Airtable and get <i>TableName</i> and <i>ViewName</i> as mentioned in below screenshot
                                <br /><img src="/images/get-table-view-example.png" width="100%" />
                            </li>
                        </NumberedList>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProjectCreate
