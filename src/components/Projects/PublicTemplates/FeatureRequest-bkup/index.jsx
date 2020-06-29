import React from 'react';
import { Badge } from 'react-bootstrap';
import HeartButton from '../../../HeartButton'
import Airtable from 'airtable';
import Loader from 'react-loader-spinner';
import './component.styles.css';


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
            newRequestTitle : "",
            newRequestDetail : "",
            newRequestError : null,
            newRequestMessage : null 
        };

        // This binding is necessary to make `this` work in the callback
        this.submitRequest = this.submitRequest.bind(this);
    }

    resetMessages() {
        this.setState({
            newRequestError : null,
            newRequestMessage : null 
        });
    }

    resetControls() {
        this.setState({
            newRequestTitle : "",
            newRequestDetail : "" 
        });
    }

    submitRequest() {
        this.resetMessages();
        if(!this.state.newRequestTitle || this.state.newRequestTitle.length<=0) {
            this.setState({newRequestError: "'Title' field is missing value"});
            return;
        }
        if(!this.state.newRequestDetail || this.state.newRequestDetail.length<=0) {
            this.setState({newRequestError: "'Detail' field is missing value"});
            return;
        }
        const newRequest = {
            "Title": this.state.newRequestTitle,
            "Details": this.state.newRequestDetail,
            "Status": "Open"
        };
        //console.log("*********** newRequest")
        //console.log(newRequest)
        this.setState({loading: true});
        const base = new Airtable({apiKey: this.state.airtableApiKey}).base(this.state.airtableBaseId);
        base('FeatureRequests').create(newRequest, (err, record) => {
            this.setState({loading: false});
            if (err) {
                console.error("***** Error while sending data to Airtable")
                this.setState({newRequestError: "Error while submitting suggestion"});
                console.error(err);                
                return;
            }
            console.log("*** New Airtable record created with id = "+record.getId());
            this.setState({newRequestMessage: "Suggestion Submitted successfully"});
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
            "Under Review": "warning",
            "Open": "primary",
            "Planned": "secondary",
            "In Progress": "info",
            "Completed": "success",
            "Closed": "danger"
        };

        return (
            <div className="feature-request">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 p-0 pr-lg-2">
                            <div className="container form-starts bg-white p-4">
                                <form>
                                    <div className="row mb-3 justify-content-center">
                                        <h5><strong>Create a Suggestion</strong></h5>
                                    </div>
                                    <div className="row form-group">
                                        <input
                                            className="form-control p-2"
                                            id="title"
                                            placeholder="Short Descriptive Title"
                                            value={this.state.newRequestTitle}
                                            type="text"
                                            required
                                            onChange={({ target: { value } }) => {
                                                this.resetMessages();
                                                this.setState({newRequestTitle: value});
                                            }}
                                        />
                                    </div>
                                    <div className="row form-group">
                                        <textarea
                                            className="form-control p-2"
                                            id="details"
                                            value={this.state.newRequestDetail}
                                            placeholder="Any addition detail.."
                                            type="text"
                                            required
                                            onChange={({ target: { value } }) => {
                                                this.resetMessages();
                                                this.setState({newRequestDetail: value});
                                            }}
                                        />
                                    </div>
                                    <div className="row">
                                        <input type="button" value={`Submit Feature Request`} onClick={this.submitRequest} className="btn btn-primary" />
                                        {this.state.loading &&
                                            <Loader type="ThreeDots" color="#00BFFF" height={10} width={80} />
                                        }
                                    </div>
                                    {this.state.newRequestError && this.state.newRequestError.length >0 && 
                                        <div className="row text-danger">
                                            {this.state.newRequestError}
                                        </div>
                                    }
                                    {this.state.newRequestMessage && this.state.newRequestMessage.length >0 && 
                                        <div className="row text-success">
                                            {this.state.newRequestMessage}
                                        </div>
                                    }
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-8 p-0">
                            <div className="container mx-auto border p-0 bg-white">
                                {records.length > 0 && records.map((record, index) =>
                                    <div key={index} className="row post border-bottom border-light">
                                        <div className="col-md-2 align-items-top justify-content-center mb-lg-5">
                                            {likeHelperData &&
                                                <HeartButton id={record.id} userid={likeHelperData.userid} currentVotes={likeHelperData.votes[record.id]} slug={likeHelperData.slug} />
                                            }
                                        </div>
                                        <div className="col-md-9">
                                            <div className="row">
                                                <h4>{record.fields["Title"]}</h4>
                                            </div>
                                            <div className="row">
                                                <Badge variant={badgeVariant[record.fields["Status"]]}>{record.fields["Status"]}</Badge>
                                            </div>
                                            <div className="row">
                                                <p>{record.fields["Details"]}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}


export default FeatureRequest;