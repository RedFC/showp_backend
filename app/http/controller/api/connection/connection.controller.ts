import * as _ from "lodash";
import { ConnectionService } from "../../../services/connection.service";
import { ValidateFollow } from "../../../models/follow.user.model";
import { ErrorService } from "../../../services/error.service";
import { UserService } from "../../../services/user.service";
import { IUser } from "../../../models/user.model";
export class Connection {
    
    async get(req, res) {
        try {
            let limit = _.toInteger(req.query.limit);
            let page = _.toInteger(req.query.page);
            let { id } = req.params;
            const connectionService = new ConnectionService();
            let { followers, following, count, profile } = await connectionService.findOneAndGetConnections({ id }, limit, page);
            let responseObject = {
                profile,
                success: true,
                page: page,
                pages: Math.ceil(count / limit),
                count
            };
            if (req.params.id == req.user.id) {
                responseObject['followers'] = followers
                responseObject['following'] = following
            }
            else if (req.params.id != req.user.id) {
                let FindOne = await connectionService.findOne({ userId: req.user.id, followId: req.params.id });
                if (FindOne) {
                    if (FindOne.status == 'ACCEPTED') {
                        responseObject['followers'] = followers
                        responseObject['following'] = following
                    }
                }             
            }
            res.send(responseObject);
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    async getAll(req, res) {
        try {
            const page= parseInt(req.query.page);
            const limit= parseInt(req.query.limit);

            function calculatePagesCount(pageSize, totalCount){
                return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize);
            }
            
            const connectionService = new ConnectionService();
            let { profile, followers, following, count }  = await connectionService.findOneAndGetConnections({ id:req.user.id }, limit, page);
            const pages = calculatePagesCount(limit, count);
            
            let responseObject = {
                    success: true,
                    msg: "Successfully Fetched",
                    pages, 
                    totalData:count, 
                    profile,
                    following,
                    followers
            };
            
            res.send(responseObject);
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    async follow(req, res) {
        try {
            const connectionValidate = new ValidateFollow();
            connectionValidate.validate(req.body, {
                error: (error) => ErrorService.handler(res, 400, { success: false, msg: error }),
                next: async () => {
                    const connectionService = new ConnectionService();
                    let _follow = await connectionService.create(req.body)
                    // const myUserService = new UserService()
                    // myUserService.redisUpdateUser(_follow.following)
                    // myUserService.redisUpdateUser(_follow.user)
                    res.send({ success: true, msg: `Following Request Has Been Sended To ${_follow.following.profile.name} (@${_follow.following.profile.username})` })
                }
            })
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    async getRequests(req, res) {
        try {
            
            const connectionService = new ConnectionService();

            let getRequest = await connectionService.findREQ({followId : req.user.id,status : "PENDING"})

            res.send({ success: true, msg: "Fetched Succesfully" , data : getRequest })
            
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }


    async acceptRequest(req, res) {
        try {
            const connectionValidate = new ValidateFollow();
            connectionValidate.vaidateRequestAccept(req.body, {
                error: (error) => ErrorService.handler(res, 400, { success: false, msg: error }),
                next: async () => {
                    const connectionService = new ConnectionService();
                    let findConnection = await connectionService.findOneConnection({ followId: req.body.userId, userId: req.body.followId });
                    let _follow = await connectionService.acceptRequest({id : findConnection.id},{status:"ACCEPTED"})
                    const myUserService = new UserService()
                    myUserService.redisUpdateUser(_follow.following)
                    myUserService.redisUpdateUser(_follow.user)
                    res.send({ success: true, msg: `${_follow.user.profile.name} (@${_follow.user.profile.username}) Following Request Has Accepted`})
                }
            })

        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    async unfollow(req, res) {
        try {
            const connectionValidate = new ValidateFollow();
            connectionValidate.validateUnFollow(req.body, {
                error: (error) => ErrorService.handler(res, 400, { success: false, msg: error }),
                next: async () => {
                    const connectionService = new ConnectionService();
                    let _follow = await connectionService.delete(req.body)
                    const myUserService = new UserService()
                    myUserService.redisUpdateUser(_follow.following)
                    myUserService.redisUpdateUser(_follow.user)
                    res.send({ success: true, msg: `Unfollowed ${_follow.following.profile.name} (@${_follow.following.profile.username})` })
                }
            })
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }


}
