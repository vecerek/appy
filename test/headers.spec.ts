import fetchMock from 'fetch-mock';
import {left} from 'fp-ts/lib/Either';
import {withHeaders} from '../src/combinators/headers';
import * as appy from '../src/index';

test('withHeaders() should set provided headers on `Req`', async () => {
  const fetch = fetchMock.sandbox().mock('http://localhost/api/resources', 200);

  const request = withHeaders({'Content-Type': 'application/json'})(
    appy.request(fetch)
  );

  await request('http://localhost/api/resources')();

  expect(fetch.lastOptions()).toEqual({
    headers: new Headers({'Content-Type': 'application/json'})
  });
});

test('withHeaders() should merge provided headers with `Req` ones', async () => {
  const fetch = fetchMock.sandbox().mock('http://localhost/api/resources', 200);

  const request = withHeaders({'Content-Type': 'application/json'})(
    appy.get(fetch)
  );

  await request([
    'http://localhost/api/resources',
    {
      headers: {
        Authorization: 'Bearer TOKEN',
        'Content-Type': 'text/html'
      }
    }
  ])();

  expect(fetch.lastOptions()).toEqual({
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: 'Bearer TOKEN'
    }),
    method: 'GET'
  });
});

test('withHeaders() should merge provided headers with `Req` ones - as Headers object', async () => {
  const fetch = fetchMock.sandbox().mock('http://localhost/api/resources', 200);

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const request = withHeaders(headers)(appy.request(fetch));

  await request('http://localhost/api/resources')();

  expect(fetch.lastOptions()).toEqual({headers});
});

test('withHeaders() should merge provided headers with `Req` ones - as array of strings', async () => {
  const fetch = fetchMock.sandbox().mock('http://localhost/api/resources', 200);

  const headers = [['Content-Type', 'application/json']];
  const request = withHeaders(headers)(appy.request(fetch));

  await request('http://localhost/api/resources')();

  expect(fetch.lastOptions()).toEqual({
    headers: new Headers({'Content-Type': 'application/json'})
  });
});

test('withHeaders() should fail if provided headers has forbidden name', async () => {
  const fetch = fetchMock.sandbox().mock('http://localhost/api/resources', 200);

  const request = withHeaders({'=': 'asdasd'})(appy.request(fetch));

  const result = await request('http://localhost/api/resources')();

  expect(result).toEqual(
    left({
      type: 'RequestError',
      error: new TypeError('= is not a legal HTTP header name'),
      input: ['http://localhost/api/resources', {}]
    })
  );

  expect(fetch.called()).toBe(false);
});
