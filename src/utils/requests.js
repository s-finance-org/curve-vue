// TODO:
const Request = (method, url, data,
  { cache = 'no-cache',
    credentials = 'same-origin',
    headers = {
      'content-type': 'application/json'
    },
    mode = 'cors',
    redirect = 'follow',
    referrer = 'no-referrer'
  } = {}) => {
    const opts = {
      /**
       *  - *default, no-cache, reload, force-cache, only-if-cached
       */
      cache,
      /**
       *  - include, same-origin, *omit
       */
      credentials,
      headers: new Headers(headers),
      /**
       *  - *GET, POST, PUT, DELETE, etc
       */
      method,
      /**
       *  - no-cors, cors, *same-origin
       */
      mode,
      /**
       *  - manual, *follow, error
       */
      redirect,
      /**
       *  - *client, no-referrer
       */
      referrer,
    }
    const methodTypes = {
      GET () {
        var reQueryString = /\?/
        url += (reQueryString.test(url) ? '&' : '?') + '_=' + new Date().getTime()
      },
      POST () {
        opts.body = JSON.stringify(data)
      }
    }

    methodTypes[method]
       && methodTypes[method]()

    return fetch(url, opts)
      .then(response => response.json())
  }

export default {
  /**
   *  @param {string} url
   *  @param {Object} data
   *  @return {Promise}
   */
  get: (url, data) => Request('GET', url, data)
}
