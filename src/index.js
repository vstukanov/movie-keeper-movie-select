import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import { debounce, fetchWithCancel } from './Utils';

export default
class MovieSelect extends Component {
  constructor (...args)
  {
    super(...args);

    this.state = {
      value: this.props.value,
      suggestions: []
    };

    this.fetchSuggestions = debounce(this._fetchSuggestions.bind(this), this.props.debounce);
    this._fetchRequest = null;
  }

  _fetchSuggestions(value)
  {
    if (value.length < 3) {
      return this.clearSuggestions();
    }

    if (this._fetchRequest) {
      this._fetchRequest.cancel();
    }

    this._fetchRequest = fetchWithCancel(`http://www.omdbapi.com/?s=${value}`);

    this._fetchRequest.promise.then(([ canceled, { Search }]) => {
      if (canceled) {
        return;
      }

      this.setState({ suggestions: Search || [] });
    });
  }

  clearSuggestions()
  {
    if (this._fetchRequest) {
      this._fetchRequest.cancel();
      this._fetchRequest = null;
    }

    this.setState({ suggestions: [] });
  }

  handleSuggestionSelected(event, { suggestion })
  {
    event.preventDefault();

    fetch(`http://www.omdbapi.com/?i=${suggestion.imdbID}&plot=full`)
      .then(resp => resp.json())
      .then(movieModel => this.props.onMovieSelected(movieModel));
  }

  render()
  {
    const { value, suggestions } = this.state;
    const { placeholder, theme } = this.props;

    const inputProps = {
      placeholder,
      value,
      onChange: (event, { newValue }) => {
        this.setState({ value: newValue });
      }
    };

    const isString = str => (typeof str === 'string') || (str instanceof String);
    const isHref = url => isString(url) && /^https?:\/\//.test(url);

    const renderSuggestion = ({ Title, Year, Poster, imdbID }) => (
      <div className="movie-select-item--container">
        <div className="movie-select-item--poster">
          { isHref(Poster)
            ? <img className="movie-select-item--image" src={Poster} alt={Title} />
            : <div className="movie-select-item--no-image"></div>
          }
        </div>
        <div className="movie-select-item--title">{ Title }</div>
        <div className="movie-select-item--year">{ Year }</div>
        <div className="movie-select-item--imdbID">{ imdbID }</div>
      </div>
    );

    return (
      <Autosuggest
        suggestions={suggestions}
        renderSuggestion={renderSuggestion}
        onSuggestionsFetchRequested={({ value }) => this.fetchSuggestions(value) }
        onSuggestionsClearRequested={this.clearSuggestions.bind(this)}
        getSuggestionValue={ val => val.Title }
        inputProps={inputProps}
        theme={theme}
        onSuggestionSelected={this.handleSuggestionSelected.bind(this)}
      />
    );
  }
}

MovieSelect.propTypes = {
  debounce: PropTypes.number,
  onMovieSelected: PropTypes.func.isRequired,
  theme: PropTypes.object,
  value: PropTypes.string
};

MovieSelect.defaultProps = {
  debounce: 350,
  value: ''
};