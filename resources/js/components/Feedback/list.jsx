import React, { Component } from 'react';
import api from './../../axios'

class FeedBackList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackList: [],
            currentPage: 1,
            totalPages: 1,
            formData: {
                title: '',
                description: '',
                category: '',
            },
            formErrors: {
                title: '',
                description: '',
                category: '',
            },
            showReplyFieldId: null,
            replyMessage: '',
            taggedUsers:[]
        };
    }

    componentDidMount() {
        this.fetchFeedback();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentPage !== this.state.currentPage) {
            this.fetchFeedback();
        }
    }

    fetchFeedback = async () => {
        try {
            const response = await api.get(`feedback/list?page=${this.state.currentPage}`);
            const data = response.data;
            const feedbackWithComments = data.data.map(feedback => ({
                ...feedback,
                showComments: false // Initialize showComments property to false for each feedback
            }));
            this.setState({
                feedbackList: feedbackWithComments,
                totalPages: data.last_page
            });
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    };

    toggleComments = (e,feedbackId) => {
        e.preventDefault();
        const { feedbackList } = this.state;
        const updatedFeedbackList = feedbackList.map(feedback => {
            if (feedback.id === feedbackId) {
                return {
                    ...feedback,
                    showComments: !feedback.showComments // Toggle showComments value
                };
            }
            return feedback;
        });
        this.setState({ feedbackList: updatedFeedbackList });
    };


    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            formData: { ...prevState.formData, [name]: value },
            formErrors: { ...prevState.formErrors, [name]: '' }
        }));
    };
    handleFormReset = () => {
        this.setState({
            formData: {
                title: '',
                description: '',
                category: '',
            },
            formErrors: {
                title: '',
                description: '',
                category: '',
            }
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { formData } = this.state;
        let newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (Object.keys(newErrors).length > 0) {
            this.setState({ formErrors: newErrors });
            return;
        }

        api.post('feedback-save', formData)
            .then(response => {
                this.fetchFeedback();
                this.handleFormReset();
            })
            .catch(error => {
                if (error.status === 422) {
                    let errors = {};
                    errors = error.data;
                    this.setState({ formErrors: errors });
                }
            });
    };

    handleReplyClick = (e, feedbackId) => {
        e.preventDefault(); // Prevent default behavior of anchor tags
        this.setState({ showReplyFieldId: feedbackId });
    };
    handleReplyChange = async (e) => {
        const { value } = e.target;
        this.setState({ replyMessage: value });

        // Detect if "@" symbol is typed
        const atIndex = value.lastIndexOf('@');
        if (atIndex !== -1) {
            const searchText = value.substring(atIndex + 1);
            if (searchText.trim() !== '') {
                try {
                    // Fetch users based on searchText
                    const response = await api.get(`users?search=${searchText}`);
                    const users = response.data;
                    this.setState({ taggedUsers: users });
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            } else {
                this.setState({ taggedUsers: [] });
            }
        } else {
            this.setState({ taggedUsers: [] });
        }
    };

    handleReplySubmit = (feedbackId) => {

        const { replyMessage } = this.state;
        if (replyMessage.trim() === '') {
            console.log('Empty reply submitted');

        } else {
            api.post('reply-save', {comment:replyMessage,feedback_id:feedbackId})
                .then(response => {
                    this.fetchFeedback()
                    console.log(`Reply submitted for feedback ID: ${feedbackId}, Message: ${replyMessage}`);
                    this.setState({ showReplyFieldId: null, replyMessage: '' });
                })
                .catch(error => {
                    if (error.status === 422) {
                        let errors = {};
                        errors = error.data;
                        this.setState({ formErrors: errors });
                    }
                });
        }
        this.setState({ showReplyFieldId: null, replyMessage: '' });
    };

    handleTaggedUser = (user) => {
        const { replyMessage } = this.state;
        const taggedUser = `${user.name} `;
        const updatedMessage = replyMessage.replace(/@\w+\s?$/, taggedUser);
        this.setState({
            replyMessage: updatedMessage,
            taggedUsers: [],
        });
    };

    render() {
        const { feedbackList, currentPage, totalPages, formData, formErrors,showReplyFieldId, replyMessage,taggedUsers } = this.state;

        return (
            <div className={"feedback-form"}>
                <div className="feedback-list-container">
                    <h2>Feedback List</h2>
                    <ul className="feedback-list">
                        {feedbackList.map((feedback) => (
                            <li key={feedback.id} className="feedback-item">
                                <div className="feedback-header">
                                    <h6>{feedback.title}</h6>
                                    <span className="feedback-category">{feedback.category}</span>
                                </div>
                                <p>{feedback.description}</p>
                                <div className={"feedback-header"}>
                                    <span className="feedback-username">By: {feedback.user.name}</span>
                                    <div>
                                        <a href="#" className={"reply"}
                                           onClick={(e) => this.handleReplyClick(e, feedback.id)}>Reply
                                        </a>
                                        <a href="#" className={"comment-btn"} onClick={(e) => this.toggleComments(e, feedback.id)}>
                                             {feedback.showComments ? 'Hide Comments' : 'Show Comments'}
                                        </a>
                                    </div>
                                </div>
                                {showReplyFieldId === feedback.id && (
                                    <div className="reply-field">
                                        <div className="input-wrapper">
                                            <input
                                                type="text"
                                                value={replyMessage}
                                                onChange={this.handleReplyChange}
                                                placeholder="Type your reply here"
                                                className="form-control"
                                            />
                                            <button onClick={() => this.handleReplySubmit(feedback.id)}
                                                    className="btn btn-primary reply-button-position" >Submit
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {taggedUsers.length > 0 && showReplyFieldId === feedback.id && (
                                    <ul className="tagged-users-list">
                                        {taggedUsers.map(user => (
                                            <li key={user.id} onClick={() => this.handleTaggedUser(user)}>{user.name}</li>
                                        ))}
                                    </ul>
                                )}
                                {feedback.comments && feedback.comments.length > 0 &&
                                    <div className="comments-section">
                                        {feedback.showComments && (
                                            <div className="comments-list">
                                                {feedback.comments.map(comment => (
                                                    <p key={comment.id}>{comment.comment}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                }

                            </li>
                        ))}
                    </ul>
                    <div className="pagination">
                        {Array.from({length: totalPages}, (_, index) => index + 1).map(
                            (pageNumber) => (
                                <button key={pageNumber} onClick={() => this.handlePageChange(pageNumber)}
                                        className={pageNumber === currentPage ? "active" : ""}>
                                    {pageNumber}
                                </button>
                            )
                        )}
                    </div>
                    <div className="auth-wrapper">
                        <div className="feedback-inner">
                            <form onSubmit={this.handleSubmit}>
                                <h3>Submit FeedBack</h3>
                                <div className="mb-3">
                                    <label>Title:</label>
                                    <input type="text" name="title"
                                           className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                                           value={formData.title} onChange={this.handleChange}/>
                                    {formErrors.title && <span className="invalid-feedback">{formErrors.title}</span>}
                                </div>

                                <div className="mb-3">
                                    <label>Category:</label>
                                    <select name="category" value={formData.category}
                                            className={`form-control ${formErrors.category ? 'is-invalid' : ''}`}
                                            onChange={this.handleChange}>
                                        <option value="">Select category</option>
                                        <option value="Bug">Bug</option>
                                        <option value="Feature Request">Feature Request</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {formErrors.category &&
                                        <span className="invalid-feedback">{formErrors.category}</span>}
                                </div>
                                <div className="mb-3">
                                    <label>Description:</label>
                                    <textarea name="description" value={formData.description}
                                              className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                                              onChange={this.handleChange}/>
                                    {formErrors.description &&
                                        <span className="invalid-feedback">{formErrors.description}</span>}
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default FeedBackList;
