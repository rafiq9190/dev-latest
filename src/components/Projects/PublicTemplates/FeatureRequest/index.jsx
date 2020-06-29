import React from 'react';
import { Badge } from 'react-bootstrap';
import HeartButton from '../../../HeartButton'
import Airtable from 'airtable';
import Loader from 'react-loader-spinner';

class FeatureRequest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: props.title || "",
            records: props.records || [],
            likeHelperData: props.likeHelperData,
            airtableApiKey: props.airtableApiKey,
            airtableBaseId: props.airtableBaseId,
            loading: false,
            newRequestTitle: "",
            newRequestDetail: "",
            newRequestError: null,
            newRequestMessage: null
        };

        // This binding is necessary to make `this` work in the callback
        this.submitRequest = this.submitRequest.bind(this);
    }

    resetMessages() {
        this.setState({
            newRequestError: null,
            newRequestMessage: null
        });
    }

    resetControls() {
        this.setState({
            newRequestTitle: "",
            newRequestDetail: ""
        });
    }

    submitRequest() {
        this.resetMessages();
        if (!this.state.newRequestTitle || this.state.newRequestTitle.length <= 0) {
            this.setState({ newRequestError: "'Title' field is missing value" });
            return;
        }
        if (!this.state.newRequestDetail || this.state.newRequestDetail.length <= 0) {
            this.setState({ newRequestError: "'Detail' field is missing value" });
            return;
        }
        const newRequest = {
            "Title": this.state.newRequestTitle,
            "Details": this.state.newRequestDetail,
            "Status": "Open"
        };
        //console.log("*********** newRequest")
        //console.log(newRequest)
        this.setState({ loading: true });
        const base = new Airtable({ apiKey: this.state.airtableApiKey }).base(this.state.airtableBaseId);
        base('FeatureRequests').create(newRequest, (err, record) => {
            this.setState({ loading: false });
            if (err) {
                console.error("***** Error while sending data to Airtable")
                this.setState({ newRequestError: "Error while submitting suggestion" });
                console.error(err);
                return;
            }
            console.log("*** New Airtable record created with id = " + record.getId());
            this.setState({ newRequestMessage: "Suggestion Submitted successfully" });
            this.resetControls();
        });
    };
    render() {
        const { title, records, likeHelperData } = this.state
        console.log("******* Records in template ")
        console.log(records)
        console.log("******* likeHelperData in template ")
        console.log(likeHelperData)
        const badgeVariant = {
            "Under Review": "text-warning",
            "Open": "text-primary",
            "Planned": "planned",
            "In Progress": "text-info",
            "Completed": "text-success",
            "Closed": "text-danger"
        };

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
                                                        <div className="sidebarContainer">
                                                            <div className="boardDetails">
                                                                <div className="heading">Create a Post</div>
                                                                <form className="imageForm createPostForm">
                                                                    <div className="textInput">
                                                                        <div className="inset">Title</div>
                                                                        <div className="inputContainer">
                                                                            <input
                                                                                className=""
                                                                                id="title"
                                                                                placeholder="Short Descriptive Title"
                                                                                value={this.state.newRequestTitle}
                                                                                type="text"
                                                                                required
                                                                                onChange={({ target: { value } }) => {
                                                                                    this.resetMessages();
                                                                                    this.setState({ newRequestTitle: value });
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="autoResizeTextarea">
                                                                        <div className="inset">Details</div>
                                                                        <span className="inputContainer">
                                                                            <textarea
                                                                                rows="3"
                                                                                id="details"
                                                                                value={this.state.newRequestDetail}
                                                                                placeholder="Any additional detail.."
                                                                                type="text"
                                                                                required
                                                                                onChange={({ target: { value } }) => {
                                                                                    this.resetMessages();
                                                                                    this.setState({ newRequestDetail: value });
                                                                                }}
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                    <div className="formButtons">
                                                                        <button type="button" className="button cannyButton btn-primary" onClick={this.submitRequest}>
                                                                            <span className="label">Create Post</span>
                                                                        </button>
                                                                    </div>
                                                                    {this.state.loading &&
                                                                        <div className="pl-1 pt-2">
                                                                            <Loader type="ThreeDots" color="#00BFFF" height={10} width={80} />
                                                                        </div>
                                                                    }
                                                                    {this.state.newRequestError && this.state.newRequestError.length > 0 &&
                                                                        <div className="pl-1 pt-2 text-danger">
                                                                            {this.state.newRequestError}
                                                                        </div>
                                                                    }
                                                                    {this.state.newRequestMessage && this.state.newRequestMessage.length > 0 &&
                                                                        <div className="pl-1 pt-2 text-success">
                                                                            {this.state.newRequestMessage}
                                                                        </div>
                                                                    }
                                                                </form>
                                                            </div>
                                                        </div>
                                                        <div className="mainContainer">
                                                            <div className="postListContainer">
                                                                <div className="postList">
                                                                    <div className="topContainer">
                                                                        <div className="postListMenu">
                                                                            <div className="menu">
                                                                                <div className="text">Showing</div>
                                                                                <div className="selector">
                                                                                    <div className="selectedName">Trending</div>
                                                                                    <div className="icon-chevron-down"></div>
                                                                                </div>
                                                                                <div className="text">posts</div>
                                                                            </div>
                                                                            <div className="searchContainer">
                                                                                <div className="searchBar">
                                                                                    <div className="textInput searchInput">
                                                                                        <div className="inset">
                                                                                            <div className="icon icon-search"></div>
                                                                                        </div>
                                                                                        <div className="inputContainer"><input type="text" placeholder="Search…" value="" /></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="posts">
                                                                        {records.length > 0 && records.map((record, index) =>
                                                                            <div className="postListItem">
                                                                                {likeHelperData &&
                                                                                    <HeartButton id={record.id} userid={likeHelperData.userid} currentVotes={likeHelperData.votes[record.id]} slug={likeHelperData.slug} />
                                                                                }
                                                                                <a className="postLink">
                                                                                    <div className="body">
                                                                                        <div className="postTitle"><span>{record.fields["Title"]}</span></div>
                                                                                        <div className="statusStale">
                                                                                            <div className={`uppercaseHeader postStatus ${badgeVariant[record.fields["Status"]]}`}>{record.fields["Status"]}</div>
                                                                                        </div>
                                                                                        <div className="postDetails">
                                                                                            <div className="truncate">{record.fields["Details"]}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="postCommentCount"><span class="icon icon-comment"></span><span>0</span></div>
                                                                                </a>
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
            </>
        )
    }
}


export default FeatureRequest;