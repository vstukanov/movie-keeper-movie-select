
import 'whatwg-fetch';
import { spyOn, createSpy } from 'expect';

export function waitFor (delay) {
  return new Promise(fullfill => setTimeout(fullfill, delay));
}

const generateResponse = (data, delay) =>
    (delay
      ? waitFor(delay).then(() => data)
      : Promise.resolve(data))
        .then(data => ({ json: () => Promise.resolve(data) }));

const fetchSpy = spyOn(window, 'fetch');
const spyRegister = {};

fetchSpy.andCall(url =>
    (spyRegister.hasOwnProperty(url))
        ? spyRegister[url]()
        : fetchSpy.andCallThrough()
);

export function mockFetch (url, response, delay) {
  const spy = createSpy();

  spyRegister[url] = spy;
  spy.andCall(() => generateResponse(response, delay));

  return {
    spy,
    restore: () => {
      delete spyRegister[url];
    }
  };
}

export function mockSearchMovie (searh, response, ...args) {
  return mockFetch(`http://www.omdbapi.com/?s=${searh}`, { Search: response }, ...args);
}

export function mockGetMovie (id, response, ...args) {
  return mockFetch(`http://www.omdbapi.com/?i=${id}&plot=full`, response, ...args);
}

export function restoreFetch()
{
  fetchSpy.reset();
}

