import * as _ from "lodash";
import * as fs from "fs"; 
import short from 'short-uuid';
import { ErrorService } from "../../../services/error.service";
import { OrderService } from "../../../services/order.service";

export class Order {

  async create(req,res) {
    
    try {

      let orderService = new OrderService();
      let _schema = {
        fullname : req.body.fullname,
        email	: req.body.email,
        number :	req.body.number,
        shippingAddress: req.body.shippingAddress,
        user:{connect : {id : req.user.id}},
        OrderDetails: {
          create: {
            product: {connect : {id : req.body.product.id}},
            qty : req.body.product.qty
          }
        }
      }

      let createOrder = await orderService.createOrder(_schema);
      res.status(200).send({ success: true, data: createOrder, msg: "Order Created Successfully", status: 200 });

      
    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }

  async orderListing(req,res) {
    try {
      
      let orderService = new OrderService();

      let GetOrders = await orderService.findAll({
        OrderDetails:
        {
          product:
          {
            userId: req.user.id  
          }
        }
      });
      res.status(200).send({ success: true, data: GetOrders, msg: "orderListing Fetched Successfully", status: 200 });


    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }
  }

  async orderStatusUpdate(req,res) {
    try {
      let orderService = new OrderService();

      let UpdateOrder = await orderService.update({id: req.params.id,},{status : req.body.status});
      res.status(200).send({ success: true, data: UpdateOrder, msg: "Updated Successfully", status: 200 });

    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }
  }

}
