"use strict";
import { PrismaClient } from '@prisma/client';
import { ReportProduct,ReportReview,ReportUser } from '../models/report.model';
import { RedisService } from '../../cache/redis.service';
import { Product } from '../models/product.model';
import { IUser } from '../models/user.model';

interface IReportResolver { 
  user: { connect: { id: IUser['id'] } },
  review : {connect : { id : Product['id']}},
  message : String
}

export class ReportService extends RedisService{

  private prisma;
  constructor() {
    super()
    this.prisma = new PrismaClient();
  }

  createReviewReport(_schema : IReportResolver): Promise<Product> {
    return new Promise((resolve, reject) => {
      this.prisma.reportReview
        .create({
          data: _schema
        })
        .then(report => resolve(report))
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())
    });
  }

  findAll(where?): Promise<ReportReview>{
    return new Promise((resolve,reject) => {
      this.prisma.reportReview
        .findMany(where)
        .then(report => resolve(report))
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())
    })
  }

  findOne(where): Promise<ReportReview>{
    return new Promise((resolve,reject) => {

      this.prisma.reportReview
        .findFirst({where})
        .then(report => resolve(report))
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())

    })
  }

  updateReport(where,data): Promise<ReportReview>{
    return new Promise((resolve,reject) => {
      this.prisma.reportReview
        .update({where,data})
        .then(report => resolve(report))
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())
    })
  }

  
}