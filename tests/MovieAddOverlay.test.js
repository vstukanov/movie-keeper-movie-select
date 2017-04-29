import React from 'react';
import expect, { createSpy, spyOn } from 'expect';
import { mount } from 'enzyme';

import MovieAddOverlay from '../src/MovieAddOverlay';
import { waitForTick } from './FetchMock';

describe('<MovieAddOverlay />', () => {

  let movieAddOverlay;

  const selectedMovieStub = {
    Title: 'Test Title',
    Director: 'Test Director',
    Released: 'July 2015',
    imdbRating: '8.4'
  };

  const processedMovieModel = {
    title: 'Test Title',
    director: 'Test Director',
    year: 'July 2015',
    rating: 4
  };

  const onSubmitMovieSpy = createSpy();
  const onCloseSpy = createSpy();

  beforeEach(() => {
    movieAddOverlay = mount(<MovieAddOverlay
      onSubmitMovie={onSubmitMovieSpy}
      onClose={onCloseSpy}
    />);
  });

  afterEach(() => {
    onSubmitMovieSpy.reset();
    onCloseSpy.reset();
  });

  it('should be rendered', () => {
    expect(movieAddOverlay.find('.add-movie-container').exists()).toBe(true);
  });

  it('should properly update state on select movie', () => {
    movieAddOverlay.instance().handleMovieSelect(selectedMovieStub);

    return waitForTick()
      .then(() => expect(movieAddOverlay.state()).toEqual(processedMovieModel));
  });

  it('should update state on input change', () => {
    const newDirectorValue = 'test director';

    movieAddOverlay.ref('director').find('input')
      .simulate('change', { target: { value: newDirectorValue } });

    return waitForTick()
      .then(() =>
        expect(movieAddOverlay.state('director')).toBe(newDirectorValue));
  });

  it('should update state on rating change', () => {
    const rating = 1;
    movieAddOverlay.instance().updateRating(rating);
    expect(movieAddOverlay.state('rating')).toBe(rating);
  });

  it('should call hooks properly', () => {
    movieAddOverlay.find('.add-movie-form').simulate('submit');
    expect(onSubmitMovieSpy).toHaveBeenCalled();

    movieAddOverlay.ref('closeButton').find('button').simulate('click');
    expect(onCloseSpy).toHaveBeenCalled();
  });
});
