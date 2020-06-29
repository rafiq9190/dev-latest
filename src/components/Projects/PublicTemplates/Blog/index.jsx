import React from 'react';
import HeartButton from '../../../HeartButton'
import './component.styles.css'

class BlogTemplate extends React.Component {

    state = {
        title: this.props.title || "",
        records: this.props.records || [],
        likeHelperData: this.props.likeHelperData
    };

    render() {
        console.log("******* Initial state of template")
        console.log(this.state)
        const { title, records, likeHelperData } = this.state

        return (
            <>
                <div id="content" className="bg-white pt-3">
                    <div className="subdomainContainer">
                        <div className="authContainer">
                            <div className="modalContainer">
                                <div className="toastContainer">
                                    <div className="publicContainer">
                                        <div className="publicNav">
                                            <div className="contentContainer">
                                                <div className="contentInnerContainer">
                                                    <div className="publicNavContent">
                                                        <div className="mainNav">
                                                            <a className="company">
                                                                <div className="logoContainer">
                                                                    <div className="companyLogo"></div>
                                                                    <div className="companyName">{title}</div>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="boardHome">
                                            <div className="contentContainer">
                                                <div className="contentInnerContainer">
                                                    <div className="subdomainSidebarContainer">
                                                        <div className="mainContainer">
                                                            <div className="postListContainer">
                                                                <div className="postList">                                                                    
                                                                    <div className="posts">
                                                                        {records.length > 0 && records.map((record, index) =>
                                                                            <div key={index} className="row">
                                                                                <div className="col">
                                                                                    <div className="row">
                                                                                        <div className="col-lg-10">
                                                                                            <h1 className="">{record.fields["Title"]}</h1>
                                                                                            by{`  `}
                                                                                            <span className="text-primary">{record.fields["Author"]}</span>
                                                                                            {`  `}on{`  `}
                                                                                            <span className="text-success">{record.fields["Last Modified Date"]}</span>
                                                                                        </div>
                                                                                        <div className="col-lg-1 m-3">
                                                                                            {likeHelperData &&
                                                                                                <HeartButton id={record.id} userid={likeHelperData.userid} currentVotes={likeHelperData.votes[record.id]} slug={likeHelperData.slug} />
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                    <img className="img-fluid pb-2" src={record.fields["Images"] && record.fields["Images"].length > 0 && record.fields["Images"][0].url} alt={record.fields["Title"]} />
                                                                                    <p className="d-flex justify-content-between">{record.fields["Body"]}</p>
                                                                                    <div className="w-50 mx-auto mb-5">
                                                                                        <hr />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.error &&
                    <div>ERROR = {this.state.error}</div>
                }
            </>
        )
    }
}


export default BlogTemplate;