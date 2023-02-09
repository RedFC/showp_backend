import * as _ from "lodash";
import * as fs from "fs"; 
import short from 'short-uuid';
import { BlockService } from "../../../services/block.service";
import { UserService } from "../../../services/user.service";
import { ErrorService } from "../../../services/error.service";

export class Blocked {

  async blockUser(req,res) {
    
    try {

      let _schema = {
          blockedId: req.params.id,
          userId: req.user.id
      }

      const userService = new UserService();

      let getUser = await userService.findOne({ id: _schema.blockedId });
      if (!getUser) {
        return ErrorService.handler(res, 409, { success: false, msg: "User Not Found", status: 409 });
      }

      const myblockService = new BlockService();

      let getData = await myblockService.getBlockedUser({ blockedId: _schema.blockedId, userId: _schema.userId },{id : true,blockedId:true,userId:true});
      if (getData)
        return ErrorService.handler(res, 409, { success: false, msg: "User Already Blocked", status: 409 });

      let datacreated = await myblockService.create(_schema)
      if (datacreated) {
        res.status(200).send({ success: true, data: datacreated, msg: "User Has Been Blocked", status: 200 });
      } else {
        res.status(500).send({ success: false, msg: "Some Error", status: 500 }); 
      }

    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }
    
  }

  async getMyBlockList(req,res) {
    
    try {
      
      let _schema = {
        userId: req.user.id
      }

      const myblockService = new BlockService();
      let getData = await myblockService.getMyBlockedUsers(_schema);
      
      res.status(200).send({ success: true, data: getData, msg: "Success", status: 200 });
    


    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }

  async unBlockUser(req, res) {
    
    try {

      let _schema = {
        userId: req.user.id,
        blockedId : req.params.id
      }

      const userService = new UserService();

      let getUser = await userService.findOne({ id: _schema.blockedId });
      if (!getUser) {
        return ErrorService.handler(res, 409, { success: false, msg: "User Not Found", status: 409 });
      }

      const myblockService = new BlockService();

      let getData = await myblockService.getBlockedUser({ blockedId: _schema.blockedId, userId: _schema.userId },{id : true});
      if (!getData)
        return ErrorService.handler(res, 409, { success: false, msg: "Blocked User Not Found", status: 409 });

      let unBlockUser = await myblockService.unBlockUser(getData.id);
      res.status(200).send({ success: true, data: unBlockUser, msg: "Success", status: 200 });
      
    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }



}
