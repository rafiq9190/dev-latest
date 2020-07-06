import React from "react"
import { getUser, getUserExtras, getUserType } from "../utils/auth"
import { refreshUserExtras } from "../utils/firebaseHelpers"
import { Form } from 'react-bootstrap';
import firebase from "gatsby-plugin-firebase"
import { toaster, Alert, Heading, Pane, Text } from "evergreen-ui"
import Loader from 'react-loader-spinner'
import NetlifyAPI from 'netlify'

const CustomDomain = () => {
  const user = getUser();
  const userExtras = getUserExtras();
  const plan = getUserType();
  const { email } = user;

  const [validated, setValidated] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [newCustomDomain, setNewCustomDomain] = React.useState("");
  const [netlifySite, setNetlifySite] = React.useState();
  const [existingDomains, setExistingDomains] = React.useState();

  React.useEffect(() => {
    console.log("**** useEffect")
    console.log(netlifySite)
    console.log(existingDomains)
    if (!netlifySite && !existingDomains) {
      initializeNetlifyData();
    }
  }, [netlifySite, existingDomains])

  async function initializeNetlifyData() {
    const client = new NetlifyAPI(process.env.GATSBY_NETLIFY_API_TOKEN)
    const sites = await client.listSites();
    sites.map((site) => {
      if (site.custom_domain === process.env.GATSBY_NETLIFY_SITE_DOMAIN) {
        setNetlifySite(site);
        setExistingDomains(site.domain_aliases);
      }
    });
  }

  async function addDomainToNetlifySite() {
    const client = new NetlifyAPI(process.env.GATSBY_NETLIFY_API_TOKEN)
    try {
      await client.updateSite({
        site_id: netlifySite.site_id,
        body: {
          "domain_aliases": [
            newCustomDomain
          ]
        }
      })
      console.log("Domain successfully added to Netlify")
      //now save custom domain to firebase
      addDomainToFirebase()
    } catch (e) {
      console.error(e)
      toaster.danger('Error while adding Custom Domain to your site. Please try later.')
    }
  }

  function addDomainToFirebase() {
    firebase
      .database()
      .ref()
      .child(`users/${user.uid}/custom_domain`)
      .set(newCustomDomain)
      .then(() => { refreshUserExtras(user); })
      .then(() => { toaster.success('Custom Domain added successfully. Page will reload in 5 seconds to refresh the data') })
      .then(() => { setTimeout(function () { setProcessing(false); window.location.reload(); }, 5000); })
  }

  function handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    if (form.checkValidity()) {
      //check if the user is paid user
      setProcessing(true);
      if (plan && plan === "free") {
        toaster.danger("This feature is available only to our Paid Customers. Please upgrade to avail this feature.", { id: 'toaster' });
        setProcessing(false);
        return;
      }
      //check if user already has configured custom domain (this check is on firebase)
      if (userExtras.custom_domain) {
        toaster.danger("You have already configured the custom domain ['" + userExtras.custom_domain + "'] for this account.", { id: 'toaster' });
        setProcessing(false);
        return;
      }

      //check if the supplied domain is already added to this site (this check is on netlify)
      if (existingDomains && existingDomains.indexOf(newCustomDomain) >= 0) {
        toaster.danger("Sorry this domain ['" + newCustomDomain + "'] is already used. Please configure some other custom domain.", { id: 'toaster' });
        setProcessing(false);
        return;
      }
      //add domain alias to netlify
      addDomainToNetlifySite();
    }
  };

  return (
    <div className="container w-100 mx-auto">
      <div className="row">
        <div className="col-lg-2">&nbsp;</div>
        <div className="col-lg-8 bg-light p-4">
          <h2>Custom Domain Configuration Service</h2>
          {plan && plan === "free" &&
            <Alert
              intent="danger"
              title="Paid Customer Feature"
            >
              This feature is available only to our Paid Customers. Please upgrade to avail this feature.
            </Alert>
          }

          {plan && plan !== "free" && userExtras.custom_domain &&
            <>
              <Alert
                intent="none"
                title="Custom Domain Exists"
              >
                You have already configured the custom domain ['{userExtras.custom_domain}'] for this account.
              </Alert>
              <Pane display="flex" flexDirection="column" marginTop={20} padding={10} background="tealTint" borderRadius={3} elevation={4}>
                <Heading size={600} marginBottom={15}>DNS Configuration<span>*</span></Heading>
                <Heading size={500} marginBottom={10}>Point testcustom1 CNAME record to hyperlyst-sites.netlify.app</Heading>
                <Text size={400} marginBottom={10}>Log in to the account you have with your DNS provider, and add a CNAME record for testcustom1 pointing to hyperlyst-sites.netlify.app.</Text>
                <kbd className="p-3">testcustom1 CNAME hyperlyst-sites.netlify.app.</kbd>
                <Text size={400} marginBottom={10} marginTop={10}>If you’ve already done this, allow up to 24 hours for the changes to propagate.</Text>
                <Text size={300} className="text-primary">* Completion of this step is very important else your pages wont be accessible via your custom domain</Text>
              </Pane>
            </>
          }

          {plan && plan !== "free" && !userExtras.custom_domain &&
            <div>
              <h5 className="mt-3 mb-1">Your Email</h5>
              <div className="p-2 bg-white">{`${email}`}</div>
              <h5 className="mt-3 mb-1">Enter your domain url here</h5>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Control
                  type="text"
                  placeholder="www.????????????.com"
                  onChange={({ target: { value } }) => {
                    setNewCustomDomain(value);
                  }}
                  required
                />
                <button type="submit" className="btn btn-info mt-3">
                  Add Domain
                  {processing && <Loader type="Bars" color="#FFF" className="d-inline" height={16} width={24} />}
                </button>
              </Form>
            </div>
          }
        </div>
        <div className="col-lg-2">&nbsp;</div>
      </div>
    </div>
  )
}

export default CustomDomain
