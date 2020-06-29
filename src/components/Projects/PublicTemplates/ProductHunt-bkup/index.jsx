import React from 'react';
import {FiExternalLink} from 'react-icons/fi';
import HeartButton from '../../../HeartButton'
import './component.styles.css'

class ProductHunt extends React.Component {

    state = {
        title: this.props.title || "",
        records: this.props.records || [],
        likeHelperData: this.props.likeHelperData
    };

    render() {
        const { title, records, likeHelperData } = this.state
        console.log("******* Records in template ")
        console.log(records)
        console.log("******* likeHelperData in template ")
        console.log(likeHelperData)

        return (
            <div className="product-hunt">
                <div className="container border p-0 bg-white">
                    {records.length > 0 && records.map((record, index) =>
                        <div key={index} className="row post border-bottom border-light">
                            <div className="col-md-2 pl-0 ">
                                <img className="img-fluid" src={record.fields["Image"][0].url} alt={record.fields["Title"]} />
                            </div>
                            <div className="col-md-9">
                                <div className="row">
                                    <h4>{record.fields["Title"]}</h4>
                                    &nbsp;<a href={record.fields["URL"]} target="_blank" rel="noreferrer" className="btn btn-white text-primary p-0"><FiExternalLink className="icons-color" /></a>
                                </div>
                                <div className="row">
                                    <p>{record.fields["Subtitle"]}</p>
                                </div>
                            </div>
                            <div className="col-md-1 d-flex align-items-top mb-lg-5">
                                {likeHelperData &&
                                    <HeartButton id={record.id} userid={likeHelperData.userid} currentVotes={likeHelperData.votes[record.id]} slug={likeHelperData.slug} />
                                }                                
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}


export default ProductHunt;