import React from "react"
import Statistics from "./Statistics"
import { getUser, getUserExtras, getUserType } from "../utils/auth"
import { refreshUserExtras } from "../utils/firebaseHelpers"
import firebase from "gatsby-plugin-firebase"
import { Helmet } from 'react-helmet';
import { navigate } from "gatsby"
import { toaster } from "evergreen-ui"
import Loader from 'react-loader-spinner'

const Profile = () => {
  const user = getUser();
  const userExtras = getUserExtras();
  let subscriptionEndDate;
  if (userExtras.subscription && userExtras.subscription.license && userExtras.subscription.license.purchase && userExtras.subscription.license.purchase.sale_timestamp) {
    let saleDate = new Date(userExtras.subscription.license.purchase.sale_timestamp);
    subscriptionEndDate = new Date(saleDate.setMonth(saleDate.getMonth() + 1));
  }
  const plan = getUserType();
  const { email, emailVerified } = user;
  const displayName = user.displayName ? user.displayName : "Name not captured";

  const [processing, setProcessing] = React.useState(false);

  const removeCustomDomain = () => {
      firebase
        .database()
        .ref()
        .child(`users/${user.uid}/custom_domain`)
        .remove()
        .then(() => { refreshUserExtras(user); console.log('Custom domain removed'); })
        .then(() => { toaster.warning("Custom domain removed successfully.", { id: "page-unpublish" }) })
  };

  const unpublishAllPages = () => {
    Object.values(userExtras.projects).map((project) => {
      firebase
        .database()
        .ref()
        .child(`users/${user.uid}/projects/${project.slug}/published`)
        .set(false)
        .then(() => { refreshUserExtras(user); console.log('Unpublised = ' + project.slug); })
        .then(() => { toaster.warning("'" + project.slug + "' page unpublished successfully.", { id: "page-unpublish" }) })
    })
  };

  const removeUserManagement = () => {
    Object.values(userExtras.projects).map((project) => {
      firebase
        .database()
        .ref()
        .child(`users/${user.uid}/projects/${project.slug}/usermanagement`)
        .set(false)
        .then(() => { refreshUserExtras(user); console.log('User Management Removed for = ' + project.slug); })
        .then(() => { toaster.warning("User Management Removed successfully.", { id: "page-unpublish" }) })
    })
  };

  const cancelSubscription = () => {
    setProcessing(true);
    removeCustomDomain();
    removeUserManagement();
    unpublishAllPages();
    firebase
      .database()
      .ref()
      .child(`users/${user.uid}/subscription`)
      .remove()
      .then(() => { refreshUserExtras(user); })
      .then(() => { toaster.success('Subscription cancelled successfully. You will be redirected to Dashboard in 5 seconds') })
      .then(() => { setTimeout(function () { setProcessing(false); navigate(`/dashboard/`, { replace: true }) }, 5000); })
  };

  return (
    <div className="container w-100 mx-auto">
      <Helmet>
        <script src="https://gumroad.com/js/gumroad.js"></script>
      </Helmet>
      <div className="row">
        <div className="col-lg-3">&nbsp;</div>
        <div className="col-lg-6 bg-light p-4">
          <Statistics />
          <h1>Your Profile</h1>
          <h5 className="mt-3 mb-1">Name</h5>
          <div className="p-2 bg-white">{`${displayName}`}</div>
          <h5 className="mt-3 mb-1">Email</h5>
          <div className="p-2 bg-white">{`${email}`}</div>
          <h5 className="mt-3 mb-1">Email Verified</h5>
          <div className="p-2 bg-white">{`${emailVerified}`}</div>
          <h5 className="mt-3 mb-1">Custom Domain</h5>
          <div className="p-2 bg-white">{`${userExtras.custom_domain}`}</div>
          <h5 className="mt-3 mb-1">Plan</h5>
          <div className="p-2 bg-white">{`${plan}`}</div>
          {plan && plan === "free" &&
            <div className="py-3">
              <a className="btn btn-success btn-sm" href="https://gum.co/WHvhf?wanted=true" target="_blank" data-gumroad-single-product="true">Subscribe with us</a>
            </div>
          }
          {plan && plan !== "free" &&
            <>
              <h5 className="mt-3 mb-1">Subscription till</h5>
              <div className="p-2 bg-white">{`${subscriptionEndDate.toString()}`}</div>
              <div className="py-3">
                <button className="btn btn-danger btn-sm" onClick={() => { cancelSubscription() }}>
                  Cancel your subscription
                  {processing && <Loader type="Bars" color="#FFF" className="d-inline" height={16} width={24} />}
                </button>
              </div>
            </>
          }
        </div>
        <div className="col-lg-3">&nbsp;</div>
      </div>
    </div>
  )
}

export default Profile
