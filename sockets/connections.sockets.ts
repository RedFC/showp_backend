import { ChatService } from '../app/http/services/room.service';
import { ConnectionService } from '../app/http/services/connection.service';

export default class SocketsConnections {
  
  connections(userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const connectionService = new ConnectionService();
        let getConnections = await connectionService.find({ userId: userId });
        console.log(getConnections);
        resolve(getConnections)
      } catch (e) {
        reject(e)
      }
    })
  }

  
}