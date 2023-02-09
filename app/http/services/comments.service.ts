"use strict";
import { PrismaClient } from '@prisma/client';
import { Review } from '../models/review.product.model'
import { IUser } from '../models/user.model'
import {Comments} from '../models/comments.model'

interface ICommentsResolver{
  comment: String,
  user : { connect: { id: IUser['id'] } },
  reviews : {connect : {id : Review['id']}[]}
}

export class CommentsService{

    private prisma;
    constructor() {
        this.prisma = new PrismaClient();
    }

    createComment(data:ICommentsResolver): Promise<Review> {
        return new Promise((resolve, reject) => {
            this.prisma.comments
                .create({ data,include:{user:{include:{profile:true}}} })
                .then(data => {
                    resolve(data)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        });
    }
  
    updateComment(where,data): Promise<Review> {
      return new Promise((resolve, reject) => {
          this.prisma.comments
              .update({where,data})
              .then(data => {
                  resolve(data)
              })
              .catch(error => reject(error))
              .finally(() => this.prisma.$disconnect())
      });
  }


  deleteComment(where): Promise<Review> {
    return new Promise((resolve, reject) => {
        this.prisma.comments
            .delete({where})
            .then(data => {
                resolve(data)
            })
            .catch(error => reject(error))
            .finally(() => this.prisma.$disconnect())
    });
  }

  findOne(where):Promise<Review> {
    return new Promise((resolve, reject) => {
        this.prisma.comments
            .findFirst({where})
            .then(data => {
                resolve(data)
            })
            .catch(error => reject(error))
            .finally(() => this.prisma.$disconnect())
    });
  }

    
}