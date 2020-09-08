import React, { useState } from 'react';
import './App.css';
import SearchBooks from './Component/SearchBarUI/searchBar';
import searchMechanism from './Component/Searcher/search';
import BookList from './Component/List/list';

function App() {
    const [selectedBook, setSelectedBook] = useState("");
    const [booksList, setBooksList] = useState([]);

    const handleSubmit = () => {
        if (booksList.find((d) => d.title === selectedBook.title) === undefined) {
            setBooksList(booksList.concat(selectedBook));
        }
    };

    return (
        <div className="app-container">
            <div className="form-container">
                <div className="search-box">
                    <SearchBooks
                        searchMechanism={searchMechanism}
                        numOfSuggestions={3}
                        onSelect={setSelectedBook}
                    />
                </div>
                <div className="submit-container">
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>
            <div className="list-container">
                <BookList data={booksList} />
            </div>
        </div>
    );
}

export default App;
