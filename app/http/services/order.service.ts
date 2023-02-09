"use strict";
import { PrismaClient } from '@prisma/client';
import { RedisService } from '../../cache/redis.service';
import { IOrder } from '../models/order.model';
import { IOrderDetails } from '../models/orderdetails.model';
import { Product } from '../models/product.model';
import { IUser } from '../models/user.model';

interface Order {
  fullname : String,
  email	: String
  number:	String
  shippingAddress:String
  user:{connect : {id : IUser['id']}}
  OrderDetails: {
    create: 
      {
      product: { connect: { id: Product['id'] } },
      qty : Number
      }
  }
}

interface IOrderAdmin {
  data: IOrder[],
  count: number

}

let select = {
    fullname : true,
    email	: true,
    number:	true,
    shippingAddress:true,
    status:true,
    user: {
      select: { profile: true }
    },
    OrderDetails: {
        select: {
            product: {
              select: {
                  id:true,
                  title: true,
                  description: true,
                  baseCost: true,
                  currency: true,
              }
            }
        }
    }
}

let historySelect = {
    id : true,
    fullname: true,
    OrderDetails: {
        select: {
            product: {
              select: {

                  title: true,
                  description: true,
                  baseCost: true,
                  currency: true
              }
            }
        }
    }
}


export class OrderService extends RedisService {

    private prisma;
    constructor() {
        super()
        this.prisma = new PrismaClient();
    }

    createOrder( data : Order): Promise<IOrder> {
        return new Promise((resolve, reject) => {
            this.prisma.orders
              .create({data})
                .then(data => {
                    resolve(data)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        });
    }

  findAll(where): Promise<IOrder>{
    return new Promise((resolve, reject) => {
        this.prisma.orders
          .findMany({
            where,select 
              })
          .then(data => {
              resolve(data)
          })
          .catch(error => reject(error))
          .finally(() => this.prisma.$disconnect())
    });
  }

  findOne(where): Promise<IOrder>{
    return new Promise((resolve, reject) => {
        this.prisma.orders
          .findFirst({
            where,select
              })
          .then(data => {
              resolve(data)
          })
          .catch(error => reject(error))
          .finally(() => this.prisma.$disconnect())
    });
  }

  update(where, data): Promise<IOrder>{
    return new Promise((resolve, reject) => {

      this.prisma.orders
        .update({where,data})
          .then(data => {
              resolve(data)
          })
          .catch(error => reject(error))
          .finally(() => this.prisma.$disconnect())

    })
  }

  findAllAdminOrder(where, limit = null, page = null): Promise<IOrderAdmin>{
    return new Promise((resolve, reject) => {
        this.prisma.orders
          .findMany({
            where, 
            skip: limit * (page - 1) ? limit * (page - 1) : 0, 
            take: limit ? limit : 50,
            select 
              })
          .then(async data => {
                    const count = await this.prisma.orders.count({ where })
                    resolve({ data, count })
          })
          .catch(error => reject(error))
          .finally(() => this.prisma.$disconnect())
    });
  }
  
}