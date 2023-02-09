import { RedisService } from "../app/cache/redis.service"
import moment from "../app/modules/moment";

export class SocketServices extends RedisService{

  constructor() {
    super()
  }

  auth(token):Promise<void>{
    return new Promise((resolve, reject) => {
      if (!token) {
          reject({
            success: false,
            msg: "Access Denied. No token provided.",
            code: 401,
          })
        }
      
      super.getUserStateToken(token).then(data => {
                        if (data == null) {
                            console.log("Compromised Token!")
                            reject({
                              success: false,
                              msg: "Access Denied. Compromised Authorized Token.",
                              status: 401,
                          })
                        } else {
                            super.setUserStateToken(token, moment(moment().add(48, 'hours')).fromNow_seconds())
                                .then((success) => {
                                    if (success) {
                                        resolve(token)
                                    }
                                })
                                .catch((error) => reject(error));
                      }
            })
    })
  }


}