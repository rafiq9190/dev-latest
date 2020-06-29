import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import HeartButton from '../../../HeartButton'

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
            <>
                <header className="mainHeader bg-white">
                    <div className="container">
                        <nav className="navbar navbar-expand-sm">
                            <a className="navbar-brand" href="#">
                                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M40 20c0 11.046-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0s20 8.954 20 20" fill="#DA552F"></path><path d="M22.667 20H17v-6h5.667a3 3 0 0 1 0 6m0-10H13v20h4v-6h5.667a7 7 0 1 0 0-14" fill="#FFF"></path></g></svg>
                            </a>
                            <div className="heading">
                                <h3>{title}</h3>
                            </div>
                        </nav>
                    </div>
                </header>
                <div className="mainWrapper">
                    <section className="main_section page_sec">
                        <div className="container">
                            <div className="row">
                                {/*<div className="col-sm-4">User Post Submit form will come here</div>*/}
                                <div className="col-sm-8">
                                    <div className="today_posts posts_sec">
                                        <div className="heading">
                                            <h3>Today</h3>
                                        </div>
                                        <div className="postS">
                                            <ul className="post_list">
                                                {records.length > 0 && records.map((record, index) =>
                                                    <li className="lists">
                                                        <div className="post_text">
                                                            <img src={record.fields["Image"][0].url} alt={record.fields["Title"]} />
                                                            <div className="post_content">
                                                                <a href={record.fields["URL"]} target="_blank" rel="noreferrer">
                                                                    <h4>{record.fields["Title"]}</h4>
                                                                    <p>{record.fields["Subtitle"]}</p>
                                                                </a>
                                                                <div className="post-bottom">
                                                                    <ul className="p_btm">
                                                                        <li className="comment_post">
                                                                            <svg width="12" height="11" viewBox="0 0 12 11" xmlns="http://www.w3.org/2000/svg"><path d="M2.012 7.832C1.21 7.052.727 6.045.727 4.946c0-2.48 2.463-4.491 5.5-4.491 3.038 0 5.5 2.01 5.5 4.491 0 2.48-2.462 4.492-5.5 4.492a6.562 6.562 0 0 1-2.13-.35c-1.07.62-3.166 1.44-3.166 1.44s.7-1.685 1.081-2.696z" fill="#FFF" fill-rule="evenodd"></path></svg> 0
													                </li>
                                                                        <li className="share_post">
                                                                            <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M5.982 1.042h2.232L3.898 5.358l.745.744 4.316-4.316v2.233h1.04V.52A.508.508 0 0 0 9.48 0H5.982v1.042zM9 9H1V1h2.978V0H.51A.51.51 0 0 0 0 .51v8.98c0 .282.228.51.51.51h8.98a.51.51 0 0 0 .51-.51V6.026H9V9z" fill="#FFF" fill-rule="evenodd"></path></svg>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            <div className="count_btn text-center">
                                                                <div className="box_text">
                                                                    {likeHelperData &&
                                                                        <HeartButton id={record.id} userid={likeHelperData.userid} currentVotes={likeHelperData.votes[record.id]} slug={likeHelperData.slug} />
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </>

        )
    }
}


export default ProductHunt;