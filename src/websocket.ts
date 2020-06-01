import * as WS from 'ws'
import * as http from 'http'
import RemixdClient from './services/remixdClient'
const { buildWebsocketClient } = require('@remixproject/plugin-ws')

export default class WebSocket {
  port: number
  opt: { 
    [key: string]: string
  }
  server: http.Server
  wsServer: WS.Server
  remixdClient: RemixdClient

  constructor (port: number, opt: {
    [key: string]: string
  }, remixdClient: RemixdClient) {
    this.port = port
    this.opt = opt
    this.remixdClient = remixdClient
  }

  start (callback?: Function) {
    const obj = this

    this.server = http.createServer(function (request, response) {
      console.log((new Date()) + ' Received request for ' + request.url)
      response.writeHead(404)
      response.end()
    })
    const loopback = '127.0.0.1'

    this.server.listen(this.port, loopback, function () {
      console.log((new Date()) + ' Remixd is listening on ' + loopback + ':65520')
    })
    this.wsServer = new WS.Server({ server: this.server })
    this.wsServer.on('connection', function connection(ws) {
      const client = buildWebsocketClient(ws, obj.remixdClient)

      if(callback) callback(client)
    })
  }

  close () {
    console.log('this.server: ', this.server)
    this.server.close()
  }
}
