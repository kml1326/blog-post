import React, { Component } from "react";
import {
  getSinglePostAction,
  createCommentAction,
  getAllComments
} from "../actions/actions";
import { connect } from "react-redux";

class SinglePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      editComment: "",
      editCommentId: ""
    };
  }

  componentDidMount() {
    const id = this.props.location.pathname.split("/")[2];
    this.props.dispatch(getSinglePostAction(id));
    this.props.dispatch(getAllComments(id));
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleComment = e => {
    e.preventDefault();
    if (!this.state.comment) return;
    const data = {
      id: this.props.post._id,
      comment: this.state.comment
    };
    this.props.dispatch(createCommentAction(data));
    this.setState({ comment: "" });
  };

  handleCommentEdit = id => {
    this.setState({ editCommentId: id });
  };

  handleCommentEditDone = id => {
    if (!this.state.editComment) {
      this.setState({ editCommentId: "" });
      return;
    }
    fetch(`/comment/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        postId: this.props.post._id,
        comment: this.state.editComment
      }
    })
      .then(res => res.json())
      .then(data => {
        this.props.dispatch({
          type: "ALL_CURRENT_COMMENTS",
          data
        });
        this.setState({
          editComment: "",
          editCommentId: ""
        });
      });
  };

  handleDelComment = id => {
    fetch(`/comment/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        postId: this.props.post._id
      }
    })
      .then(res => res.json())
      .then(data => {
        this.props.dispatch({
          type: "ALL_CURRENT_COMMENTS",
          data
        });
      });
  };

  render() {
    const { post, comments } = this.props;
    return (
      <div className="container">
        {post && (
          <div>
            <h1 className="title">{post.title}</h1>
            <h2 className="desc">{post.description}</h2>
            <p className="body">{post.body}</p>
          </div>
        )}
        <div className="comment-container">
          <form onSubmit={this.handleComment} className="comment-form">
            <div className="comment-box">
              <input
                type="text"
                name="comment"
                value={this.state.comment}
                placeholder="write Comment"
                onChange={this.handleChange}
                className="input"
              />
              <input
                type="submit"
                value="Comment"
                className="btn comment-btn"
                onClick={this.handleComment}
              />
            </div>
          </form>
          <div>
            {comments &&
              comments.map(comment => {
                if (comment._id == this.state.editCommentId) {
                  return (
                    <div key={comment._id} className="comment-card">
                      <div className="comment">
                        <input
                          type="text"
                          value={this.state.editComment || comment.comment}
                          onChange={this.handleChange}
                          name="editComment"
                          className="input edit-comment"
                        />
                      </div>
                      <div className="card-footer">
                        <span
                          className="footer"
                          onClick={() =>
                            this.handleCommentEditDone(comment._id)
                          }
                        >
                          Done
                        </span>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={comment._id} className="comment-card">
                    <div className="comment">
                      <span onInput={this.handleEdit}>{comment.comment}</span>
                    </div>
                    <div className="card-footer">
                      <span
                        onClick={() => this.handleCommentEdit(comment._id)}
                        className="footer"
                      >
                        Edit
                      </span>
                      <span>&nbsp;</span>
                      <span>&nbsp;</span>
                      <span
                        onClick={() => this.handleDelComment(comment._id)}
                        className="footer"
                      >
                        Delete
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  if (state) {
    return {
      post: state.currentSinglePost,
      comments: state.currentComments
    };
  }
}

export default connect(mapStateToProps)(SinglePost);
