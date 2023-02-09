"use strict";
import { PrismaClient } from '@prisma/client'
export interface IImages {
    id?: string;
    cloudinaryId: string;
    path: string;
    createdAt?: Date;
    updatedAt?: Date;
}