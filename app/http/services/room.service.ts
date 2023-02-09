"use strict";
import { PrismaClient } from '@prisma/client';
import { IUser } from '../models/user.model'
import { IMessage } from '../models/message.model'
import { RedisService } from '../../cache/redis.service';

interface IRoomResolver {
  userOne: { connect: { id: IUser['id'] }},
  userTwo: { connect: { id: IUser['id'] }}
}

interface IMessageResolver {
  user:{connect:{id: IUser['id']}},
  room:{connect:{createdBy_createdWith:{createdBy: IUser['id'],createdWith: IUser['id']}}},
  message: string,
}



interface IRoomListResolver {
  data: IRoomResolver[],
  count: number
}

export class ChatService extends RedisService {

    private prisma;
    constructor() {
        super()
        this.prisma = new PrismaClient();
  }
  
  create(data: IRoomResolver): Promise<IRoomResolver>{
    return new Promise((resolve,reject) => {
      this.prisma.rooms
        .create({ data })
        .then(result => { resolve(result) })
        .catch(error => { reject(error) })
        .finally(() => this.prisma.$disconnect())
    })
  }

  createMsg(data: IMessageResolver): Promise<IMessageResolver>{
    return new Promise((resolve,reject) => {
      this.prisma.message
        .create({ data })
        .then(result => { resolve(result) })
        .catch(error => { reject(error) })
        .finally(() => this.prisma.$disconnect())
    })
  }

  getRoom(where): Promise<IRoomResolver>{
    return new Promise((resolve,reject) => {
      this.prisma.rooms
        .findFirst({where})
        .then(result => { resolve(result) })
        .catch(error => { reject(error) })
        .finally(() => this.prisma.$disconnect())
    })
  }

  getRooms(userid): Promise<IRoomResolver>{
    return new Promise((resolve,reject) => {
      this.prisma.rooms
        .findMany({
          where: {
            OR: [
              {
                createdBy: userid
              },
              {
                createdWith: userid
              },
            ]
          },
          select: {
            userOne: { select: { profile: { select: { name: true, userId: true } } } },
            userTwo: { select: { profile: { select: { name: true, userId: true } } } }
          }
        })
        .then(result => { resolve(result) })
        .catch(error => { reject(error) })
        .finally(() => this.prisma.$disconnect())
    })
  }

  getRoomslistWithPagination(userid, limit = null, page = null): Promise<IRoomListResolver>{
    return new Promise((resolve,reject) => {
      this.prisma.rooms
        .findMany({
          where: {
            OR: [
              {
                createdBy: userid
              },
              {
                createdWith: userid
              },
            ]
          },
          skip: limit * (page - 1) ? limit * (page - 1) : 0, 
          take: limit ? limit : 50,
          select: {
            userOne: { select: { profile: { select: { name: true, userId: true } } } },
            userTwo: { select: { profile: { select: { name: true, userId: true } } } }
          }
        })
        .then(async result => {
          const count = await this.prisma.rooms.count({ 
            where: {
            OR: [
              {
                createdBy: userid
              },
              {
                createdWith: userid
              },
            ]
          } }); 
          resolve({data:result, count}); 
        })
        .catch(error => { reject(error) })
        .finally(() => this.prisma.$disconnect())
    })
  }

  getSingleRooms(userid, connectId): Promise<IRoomResolver>{
    return new Promise((resolve,reject) => {
      this.prisma.rooms
        .findFirst({
          where: {
            OR: [
              {
                createdBy: userid,
                createdWith: connectId,
              },
              {
                createdBy: connectId,
                createdWith: userid
              },
            ]
          },
          // select: {
            
          //   userOne: { select: { profile: { select: { name: true, userId: true } } } },
          //   userTwo: { select: { profile: { select: { name: true, userId: true } } } },
          // }
        })
        .then(result => { resolve(result) })
        .catch(error => { reject(error) })
        .finally(() => this.prisma.$disconnect())
    })
  }

  getUserMsg(userid, connectId): Promise<IMessage>{
    return new Promise((resolve,reject) => {
      this.prisma.rooms
        .findMany({
          where: {
            
            OR: [
              {
                createdBy: userid,
                createdWith: connectId,
              },
              {
                createdBy: connectId,
                createdWith: userid
              },
            ]
          },
          include:{message:true}
        })
        .then(result => { resolve(result) })
        .catch(error => { reject(error) })
        .finally(() => this.prisma.$disconnect())
    })
  }
  

}