'use strict'

import { IUser } from "./user.model"

export interface IOrder{
  forEach: any
  id : String,
  fullname : String,
  email	: String
  number:	String
  shippingAddress:String
  userId:IUser['id']
  status:String
}