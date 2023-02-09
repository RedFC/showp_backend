"use strict";
import { PrismaClient } from '@prisma/client';
import { BlockList } from '../models/blocklist.model'
import { IUser } from '../models/user.model'


interface IFindResolver {
  blockedId: string;
  userId: string;
}

interface IUserResolver {
  userId: string;
}

export class BlockService {

  private prisma;
  constructor() {
    this.prisma = new PrismaClient();
  }

  create(blockedList: IFindResolver): Promise<BlockList> {
    return new Promise((resolve, reject) => {
      this.prisma.blockedList
        .create({
          data: blockedList,
        })
        .then(blockedList => resolve(blockedList))
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())
    });
  }

  getBlockedUser(where ,select): Promise<BlockList> {
    return new Promise((resolve, reject) => {

      this.prisma.blockedList
        .findFirst({ where, select })
        .then(blockedList => resolve(blockedList))
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())

    });
  }

  getMyBlockedUsers(blockedList: IUserResolver): Promise<BlockList> {
    return new Promise((resolve, reject) => {

      this.prisma.blockedList
        .findMany({ where: { userId: blockedList.userId }, select: { blocked: { select: { profile: {select : {userId:true,username:true,name : true,profileImage:true}} } } }  })
        .then(blockedList => resolve(blockedList))
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())

    });
  }

  unBlockUser(blockedList: string): Promise< void >{

    return new Promise((resolve,reject) => {

      this.prisma.blockedList
        .delete({ where: { id: blockedList } })
        .then(blockedList => resolve(blockedList))
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())

    })

  }


}