"use strict";

export interface Product {
  id:string,
  published?: boolean,
  title: string,
  description: string,
  baseCost: BigInteger,
  currency: string,
  refundable?:boolean,
  userId: string,
  isBlocked?: boolean,
  quantity : BigInteger
}