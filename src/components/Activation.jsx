import React from "react"
import { getUser, getUserExtras, getUserType } from "../utils/auth"
import { refreshUserExtras } from "../utils/firebaseHelpers"
import { Form } from 'react-bootstrap';
import firebase from "gatsby-plugin-firebase"
import { navigate } from "gatsby"
import {toaster} from "evergreen-ui"
import axios from 'axios'
import Loader from 'react-loader-spinner'

const Activation = () => {
  const user = getUser();
  const userExtras = getUserExtras();
  let subscriptionEndDate;
  if(userExtras.subscription && userExtras.subscription.license && userExtras.subscription.license.purchase && userExtras.subscription.license.purchase.sale_timestamp) {
    let saleDate = new Date(userExtras.subscription.license.purchase.sale_timestamp);
    subscriptionEndDate = new Date(saleDate.setMonth(saleDate.getMonth()+1));    
  }
  const plan = getUserType();
  console.log("++++++++ plan = "+plan)
  const { email } = user;

  const [validated, setValidated] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);  
  const [key, setKey] = React.useState("");
  let license;

  async function getLicenseDetails() {
    const config = {
      method: 'post',
      url: '/.netlify/functions/validate',
      params: {
        "product_permalink": "WHvhf",
        "license_key": key
      },
      baseURL: 'https://hyperlyst-gumroad-license-validator.netlify.app',
    }
    try {
      // fetch data from a url endpoint
      const response = await axios(config);
      const data = await response.data;
      return data;
    } catch (error) {
      return false;
    }
  }

  function handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    if (form.checkValidity()) {      
      //check from gumroad if the supplied license key is valid or not
      setProcessing(true);
      getLicenseDetails().then(result => {
        license = result;
        console.log("******** license = ")
        console.log(license)
        if (!license || !license.success) {
          toaster.danger("License key is invalid. "+license.message,{id:'toaster'});
          setProcessing(false);
          return;
        }
        if(license && license.success){          
          toaster.success("License key is valid..........Now attaching it to the user",{id:'toaster'});
          firebase
            .database()
            .ref()
            .child(`users/${user.uid}/subscription`)
            .set({license})
            .then(() => { refreshUserExtras(user); })
            .then(() => { toaster.success('Subscription activated successfully. You will be redirected to Dashboard in 5 seconds') })
            .then(() => { setTimeout(function () { setProcessing(false); navigate(`/dashboard/`, { replace: true }) }, 5000); })
        }
      })
    }
  };

  return (
    <div className="container w-100 mx-auto">
      <div className="row">
        <div className="col-lg-2">&nbsp;</div>
        <div className="col-lg-8 bg-light p-4">
          <h1>Manage Activations</h1>
          {plan && plan !== "free" &&
            <h5>You are already having an active subscription till {subscriptionEndDate.toString()}</h5>
          }

          {plan && plan === "free" &&
            <div>
              <h5 className="mt-3 mb-1">Your Email</h5>
              <div className="p-2 bg-white">{`${email}`}</div>
              <h5 className="mt-3 mb-1">Enter your license key here</h5>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Control
                  type="text"
                  placeholder="xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx"
                  onChange={({ target: { value } }) => {
                    setKey(value);
                  }}
                  required
                />
                <button type="submit" className="btn btn-info mt-3">
                Activate
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

export default Activation
