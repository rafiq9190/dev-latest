
export const isBrowser = () => typeof window !== "undefined"

export const getUser = () =>
  isBrowser() && window.localStorage.getItem("user")
    ? JSON.parse(window.localStorage.getItem("user"))
    : {}

export const setUser = user =>
  isBrowser() && window.localStorage.setItem("user", JSON.stringify(user))

export const getUserExtras = () =>
  isBrowser() && window.localStorage.getItem("userextras")
    ? JSON.parse(window.localStorage.getItem("userextras"))
    : {}

export const setUserExtras = user =>
  isBrowser() && window.localStorage.setItem("userextras", JSON.stringify(user))


export const isLoggedIn = () => {
  const user = getUser()
  return !!user.email
}

export const getUserType = () => {
  const userExtras = getUserExtras()
  let userType = "free";
  if(userExtras && userExtras.subscription && userExtras.subscription.license && userExtras.subscription.license.purchase){
    let checkPassed = true;
    //checking if product id is correct    
    if(userExtras.subscription.license.purchase.product_id && userExtras.subscription.license.purchase.product_id==="6wQEQAPjjNzLjrj04W9jmA==") {
      //console.log("+++++++ product_id = "+userExtras.subscription.license.purchase.product_id)
      checkPassed = checkPassed && true;
      //console.log("*** "+checkPassed)
    }
    //checking if the subscription is not cancelled
    if(userExtras.subscription.license.purchase.subscription_cancelled_at) {
      //console.log("+++++++ subscription_cancelled_at = "+userExtras.subscription.license.purchase.subscription_cancelled_at)
      checkPassed = checkPassed && false;
      //console.log("*** "+checkPassed)
    }
    //checking if the monthly cycle has ended
    /*
    if(userExtras.subscription.license.purchase.sale_timestamp) {      
      let saleDate = new Date(userExtras.subscription.license.purchase.sale_timestamp);
      let oneMonth = new Date(saleDate.setMonth(saleDate.getMonth()+1));
      //console.log("+++++++ sale_timestamp = "+userExtras.subscription.license.purchase.sale_timestamp)
      checkPassed = checkPassed && (oneMonth >= new Date());
      //console.log("*** "+checkPassed)
    }
    */
    if(checkPassed) {
      userType = "pro";
    }
  }
  return userType;
}

export const logout = (firebase) => {
  return new Promise(resolve => {
    firebase.auth().signOut().then(function() {
      setUser({});
      setUserExtras({});
      resolve();
    });
  })
}