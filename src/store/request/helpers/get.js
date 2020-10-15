export default {
  get (url, data) {
    return fetch(url, {
        body: JSON.stringify(data),
        /**
         *  - *default, no-cache, reload, force-cache, only-if-cached
         */
        cache: 'no-cache',
        /**
         *  - include, same-origin, *omit
         */
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json'
        },
        /**
         *  - *GET, POST, PUT, DELETE, etc
         */
        method: 'GET',
        /**
         *  - no-cors, cors, *same-origin
         */
        mode: 'cors',
        /**
         *  - manual, *follow, error
         */
        redirect: 'follow',
        /**
         *  - *client, no-referrer
         */
        referrer: 'no-referrer',
      })
      .then(response => response.json())
  }
}