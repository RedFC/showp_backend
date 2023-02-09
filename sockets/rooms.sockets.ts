import { ChatService } from '../app/http/services/room.service';

export default class SocketsRooms {
  private socket;
  // private roomService;
  // constructor(_socket) {
  //   this.socket = _socket
  // }
  socks(v1,v2) {
    let roomService = new ChatService();

    roomService.getRoom({
      OR: [
        {
          AND: [
            {
              createdBy: v1,
            },
            {
              createdWith:v2 
            }
          ]
        },
        {
          AND: [
            {
              createdBy:v2 ,
            },
            {
              createdWith: v1
            }
          ]
        }
      ]
    })
      .then(result => {
        if (result) {
          console.log(result);
          // return result['createdBy'] + result['createdWith'];
        } else {
          roomService.create({
            userOne: { connect: { id: v1 } },
            userTwo: { connect: { id: v2 } }
          })
          .then((result) => {
            console.log(result)
          })
          .catch()
        }
      })
      .catch(error => {
        console.log(error.message);
      })
    return this.socket
  }
}