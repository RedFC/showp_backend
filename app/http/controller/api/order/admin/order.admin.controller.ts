import * as _ from "lodash";
import * as fs from "fs"; 
import short from 'short-uuid'; 
import { ErrorService } from "../../../../services/error.service";
import { OrderService } from "../../../../services/order.service";
export class Order {
    async getAll(req,res) {
        try {
              
              const page= parseInt(req.query.page);
              const limit= parseInt(req.query.limit);
        
              function calculatePagesCount(pageSize, totalCount){
                return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize);
              }
              let orderService = new OrderService();
              let {data, count} = await orderService.findAllAdminOrder({},limit,page);
              const pages = calculatePagesCount(limit, count);

              res.send({
                success: true,
                msg: "Successfully Fetched",
                pages, 
                totalData:count, 
                data,
            });    
    
        } catch (error) {
          ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
        }
      }
}
