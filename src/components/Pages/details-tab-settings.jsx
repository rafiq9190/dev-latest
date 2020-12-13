import React from "react"
import _ from 'lodash'
import { navigate } from "gatsby"
import { getUser, getUserExtras, getUserType } from "../../utils/auth"
import { refreshUserExtras } from "../../utils/firebaseHelpers"
import firebase from "gatsby-plugin-firebase"
import { Helmet } from 'react-helmet';
import { Alert, IconButton, toaster, Pane, Heading, Text, TextInputField, FilePicker, Button, Switch } from "evergreen-ui"
import Loader from 'react-loader-spinner'
import { CloudinaryContext } from "cloudinary-react";
import { openUploadWidget } from "../../utils/cloudinaryService"


const PageDetailsTabSettings = ({ pageDetails }) => {

    const user = getUser();

    const cloudinaryAccountName = "hyperlyst";
    const cloudinaryUploadPreset = "user_settings_uploads";

    //settings
    const settingsData = pageDetails.data && pageDetails.data.settings ? pageDetails.data.settings : [];
    const [settingsProcessing, setSettingsProcessing] = React.useState(false);
    const [settingsSiteTitle, setSettingsSiteTitle] = React.useState(settingsData.settingsSiteTitle || "");
    const [settingsSiteSubTitle, setSettingsSiteSubTitle] = React.useState(settingsData.settingsSiteSubTitle || "");
    const [settingsExternalURL, setSettingsExternalURL] = React.useState(settingsData.settingsExternalURL || "");
    const [settingsPrimaryColor, setSettingsPrimaryColor] = React.useState(settingsData.settingsPrimaryColor || "");
    const [settingsFonts, setSettingsFonts] = React.useState(settingsData.settingsFonts || "");
    const [settingsMetaDescription, setSettingsMetaDescription] = React.useState(settingsData.settingsMetaDescription || "");
    const [settingsMetaKeywords, setSettingsMetaKeywords] = React.useState(settingsData.settingsMetaKeywords || "");
    const [settingsLogoImage, setSettingsLogoImage] = React.useState(settingsData.settingsLogoImage || "");
    const [settingsLogoImageThumbnail, setSettingsLogoImageThumbnail] = React.useState(settingsData.settingsLogoImageThumbnail || "");
    const [settingsHeroTitle, setSettingsHeroTitle] = React.useState(settingsData.settingsHeroTitle || "");
    const [settingsHeroDescription, setSettingsHeroDescription] = React.useState(settingsData.settingsHeroDescription || "");
    const [settingsHeroImage, setSettingsHeroImage] = React.useState(settingsData.settingsHeroImage || "");
    const [settingsHeroImageThumbnail, setSettingsHeroImageThumbnail] = React.useState(settingsData.settingsHeroImageThumbnail || "");

    const beginImageUpload = (tag) => {
        const uploadOptions = {
            cloudName: cloudinaryAccountName,
            tags: [tag],
            uploadPreset: cloudinaryUploadPreset
        };

        openUploadWidget(uploadOptions, (error, photos) => {
            if (!error) {
                if (photos.event === 'success') {
                    console.log("********************* After " + tag + " Upload")
                    console.log(photos)
                    if (tag == "logoImage") {
                        setSettingsLogoImage(photos.info.url)
                        setSettingsLogoImageThumbnail(photos.info.thumbnail_url)
                    }
                    else if (tag == "heroImage") {
                        setSettingsHeroImage(photos.info.url)
                        setSettingsHeroImageThumbnail(photos.info.thumbnail_url)
                    }
                }
            } else {
                console.log("Error while uploading - " + tag);
                console.error(error)
            }
        })
    }

    const saveSettings = (slug) => {
        toaster.closeAll()
        setSettingsProcessing(true)

        const settingsData = {
            settingsSiteTitle,
            settingsSiteSubTitle,
            settingsExternalURL,
            settingsPrimaryColor,
            settingsFonts,
            settingsMetaDescription,
            settingsMetaKeywords,
            settingsLogoImage,
            settingsLogoImageThumbnail,
            settingsHeroTitle,
            settingsHeroDescription,
            settingsHeroImage,
            settingsHeroImageThumbnail,
        }

        firebase
            .database()
            .ref()
            .child(`users/${user.uid}/projects/${slug}/data/settings`)
            .set(settingsData)
            .then(() => { refreshUserExtras(user); })
            .then(() => { setSettingsProcessing(false) })
            .then(() => { toaster.success('Settings Saved Successfully. You will be redirected to Dashboard in 5 seconds') })
            .then(() => { setTimeout(function () { navigate(`/dashboard/`, { replace: true }) }, 5000); })
    };
    
    return (
        <CloudinaryContext cloudName={cloudinaryAccountName}>
            <Helmet>
                <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript" />
            </Helmet>
            <Pane margin={10}>
                <Heading size={600} marginBottom={10}>Manage site settings here</Heading>
                <Button height={24} iconBefore="floppy-disk" appearance="primary" onClick={() => { saveSettings(pageDetails.slug) }}>
                    Save Changes
                {settingsProcessing && <Loader type="Bars" color="#FFF" height={16} width={24} />}
                </Button>
                <Pane padding={20} marginTop={10} background="tint2" borderRadius={3} elevation={4}>
                    <TextInputField
                        label="Site Title"
                        placeholder="Enter title for the site"
                        value={settingsSiteTitle}
                        onChange={e => setSettingsSiteTitle(e.target.value)}
                        hint=""
                    />
                    <TextInputField
                        label="Site Subtitle"
                        placeholder="Enter subtitle of the site"
                        value={settingsSiteSubTitle}
                        onChange={e => setSettingsSiteSubTitle(e.target.value)}
                        hint=""
                    />
                    <TextInputField
                        label="External URL"
                        placeholder="Enter the External URL"
                        value={settingsExternalURL}
                        onChange={e => setSettingsExternalURL(e.target.value)}
                        hint="The settings will help if the site points to any External URL (if required)"
                    />
                    <TextInputField
                        label="Primary color"
                        placeholder="Enter primary color of the site"
                        value={settingsPrimaryColor}
                        onChange={e => setSettingsPrimaryColor(e.target.value)}
                        hint="eg. #3b4e5c"
                    />
                    <TextInputField
                        label="Fonts"
                        placeholder="Enter font family"
                        value={settingsFonts}
                        onChange={e => setSettingsFonts(e.target.value)}
                        hint=""
                    />
                    <TextInputField
                        label="Meta Description"
                        placeholder="Enter meta description of the site"
                        value={settingsMetaDescription}
                        onChange={e => setSettingsMetaDescription(e.target.value)}
                        hint="For SEO"
                    />
                    <TextInputField
                        label="Meta Keywords"
                        placeholder="Enter meta keywords of the site"
                        value={settingsMetaKeywords}
                        onChange={e => setSettingsMetaKeywords(e.target.value)}
                        hint="For SEO"
                    />
                    <Pane marginBottom={20}>
                        <Heading size={400} marginBottom={5}>Logo Image</Heading>
                        <Button height={24} marginRight={15} iconBefore="camera" onClick={() => beginImageUpload("logoImage")}>
                            Select logo image
                                            </Button>
                        <img src={settingsLogoImageThumbnail} />
                    </Pane>
                    <TextInputField
                        label="Hero Title"
                        placeholder="Enter title of the hero section"
                        value={settingsHeroTitle}
                        onChange={e => setSettingsHeroTitle(e.target.value)}
                        hint=""
                    />
                    <TextInputField
                        label="Hero Description"
                        placeholder="Enter description of the hero section"
                        value={settingsHeroDescription}
                        onChange={e => setSettingsHeroDescription(e.target.value)}
                        hint=""
                    />
                    {pageDetails.selectedTemplate != "template_005_intercom" &&
                        <Pane marginBottom={20}>
                            <Heading size={400} marginBottom={5}>Hero Image</Heading>
                            <Button height={24} marginRight={15} iconBefore="camera" onClick={() => beginImageUpload("heroImage")}>
                                Select hero image
                        </Button>
                            <img src={settingsHeroImageThumbnail} />
                        </Pane>
                    }
                </Pane>
            </Pane>
        </CloudinaryContext>
    )
}

export default PageDetailsTabSettings;