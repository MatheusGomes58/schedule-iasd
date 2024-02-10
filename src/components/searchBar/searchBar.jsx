import React, { useState } from 'react';
import './searchBar.css'; // Certifique-se de ter um arquivo CSS para estilizar o SearchBar

const SearchBar = ({ onSearch, suggestions }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    const handleClear = () => {
        setSearchTerm("");
        onSearch("");
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowSuggestions(value.length > 0);
    };

    const handleInputClick = () => {
        setShowSuggestions(!showSuggestions);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        onSearch(suggestion);
        setShowSuggestions(false);
    };

    return (
        <div className="google-search-bar">
            <div className="search-container">
                <i className="fa fa-search search-icon"></i>
                <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onClick={handleInputClick} // Adiciona o manipulador de clique na barra de pesquisa
                />
                <button className="clear-button" onClick={handleClear}>
                    <i className="fas fa-times"></i>
                </button>
                <button className="search-button" onClick={handleSearch}>
                    <i className="fas fa-search"></i>
                </button>

                {showSuggestions && (
                    <ul className="suggestion-list">
                        {suggestions.map((suggestion, index) => (
                            <li key={index} onClick={() => handleSuggestionClick(suggestion.nome)}>
                                {suggestion.nome}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
