import { ErrorService } from "../../../services/error.service";
import { ChatService } from "../../../services/room.service";
import { UserService } from "../../../services/user.service";

export class RoomClass  {

   async createRoom(req, res){
        try {

            const service = new ChatService();
            const userService = new UserService();

            const user = await userService.findOne({id: req.body.id});

            if(!user) return res.status(200).send({ success: false, msg: "User Not Found", status: 400 }); 

            if(req.user.id==req.body.id){
                return res.status(200).send({ success: false, msg: "Connot Perform This Operation", status: 400 });    
            }
            
            const check = await service.getSingleRooms(req.user.id, req.body.id)
            
            if(check){
                res.status(200).send({ 
                    success: true, 
                    status: 200, 
                    msg: "Room is Already created", 
                    data: check, 
                });
            }else{

                const room = await service.create({
                    userOne:{connect:{id: req.user.id}}, 
                    userTwo:{connect:{id: req.body.id}}
                });
                res.status(200).send({ 
                    success: true, 
                    status: 200 ,
                    msg: "Room Has Been Created", 
                    data: room, 
                });
            }
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    async getFriendList(req, res){
        try {
            const service = new ChatService();
            const page= parseInt(req.query.page);
            const limit= parseInt(req.query.limit);
            
            function calculatePagesCount(pageSize, totalCount){
                return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize);
            }
            const {data, count} = await service.getRoomslistWithPagination(req.user.id, limit, page) as any;
              const pages = calculatePagesCount(limit, count);
            
            const result =  data.map((ele)=>{
                
                if(ele.userOne.profile.userId==req.user.id){
                    delete ele.userOne
                }
                if(ele.userTwo.profile.userId==req.user.id){
                    delete ele.userTwo
                }
                    return ele;
                })
            res.status(200).send({ 
                success: true, 
                status: 200 ,
                msg: "Fetched Successfully", 
                pages,
                totalData:count,
                data: result, 
            });
            
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    async sendMsg(req, res){
        try {
            const service = new ChatService();

            const room = await service.getSingleRooms(req.user.id, req.body.id) as any;
            
            if(!room) return res.status(200).send({ success: false, msg: "Room was not found", status: 400 });
            
            const msg = await service.createMsg({
                user:{connect:{id: req.user.id}},
                room:{connect:{createdBy_createdWith:{createdBy: room.createdBy, createdWith: room.createdWith}}} , 
                message: req.body.message
            });
            
                res.status(200).send({ 
                    success: true, 
                    status: 200 ,
                    msg: "Message has been sent", 
                    data: msg, 
                });
            
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }

    async getMsg(req, res){
        try {

            const service = new ChatService();
            const userService = new UserService();

            const user = await userService.findOne({id: req.params.id});

            if(!user) return res.status(200).send({ success: false, msg: "User Not Found", status: 400 });

            const room = await service.getSingleRooms(req.user.id, req.params.id) as any;
            console.log(room,"hellow")
            if(!room) return res.status(200).send({ success: false, msg: "Room was not found", status: 400 });

            const msgs = await service.getUserMsg(req.user.id, req.params.id) as any;
            console.log(msgs,"koko")
                res.status(200).send({ 
                    success: true, 
                    status: 200 ,
                    msg: "Fetched Successfully", 
                    data: msgs, 
                });
            
        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
    }
}

