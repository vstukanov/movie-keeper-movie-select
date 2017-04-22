import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import { debounce, fetchWithCancel } from './Utils';

export default
class MovieSelect extends Component {
  state = {
    value: '',
    suggestions: []
  };

  constructor (...args)
  {
    super(...args);

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

  render()
  {
    const { value, suggestions } = this.state;
    const { placeholder } = this.props;

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
        onSuggestionSelected={(event, { suggestion }) => this.props.onMovieSelected(suggestion) }
      />
    );
  }
}

MovieSelect.propTypes = {
  debounce: PropTypes.number,
  onMovieSelected: PropTypes.func.isRequired
};

MovieSelect.defaultProps = {
  debounce: 350
};