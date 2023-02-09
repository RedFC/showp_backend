"use strict";
import { PrismaClient } from '@prisma/client';
import { RedisService } from '../../cache/redis.service';
import { IAboutUs,IContactUs,IReturnPolicy,ITermsAndConditions } from '../models/policies.model';

interface IAboutUsResolver{
  aboutus : String
}


export class SettingsService extends RedisService {

    private prisma;
    constructor() {
        super()
        this.prisma = new PrismaClient();
    }

    createAboutus( data : IAboutUsResolver ): Promise<IAboutUs> {
        return new Promise((resolve, reject) => {
            this.prisma.aboutUs
              .create({data})
                .then(data => {
                    resolve(data)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
        });
  }

  updateAboutus(where,data): Promise<IAboutUs> {
    return new Promise((resolve, reject) => {
        this.prisma.aboutUs
          .create(where,data)
            .then(data => {
                resolve(data)
            })
            .catch(error => reject(error))
            .finally(() => this.prisma.$disconnect())
    });
  }
  
  getAboutus(): Promise<IAboutUs> {
    return new Promise((resolve, reject) => {
        this.prisma.aboutus
            .findFirst()
            .then(data => {
                resolve(data)
            })
            .catch(error => reject(error))
            .finally(() => this.prisma.$disconnect())
    });
  }
  
  // terms and condition

  createTerms( data : {termsandconditions : String} ): Promise<ITermsAndConditions> {
    return new Promise((resolve, reject) => {
        this.prisma.termsAndConditions
          .create({data})
            .then(data => {
                resolve(data)
            })
            .catch(error => reject(error))
            .finally(() => this.prisma.$disconnect())
    });
}

updateTerms(where,data): Promise<ITermsAndConditions> {
return new Promise((resolve, reject) => {
    this.prisma.termsAndConditions
      .update({where,data})
        .then(data => {
            resolve(data)
        })
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())
});
}

getTerms(): Promise<ITermsAndConditions> {
return new Promise((resolve, reject) => {
    this.prisma.termsAndConditions
        .findFirst()
        .then(data => {
            resolve(data)
        })
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())
});
}

// Return Policy
  
  
createReturnPolicy( data : {returnpolicy : String} ): Promise<IReturnPolicy> {
  return new Promise((resolve, reject) => {
      this.prisma.returnPolicy
        .create({data})
          .then(data => {
              resolve(data)
          })
          .catch(error => reject(error))
          .finally(() => this.prisma.$disconnect())
  });
}

updateReturnPolicy(where,data): Promise<IReturnPolicy> {
return new Promise((resolve, reject) => {
  this.prisma.returnPolicy
    .create(where,data)
      .then(data => {
          resolve(data)
      })
      .catch(error => reject(error))
      .finally(() => this.prisma.$disconnect())
});
}

getReturnPolicy(): Promise<IReturnPolicy> {
return new Promise((resolve, reject) => {
  this.prisma.returnPolicy
      .findFirst()
      .then(data => {
          resolve(data)
      })
      .catch(error => reject(error))
      .finally(() => this.prisma.$disconnect())
});
}

  
  
}