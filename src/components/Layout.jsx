import React from "react"
import { Helmet } from "react-helmet"
import Header from "./Header"
import ScrollupButton from "./ScrollupButton"
import Footer from "./Footer"

const Layout = ({ location, title, children }) => {

    return (
        <div>
            <Helmet>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
            </Helmet>
            <Header location={location} />
            <div className="mainWrapper">
                <div className="dashboard_main">
                    <div className="container">
                        <main>{children}</main>
                    </div>
                </div>
            </div>            
        </div>
    )
}

export default Layout
