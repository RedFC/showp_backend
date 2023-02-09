"use strict";

export interface IReview {
  stars:String,
  message : String,
  userId : String,
  sellerId  : String,
  productId:string
  RatingStatus?:string,
  userId_sellerId_productId?:string,
  createdAt: String,
  updatedAt: String
}

export interface IReviewUpdate{
  stars:String,
  message:string,
  userId ?: String,
  sellerId ?: String,
  productId?:string
  RatingStatus:string,
  userId_sellerId_productId?:string,
  createdAt?: String,
  updatedAt?: String
}