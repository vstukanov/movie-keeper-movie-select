function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Flexbox from 'flexbox-react';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Button from 'muicss/lib/react/button';
import Rating from 'react-rating';

import { preventAndCall } from './Utils';
import MovieSelect from './MovieSelect';

import './MovieAddOverlay.css';

var MovieAddOverlay = function (_Component) {
  _inherits(MovieAddOverlay, _Component);

  function MovieAddOverlay() {
    _classCallCheck(this, MovieAddOverlay);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args)));

    _this.state = {
      title: '',
      director: '',
      year: '',
      rating: 0
    };
    return _this;
  }

  MovieAddOverlay.prototype.handleMovieSelect = function handleMovieSelect(movie) {
    this.setState({
      director: movie.Director,
      year: movie.Released,
      rating: Math.floor(parseFloat(movie.imdbRating) / 10 * 5),
      title: movie.Title
    });
  };

  MovieAddOverlay.prototype.updateRating = function updateRating(rating) {
    this.setState({ rating: rating });
  };

  MovieAddOverlay.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        onSubmitMovie = _props.onSubmitMovie,
        onClose = _props.onClose;


    var updateState = function updateState(field) {
      return function (_ref) {
        var _this2$setState;

        var value = _ref.target.value;
        return _this2.setState((_this2$setState = {}, _this2$setState[field] = value, _this2$setState));
      };
    };

    return React.createElement(
      Flexbox,
      { className: 'overlay' },
      React.createElement(
        Flexbox,
        { className: 'add-movie-container' },
        React.createElement(
          Form,
          {
            onSubmit: preventAndCall(onSubmitMovie, this.state),
            className: 'add-movie-form' },
          React.createElement(
            'legend',
            null,
            'Add Movie'
          ),
          React.createElement(MovieSelect, {
            value: this.state.title,
            onMovieSelected: this.handleMovieSelect.bind(this),
            placeholder: 'Type movie title' }),
          React.createElement(Input, { ref: 'director', value: this.state.director,
            label: 'Director',
            floatingLabel: true,
            onChange: updateState('director') }),
          React.createElement(Input, { ref: 'year', value: this.state.year,
            label: 'Year of Release',
            floatingLabel: true,
            onChange: updateState('year') }),
          React.createElement(
            'div',
            { className: 'mui-textfield', style: { marginBottom: 0 } },
            React.createElement(
              'div',
              { style: { marginBottom: 15 } },
              'Rating'
            ),
            React.createElement(Rating, {
              onClick: this.updateRating.bind(this),
              initialRate: this.state.rating })
          ),
          React.createElement(
            'div',
            { style: { textAlign: 'right' } },
            React.createElement(
              Button,
              {
                ref: 'closeButton',
                variant: 'flat',
                onClick: preventAndCall(onClose) },
              'Cancel'
            ),
            React.createElement(
              Button,
              { variant: 'flat', color: 'primary' },
              'Submit'
            )
          )
        )
      )
    );
  };

  return MovieAddOverlay;
}(Component);

export { MovieAddOverlay as default };


MovieAddOverlay.protoTypes = {
  onSubmitMovie: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};