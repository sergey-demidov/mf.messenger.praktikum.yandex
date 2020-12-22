/* eslint-disable class-methods-use-this */

abstract class BaseAPI {
  create() { throw new Error('Not implemented'); }

  request() { throw new Error('Not implemented'); }

  update() { throw new Error('Not implemented'); }

  delete() { throw new Error('Not implemented'); }
}

export default BaseAPI;
