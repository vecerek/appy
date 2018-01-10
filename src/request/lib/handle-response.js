// @flow

const toPayload = (t: string): Payload => {
  try {
    return JSON.parse(t);
  } catch (e) {
    return {
      message: t
    }
  }
};

const normalize = (ok: boolean, status: number) => (payload: Payload): NomarlizedResponse =>
  ok
    ? Promise.resolve({ status, payload })
    : Promise.reject({ status, payload });

export default (r: Response): Promise<NomarlizedResponse> =>
  r.text()
    .then(toPayload)
    .then(normalize(r.ok, r.status));