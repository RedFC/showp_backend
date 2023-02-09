'use strict'

import { Product } from "@prisma/client"
import { IOrder } from "./order.model"

export interface IOrderDetails{
  id:String
  orderId: IOrder['id']
  productId : Product['id']
  qty : Number
}