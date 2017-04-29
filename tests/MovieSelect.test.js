import expect, { spyOn, createSpy } from 'expect';
import React from 'react';
import { mount } from 'enzyme';

import MovieSelect from '../src/MovieSelect';
import { mockSearchMovie, mockGetMovie, waitFor, waitForTick } from './FetchMock';

const movieModel = {
  Title: "Breaking Bad",
  Year: "2008–2013",
  imdbID: "tt0903747",
  Type: "series",
  Poster: "https://_V1_SX300.jpg"
};

const movieWithId = imdbID =>
  Object.assign({}, movieModel, { imdbID });

const waitForDebounce = () => waitFor(compDebounceTime + 20);

const onMovieSelectedSpy = createSpy();
const compDebounceTime = 100;
const compInitialValue = 'test';

describe('<MovieSelect />', () => {

  let component, input, defaultSearchMock, defaultGetModelMock;

  beforeEach(() => {
    component = mount(<MovieSelect
        value={compInitialValue}
        onMovieSelected={onMovieSelectedSpy}
        debounce={compDebounceTime} />);

    input = component.find('input');
    defaultSearchMock = mockSearchMovie(input.props().value, [movieModel]);
    defaultGetModelMock = mockGetMovie(movieModel.imdbID, movieModel);
  });

  afterEach(() => {
    defaultSearchMock.restore();
    defaultGetModelMock.restore();
    onMovieSelectedSpy.reset();
    input.simulate('blur');
  });

  it('should pass initial value to input element', () => {
    expect(input.prop('value')).toBe(compInitialValue);
  });

  const requestSelect = value => {
    input.simulate('change', { target: { value: value || input.prop('value') } });
    input.simulate('focus');
  };

  const expectHasResult = (value = true) =>
    expect(component.find('.movie-select-item--container').exists()).toBe(value);

  const expectSuggestionID = id =>
    expect(component.find('.movie-select-item--imdbID').text()).toEqual(id);

  describe('fetch', () => {
    it('should be debounced', () => {
      requestSelect();
      expect(defaultSearchMock.spy).toNotHaveBeenCalled();
      return waitForDebounce()
          .then(() => expect(defaultSearchMock.spy).toHaveBeenCalled());
    });

    it('should be canceled for a short input', () => {
      requestSelect();

      return waitForDebounce()
          .then(() => {
            expectHasResult();

            // populate something short
            requestSelect('ab');
          })
          .then(() => waitForDebounce())
          .then(() => expectHasResult(false));
    });

    it('should ignore not actual responses', () => {
      const longRequestTime = 600;
      const longFetchMock = mockSearchMovie('long_request', [movieWithId('long_id')], longRequestTime);
      const shortFetchMock = mockSearchMovie('short_request', [movieWithId('short_id')]);

      requestSelect('long_request');

      const lrp = waitFor(longRequestTime + 20)
          .then(() => expectSuggestionID('short_id'));

      const srp = waitForDebounce()
          .then(() => requestSelect('short_request'))
          .then(() => waitForDebounce())
          .then(() => expectSuggestionID('short_id'))
      ;

      return Promise.all([srp, lrp]).then(() => {
        expect(longFetchMock.spy).toHaveBeenCalled();
        expect(shortFetchMock.spy).toHaveBeenCalled();

        longFetchMock.restore();
        shortFetchMock.restore();
      });
    });

    it('should clear result for not found', () => {
      const notFoundFetchMock = mockSearchMovie('not_found_request',
        null);

      requestSelect('not_found_request');

      return waitForDebounce()
        .then(() => expectHasResult(false))
        .then(() => notFoundFetchMock.restore());
    });

    it('should properly render movie without poster', () => {
      const withNoPosterFetchMock = mockSearchMovie('no_poster_request',
        [Object.assign({}, movieModel, { Poster: new String('N/A') })]
        );

      requestSelect('no_poster_request');

      return waitForDebounce()
        .then(() => {
          expectHasResult(true);
          expect(component.find('.movie-select-item--no-image').exists())
            .toBe(true);
          withNoPosterFetchMock.restore();
        });
    });
  });

  describe('result', () => {
    beforeEach(() => {
      requestSelect();
      return waitForDebounce();
    });

    it('should be rendered', () => {
      expectHasResult();
    });

    it('should be selectable', () => {
      expect(onMovieSelectedSpy).toNotHaveBeenCalled();
      component.find('.movie-select-item--container').simulate('click');

      return waitForTick()
          .then(() => expect(onMovieSelectedSpy)
            .toHaveBeenCalledWith(movieModel));
    });
  });
});
