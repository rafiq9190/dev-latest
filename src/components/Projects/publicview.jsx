import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import Airtable from 'airtable';
import firebase from "gatsby-plugin-firebase"
import Loader from 'react-loader-spinner'
import LayoutPublic from "../Layout/public"
import ProductHuntTemplate from './PublicTemplates/ProductHunt'
import BlogTemplate from './PublicTemplates/Blog'
import FeatureRequestTemplate from './PublicTemplates/FeatureRequest'
import { createGlobalStyle } from "styled-components"

// Global styles.
const GlobalStyles = createGlobalStyle`
  body {
    font-family: ${props => (props.fonts ? props.fonts : '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"')} !important;
  }
  .bg-primary, .btn-primary {
    background-color: ${props => (props.primarycolor ? props.primarycolor : "#008cba")} !important;
    border-color: ${props => (props.primarycolor ? props.primarycolor : "#008cba")} !important;
  }
  .icons-color {
    color: ${props => (props.primarycolor ? props.primarycolor : "#008cba")} !important;
  }
  .postStatus.planned {
    color: ${props => (props.primarycolor ? props.primarycolor : "#008cba")} !important;
  }
  .postVotes .upvote.voted {
    border-bottom: 9px solid ${props => (props.primarycolor ? props.primarycolor : "#008cba")} !important;
  }  
  .postVotes:hover .upvote.voted {
    border-bottom: 9px solid ${props => (props.primarycolor ? props.primarycolor : "#008cba")} !important;
  }
  
`

