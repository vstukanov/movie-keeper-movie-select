'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _flexboxReact = require('flexbox-react');

var _flexboxReact2 = _interopRequireDefault(_flexboxReact);

var _form = require('muicss/lib/react/form');

var _form2 = _interopRequireDefault(_form);

var _input = require('muicss/lib/react/input');

var _input2 = _interopRequireDefault(_input);

var _button = require('muicss/lib/react/button');

var _button2 = _interopRequireDefault(_button);

var _reactRating = require('react-rating');

var _reactRating2 = _interopRequireDefault(_reactRating);

var _Utils = require('./Utils');

var _MovieSelect = require('./MovieSelect');

var _MovieSelect2 = _interopRequireDefault(_MovieSelect);

require('./MovieAddOverlay.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

    return _react2.default.createElement(
      _flexboxReact2.default,
      { className: 'overlay' },
      _react2.default.createElement(
        _flexboxReact2.default,
        { className: 'add-movie-container' },
        _react2.default.createElement(
          _form2.default,
          {
            onSubmit: (0, _Utils.preventAndCall)(onSubmitMovie, this.state),
            className: 'add-movie-form' },
          _react2.default.createElement(
            'legend',
            null,
            'Add Movie'
          ),
          _react2.default.createElement(_MovieSelect2.default, {
            value: this.state.title,
            onMovieSelected: this.handleMovieSelect.bind(this),
            placeholder: 'Type movie title' }),
          _react2.default.createElement(_input2.default, { ref: 'director', value: this.state.director,
            label: 'Director',
            floatingLabel: true,
            onChange: updateState('director') }),
          _react2.default.createElement(_input2.default, { ref: 'year', value: this.state.year,
            label: 'Year of Release',
            floatingLabel: true,
            onChange: updateState('year') }),
          _react2.default.createElement(
            'div',
            { className: 'mui-textfield', style: { marginBottom: 0 } },
            _react2.default.createElement(
              'div',
              { style: { marginBottom: 15 } },
              'Rating'
            ),
            _react2.default.createElement(_reactRating2.default, {
              onClick: this.updateRating.bind(this),
              initialRate: this.state.rating })
          ),
          _react2.default.createElement(
            'div',
            { style: { textAlign: 'right' } },
            _react2.default.createElement(
              _button2.default,
              {
                ref: 'closeButton',
                variant: 'flat',
                onClick: (0, _Utils.preventAndCall)(onClose) },
              'Cancel'
            ),
            _react2.default.createElement(
              _button2.default,
              { variant: 'flat', color: 'primary' },
              'Submit'
            )
          )
        )
      )
    );
  };

  return MovieAddOverlay;
}(_react.Component);

exports.default = MovieAddOverlay;


MovieAddOverlay.protoTypes = {
  onSubmitMovie: _propTypes2.default.func.isRequired,
  onClose: _propTypes2.default.func.isRequired
};
module.exports = exports['default'];