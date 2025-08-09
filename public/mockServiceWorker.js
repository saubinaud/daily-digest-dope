
/* eslint-disable */
/* tslint:disable */

/**
 * Mock Service Worker (2.4.13).
 * @see https://github.com/mswjs/msw
 * - Please do NOT modify this file.
 * - Please do NOT serve this file on production.
 */

const INTEGRITY_CHECKSUM = '02f4ad4a2797f85668baf5a915d86d7e'
const IS_MOCKED_RESPONSE = Symbol('isMockedResponse')
const activeClientIds = new Set()

self.addEventListener('install', function () {
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', async function (event) {
  const clientId = event.source.id

  if (!clientId || !self.clients) {
    return
  }

  const client = await self.clients.get(clientId)

  if (!client) {
    return
  }

  const allClients = await self.clients.matchAll({
    type: 'window',
  })

  switch (event.data.type) {
    case 'KEEPALIVE_REQUEST': {
      sendToClient(client, {
        type: 'KEEPALIVE_RESPONSE',
        payload: {
          msw: {
            version: '2.4.13',
          },
        },
      })
      break
    }

    case 'INTEGRITY_CHECK_REQUEST': {
      sendToClient(client, {
        type: 'INTEGRITY_CHECK_RESPONSE',
        payload: INTEGRITY_CHECKSUM,
      })
      break
    }

    case 'MOCK_ACTIVATE': {
      activeClientIds.add(clientId)

      sendToClient(client, {
        type: 'MOCKING_ENABLED',
        payload: true,
      })
      break
    }

    case 'MOCK_DEACTIVATE': {
      activeClientIds.delete(clientId)
      break
    }

    case 'CLIENT_CLOSED': {
      activeClientIds.delete(clientId)

      const remainingClients = allClients.filter((client) => {
        return client.id !== clientId
      })

      // Unregister itself when there are no more clients
      if (remainingClients.length === 0) {
        self.registration.unregister()
      }

      break
    }
  }
})

self.addEventListener('fetch', function (event) {
  const { clientId, request } = event

  if (request.mode === 'navigate' && request.method === 'GET') {
    // If this is a navigation request, skip.
    return
  }

  if (activeClientIds.size === 0) {
    // No active clients. Bypass the request.
    return
  }

  // Clone the request because it might've been already used
  // (i.e. its body has been read and sent to the client).
  const requestClone = request.clone()

  function passthrough() {
    return fetch(requestClone)
  }

  // Bypass mocking when the client is not present in the list of the
  // active clients (i.e. has the mocking disabled).
  if (!activeClientIds.has(clientId)) {
    return
  }

  // Bypass initial page load requests (i.e. static assets).
  // The absence of the immediate/parent client in the map of the active clients
  // means that MSW hasn't dispatched the "MOCK_ACTIVATE" event yet
  // and is not ready to handle requests.
  if (!activeClientIds.has(clientId)) {
    return
  }

  // Bypass requests with the explicit bypass header.
  // Such requests can be issued by "ctx.fetch()".
  if (request.headers.get('x-msw-bypass') === 'true') {
    return
  }

  if (!request.url.match(/^https?:\/\//)) {
    return
  }

  event.respondWith(
    (async function () {
      const client = await self.clients.get(clientId)
      const response = await getResponse(request, client, requestId)

      // Send back the response clone for the "response:*" life-cycle events.
      // Ensure MSW is active and ready to handle the message, otherwise
      // this message will pend indefinitely.
      if (client && activeClientIds.has(client.id)) {
        ;(async function () {
          const responseClone = response.clone()
          sendToClient(client, {
            type: 'RESPONSE',
            payload: {
              requestId,
              type: responseClone.type,
              ok: responseClone.ok,
              status: responseClone.status,
              statusText: responseClone.statusText,
              body:
                responseClone.body === null ? null : await responseClone.text(),
              headers: Object.fromEntries(responseClone.headers.entries()),
              redirected: responseClone.redirected,
            },
          })
        })()
      }

      return response
    })(),
  )
})

async function getResponse(request, client, requestId) {
  const clonedRequest = request.clone()
  const spyReferrer = clonedRequest.referrer

  const resolverResult = await until(async () => {
    return await sendToClient(client, {
      type: 'REQUEST',
      payload: {
        id: requestId,
        url: request.url,
        mode: request.mode,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
        cache: request.cache,
        credentials: request.credentials,
        destination: request.destination,
        integrity: request.integrity,
        redirect: request.redirect,
        referrer: spyReferrer,
        referrerPolicy: request.referrerPolicy,
        body: await request.arrayBuffer(),
        bodyUsed: request.bodyUsed,
        keepalive: request.keepalive,
      },
    })
  })

  if (resolverResult.type === 'error') {
    return respondWithError(resolverResult.error)
  }

  if (resolverResult.type === 'response') {
    return resolverResult.response
  }

  return fetch(clonedRequest)
}

function sendToClient(client, message) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()

    channel.port1.onmessage = (event) => {
      if (event.data && event.data.error) {
        return reject(event.data.error)
      }

      resolve(event.data)
    }

    client.postMessage(
      message,
      [channel.port2],
    )
  })
}

function sleep(timeMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeMs)
  })
}

async function until(predicatePromise) {
  let result

  while (!(result = await predicatePromise())) {
    await sleep(2)
  }

  return result
}

function respondWithError(error) {
  return new Response(
    JSON.stringify({
      name: error.name,
      message: error.message,
      stack: error.stack,
    }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}

let requestId = 0
