'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactAutosuggest = require('react-autosuggest');

var _reactAutosuggest2 = _interopRequireDefault(_reactAutosuggest);

var _Utils = require('./Utils');

require('whatwg-fetch');

require('./MovieSelect.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MovieSelect = function (_Component) {
  _inherits(MovieSelect, _Component);

  function MovieSelect() {
    _classCallCheck(this, MovieSelect);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args)));

    _this.state = {
      value: _this.props.value,
      suggestions: []
    };

    _this.fetchSuggestions = (0, _Utils.debounce)(_this._fetchSuggestions.bind(_this), _this.props.debounce);
    _this._fetchRequest = null;
    return _this;
  }

  MovieSelect.prototype._fetchSuggestions = function _fetchSuggestions(value) {
    var _this2 = this;

    if (value.length < 3) {
      return this.clearSuggestions();
    }

    if (this._fetchRequest) {
      this._fetchRequest.cancel();
    }

    this._fetchRequest = (0, _Utils.fetchWithCancel)('http://www.omdbapi.com/?s=' + value);

    this._fetchRequest.promise.then(function (_ref) {
      var canceled = _ref[0],
          Search = _ref[1].Search;

      if (canceled) {
        return;
      }

      _this2.setState({ suggestions: Search || [] });
    });
  };

  MovieSelect.prototype.clearSuggestions = function clearSuggestions() {
    if (this._fetchRequest) {
      this._fetchRequest.cancel();
      this._fetchRequest = null;
    }

    this.setState({ suggestions: [] });
  };

  MovieSelect.prototype.handleSuggestionSelected = function handleSuggestionSelected(event, _ref2) {
    var _this3 = this;

    var suggestion = _ref2.suggestion;

    event.preventDefault();

    fetch('http://www.omdbapi.com/?i=' + suggestion.imdbID + '&plot=full').then(function (resp) {
      return resp.json();
    }).then(function (movieModel) {
      return _this3.props.onMovieSelected(movieModel);
    });
  };

  MovieSelect.prototype.render = function render() {
    var _this4 = this;

    var _state = this.state,
        value = _state.value,
        suggestions = _state.suggestions;
    var _props = this.props,
        placeholder = _props.placeholder,
        theme = _props.theme;


    var inputProps = {
      placeholder: placeholder,
      value: value,
      onChange: function onChange(event, _ref3) {
        var newValue = _ref3.newValue;

        _this4.setState({ value: newValue });
      }
    };

    var isString = function isString(str) {
      return typeof str === 'string' || str instanceof String;
    };
    var isHref = function isHref(url) {
      return isString(url) && /^https?:\/\//.test(url);
    };

    var renderSuggestion = function renderSuggestion(_ref4) {
      var Title = _ref4.Title,
          Year = _ref4.Year,
          Poster = _ref4.Poster,
          imdbID = _ref4.imdbID;
      return _react2.default.createElement(
        'div',
        { className: 'movie-select-item--container' },
        _react2.default.createElement(
          'div',
          { className: 'movie-select-item--poster' },
          isHref(Poster) ? _react2.default.createElement('img', { className: 'movie-select-item--image', src: Poster, alt: Title }) : _react2.default.createElement('div', { className: 'movie-select-item--no-image' })
        ),
        _react2.default.createElement(
          'div',
          { className: 'movie-select-item--title' },
          Title
        ),
        _react2.default.createElement(
          'div',
          { className: 'movie-select-item--year' },
          Year
        ),
        _react2.default.createElement(
          'div',
          { className: 'movie-select-item--imdbID' },
          imdbID
        )
      );
    };

    return _react2.default.createElement(_reactAutosuggest2.default, {
      suggestions: suggestions,
      renderSuggestion: renderSuggestion,
      onSuggestionsFetchRequested: function onSuggestionsFetchRequested(_ref5) {
        var value = _ref5.value;
        return _this4.fetchSuggestions(value);
      },
      onSuggestionsClearRequested: this.clearSuggestions.bind(this),
      getSuggestionValue: function getSuggestionValue(val) {
        return val.Title;
      },
      inputProps: inputProps,
      theme: theme,
      onSuggestionSelected: this.handleSuggestionSelected.bind(this)
    });
  };

  return MovieSelect;
}(_react.Component);

exports.default = MovieSelect;


process.env.NODE_ENV !== "production" ? MovieSelect.propTypes = {
  debounce: _propTypes2.default.number,
  onMovieSelected: _propTypes2.default.func.isRequired,
  theme: _propTypes2.default.object,
  value: _propTypes2.default.string
} : void 0;

MovieSelect.defaultProps = {
  debounce: 350,
  value: ''
};
module.exports = exports['default'];