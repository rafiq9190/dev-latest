import React from 'react';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import firebase from "gatsby-plugin-firebase"
import './hearbutton.styles.css'

class HeartButton extends React.Component {

    state = {
        likes: this.props.currentVotes || 0,
        liked: !!localStorage.getItem(this.props.id)
    };

    addLike = () => {
        if (this.state.liked) return;// allow only one like per visitor per item

        let newCount = this.state.likes + 1;

        firebase
            .database()
            .ref()
            .child(`users/${this.props.userid}/projects/${this.props.slug}/votes/${this.props.id}`)
            .set(newCount)
            .then(() => {
                this.setState({ likes: newCount, liked: true });
                localStorage.setItem(this.props.id, this.state.liked);
                console.log("Upvote registered for " + this.props.id + " with '" + this.state.likes + "'");
            });
    };

    render() {
        const likes = this.state.likes;
        const liked = this.state.liked;

        return (
            <div className="postVotes" onClick={this.addLike}>
                <div className={`upvote ${liked?`voted`:``}`}></div>
                <span>{likes}</span>
            </div>
        );
    }
}


export default HeartButton;