const ProjectPublicView = props => {

    const [records, setRecords] = useState([]);
    const [votes, setVotes] = useState([]);
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [template, setTemplate] = useState();
    const [airtableApiKey, setAirtableApiKey] = useState();
    const [airtableBaseId, setAirtableBaseId] = useState();
    const [settingsTitle, setSettingsTitle] = useState(title);
    const [settingsSubTitle, setSettingsSubTitle] = useState("");
    const [settingsMetaDescription, setSettingsMetaDescription] = useState("");
    const [settingsMetaKeywords, setSettingsMetaKeywords] = useState("");
    const [settingsPrimaryColor, setSettingsPrimaryColor] = useState();
    const [settingsFonts, setSettingsFonts] = useState();

    React.useEffect(() => {
        firebase
            .database()
            .ref(`users/${props.userid}/projects/${props.slug}`)
            .once("value")
            .then(snapshot => {
                const snapshotVal = snapshot.val();
                //console.log(snapshotVal)
                let viewName = "Grid view";
                if (!snapshotVal) { setError("ERROR: Unable to find this Page"); }
                else if (!snapshotVal || !snapshotVal.apiKey) { setError("ERROR: Unable to find 'API KEY' in Project Details"); }
                else if (!snapshotVal || !snapshotVal.baseId) { setError("ERROR: Unable to find 'BASE ID' in Project Details"); }
                else if (!snapshotVal || !snapshotVal.tableName) { setError("ERROR: Unable to find 'TABLE NAME' in Project Details"); }

                if (snapshotVal && !snapshotVal.published) { setError("ERROR: Unable to find this Page or Page is not published"); }

                if (snapshotVal && snapshotVal.viewName) { viewName = snapshotVal.viewName }
                if (snapshotVal && snapshotVal.selectedTemplate) { setTemplate(snapshotVal.selectedTemplate); }
                console.log("*** Template = " + template)
                if (error) { setLoading(false); }

                if (snapshotVal && snapshotVal.apiKey && snapshotVal.baseId && snapshotVal.tableName) {
                    setTitle(snapshotVal.title);

                    const base = new Airtable({ apiKey: snapshotVal.apiKey }).base(snapshotVal.baseId);
                    setAirtableApiKey(snapshotVal.apiKey)
                    setAirtableBaseId(snapshotVal.baseId)
                    base(snapshotVal.tableName).select({
                        view: viewName,
                        filterByFormula: '{IsPublished}=1'
                    }).eachPage(
                        (records, fetchNextPage) => {
                            setRecords(records);
                            console.log("***** Found '" + records.length + "' records from Airtable");
                            console.log(records)
                            fetchNextPage();
                        }
                    ).then(getVotesData());

                    //Get "Settings" from Airtable
                    base('Settings').select({
                        view: "Grid view"
                    }).eachPage(function page(records, fetchNextPage) {
                        records.forEach(function (record) {
                            let variable = record.get('setting');
                            let value = record.get('value');
                            console.log(record)
                            console.log("++++++" + variable + " = " + value)
                            if (variable === "title") {
                                setSettingsTitle(value);
                            } else if (variable === "subtitle") {
                                setSettingsSubTitle(value);
                            } else if (variable === "metadescription") {
                                setSettingsMetaDescription(value);
                            } else if (variable === "metakeywords") {
                                setSettingsMetaKeywords(value);
                            } else if (variable === "primarycolor") {
                                setSettingsPrimaryColor(value);
                            } else if (variable === "fonts") {
                                setSettingsFonts(value);
                            }
                            console.log("+++++++++++++++++");
                            console.log(settingsPrimaryColor);
                            console.log(settingsFonts);
                        });
                        fetchNextPage();
                    }, function done(err) {
                        if (err) { console.error("ERROR while fetching settings : " + err + ", So using default settings..."); return; }
                    });
                }
            }, [props.userid, props.slug]);
    }, [loading, template]);

    const getVotesData = () => {
        //getting votes data 
        firebase
            .database()
            .ref(`users/${props.userid}/projects/${props.slug}/votes`)
            .once("value")
            .then(snapshot => {
                const snapshotVal = snapshot.val();
                console.log("******* Votes data")
                console.log(snapshotVal)
                if (snapshotVal) setVotes(snapshotVal);
                setLoading(false);
            });
    };

    const likeHelperData = {
        userid: props.userid,
        slug: props.slug,
        votes: votes
    }

    return (
        <LayoutPublic title={settingsTitle} subtitle={settingsSubTitle}>
            <GlobalStyles fonts={settingsFonts} primarycolor={settingsPrimaryColor} />
            <Helmet
                title={`Hyper - ${settingsTitle}`}
                meta={[
                    {
                        name: `description`,
                        content: settingsMetaDescription,
                    },
                    {
                        name: `keywords`,
                        content: settingsMetaKeywords,
                    },
                    {
                        property: `og:title`,
                        content: settingsTitle,
                    },
                    {
                        property: `og:description`,
                        content: settingsMetaDescription,
                    },
                    {
                        property: `og:type`,
                        content: `website`,
                    },
                    {
                        name: `twitter:card`,
                        content: `summary`,
                    },
                    {
                        name: `twitter:title`,
                        content: settingsTitle,
                    },
                    {
                        name: `twitter:description`,
                        content: settingsMetaDescription,
                    },
                ]}
            >
                <link rel="stylesheet" href={`/templatecss/${template}.css`} />
            </Helmet>
            <div className="App">
                    {loading &&
                        <div className="text-center"><Loader type="Bars" color="#00BFFF" height={30} width={80} /></div>
                    }

                    {error &&
                        <Alert variant="danger">
                            <Alert.Heading>Error(s) Encountered:</Alert.Heading>
                            <p>{error}</p>
                            <hr />
                            <p className="mb-0">
                                Please contact administrator to rectify it and re-visit this page again
                        </p>
                        </Alert>
                    }

                    {!loading && !error && records.length > 0 && template === "template_002_producthunt" &&
                        <ProductHuntTemplate title={title} records={records} likeHelperData={likeHelperData} />
                    }

                    {!loading && !error && records.length > 0 && template === "template_001_blog" &&
                        <BlogTemplate title={title} records={records} likeHelperData={likeHelperData} />
                    }

                    {!loading && !error && records.length > 0 && template === "template_003_featurerequest" &&
                        <FeatureRequestTemplate title={title} records={records} likeHelperData={likeHelperData} airtableApiKey={airtableApiKey} airtableBaseId={airtableBaseId} />
                    }


                </div>
        </LayoutPublic>
    )
}

export default ProjectPublicView