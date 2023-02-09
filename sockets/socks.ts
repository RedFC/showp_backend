import fs from 'fs';
import { Server } from "socket.io";
const socket = require('socket.io');
import {SocketServices} from './socket.services'
const Socket_Service = new SocketServices();
import SocketsRooms from './rooms.sockets';
import SocketsConnections from './connections.sockets'
let connections = new SocketsConnections();
let rooms = new SocketsRooms();


module.exports = function (server) {
  try {
    const options = {
      cors: {
        origin: '*',
      },
    };
    
    let OBJ = {}

    let io = new Server(server,options);
    io.on('connection', (socket) => {
      socket.on("authentication", (token) => {
        Socket_Service.auth(token).then(result => {
          
          OBJ = {
            success: true,
            auth : true
          }
          socket.emit('authenticated', OBJ)

          socket.on('loadConnections', (data) => {
            let connections = new SocketsConnections();
            connections.connections(data)
              .then(result => {
                socket.emit("getconnections",result)
              })
          })
          
          rooms.socks("e6895e69-bb65-4f92-8989-6aae24defc86", "e6895e69-bb65-4f92-8989-6aae24defc87")

        }).catch(error => {
          OBJ = {
            success: false,
            auth: false,
            error : error.message
          }
          socket.emit('authenticated',OBJ)
        })
      })

    })

    } catch (error) {
      console.log(error.message);
    }

}