import fetchMock from 'fetch-mock';
import {left, mapLeft} from 'fp-ts/lib/Either';
import {pipe} from 'fp-ts/lib/pipeable';
import {withBody} from '../src/combinators/body';
import * as appy from '../src/index';

afterEach(() => {
  fetchMock.reset();
});

test('withBody() should set provided JSON body on `Req` (stringified)', async () => {
  fetchMock.mock('http://localhost/api/resources', 200);

  const body = {id: 123, name: 'foo bar'};
  const request = withBody(body)(appy.post);

  await request('http://localhost/api/resources')();

  expect(fetchMock.lastOptions()).toEqual({
    body: JSON.stringify(body),
    method: 'POST'
  });
});

test('withBody() should fail if provided JSON body throws error when stringified', async () => {
  fetchMock.mock('http://localhost/api/resources', 200);

  const body = {} as any;
  body.itself = body;
  const request = withBody(body)(appy.post);

  const result = await request('http://localhost/api/resources')();

  // --- Use this trick because Nodejs error messages are different in v10 and v12
  const check = pipe(
    result,
    mapLeft(e => ({
      ...e,
      error:
        e.error instanceof TypeError &&
        e.error.message.includes('Converting circular structure to JSON')
    }))
  );

  expect(check).toEqual(
    left({
      type: 'RequestError',
      error: true,
      input: ['http://localhost/api/resources', {}]
    })
  );

  expect(fetchMock.called()).toBe(false);
});

test('withBody() should set provided body on `Req` - string', async () => {
  fetchMock.mock('http://localhost/api/resources', 200);

  const body = '{id: 123, name: "foo bar"}';
  const request = withBody(body)(appy.post);

  await request('http://localhost/api/resources')();

  expect(fetchMock.lastOptions()).toEqual({
    body,
    method: 'POST'
  });
});

test('withBody() should set provided body on `Req` - Blob', async () => {
  fetchMock.mock('http://localhost/api/resources', 200);

  const body = new Blob(['{id: 123, name: "foo bar"}']);
  const request = withBody(body)(appy.post);

  await request('http://localhost/api/resources')();

  expect(fetchMock.lastOptions()).toEqual({
    body,
    method: 'POST'
  });
});

test('withBody() should set provided body on `Req` - FormData', async () => {
  fetchMock.mock('http://localhost/api/resources', 200);

  const body = new FormData();
  body.set('id', '123');
  body.set('name', 'foo bar');

  const request = withBody(body)(appy.post);

  await request('http://localhost/api/resources')();

  expect(fetchMock.lastOptions()).toEqual({
    body,
    method: 'POST'
  });
});

test('withBody() should set provided body on `Req` - URLSearchParams', async () => {
  fetchMock.mock('http://localhost/api/resources', 200);

  const body = new URLSearchParams();
  body.set('id', '123');
  body.set('name', 'foo bar');

  const request = withBody(body)(appy.post);

  await request('http://localhost/api/resources')();

  expect(fetchMock.lastOptions()).toEqual({
    body,
    method: 'POST'
  });
});
