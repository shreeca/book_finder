import React from 'react';
import './list.css';
import { PropTypes } from "prop-types";

BookList.propTypes = {
    data: PropTypes.array.isRequired,
};

function BookList({ data }) {
    return (
        data &&
        data.map((book) => (
            <div className="card" key={book.title}>
                <div className="card-title">
                    <p className="title">{book.title}</p>
                </div>
                <div className="card-body">
                    <p>{book.summary}</p>
                </div>
                <div className="card-footer">
                    <p>- {book.author}</p>
                </div>
            </div>
        ))
    );
}

export default BookList;
