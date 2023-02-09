"use strict";
import { PrismaClient } from '@prisma/client' 
export interface BlockList {
  id:string,
  blockedId?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}