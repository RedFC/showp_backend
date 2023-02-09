"use strict";
import { PrismaClient } from '@prisma/client';
import { Category } from '../models/category.model'
import { IImages } from '../models/productImages.model'
import { SubCategory } from '../models/sub.category.model'
import { Product } from '../models/product.model'
import { IUser } from '../models/user.model';
import { Itags } from '../models/tag.model';
import { RedisService } from '../../cache/redis.service';

interface IProductResolver {
  published?: boolean,
  title: string,
  description: string,
  baseCost: Number,
  currency: string,
  refundable?: boolean,
  authorId: string,
  tags: {
    connectOrCreate : [where : [name : Itags['name']],create : [name : Itags['name']]]
  },
  user: { connect: { id: IUser['id'] } },
  categories: {
    connect: [id: Category['id']]
  },
  quantity : Number,
  images: {
    connect : [cloudinaryId: IImages['cloudinaryId']]
  }

}

interface IReturnResolver {
  Products: Product[];
  count: number;
}


export class ProductService extends RedisService{

  private prisma;
  constructor() {
    super()
    this.prisma = new PrismaClient();
  }

  createCategory(schema: string): Promise<Category> {
    return new Promise((resolve, reject) => {
      this.prisma.category
        .create({
          data: { name: schema }
        })
        .then(Category => resolve(Category))
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())
    });
  }

  createSubCategory(name: string, categoryId: string): Promise<SubCategory> {
    return new Promise((resolve, reject) => {
      this.prisma.subCategory
        .create({
          data: { name: name, categoryId: categoryId }
        })
        .then(SubCategory => resolve(SubCategory))
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())
    });
  }

  getAllCategoryWithSubCategory(): Promise<Category> {
    return new Promise((resolve, reject) => {

      this.prisma.category
        .findMany({include:{
          subCategory:true
        }})
        .then(Category => resolve(Category))
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())

    })
  }

  createProduct(_schema: IProductResolver): Promise<Product> {
    return new Promise((resolve, reject) => {
      this.prisma.product
        .create({ data: _schema , include: { tags: true, categories: { include: { category: true } }, images: true, review: { include: { rating: true }}}})
        .then(Category => resolve(Category))
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())

    })
  }

  getOneCategory(where): Promise<Category> {
    return new Promise((resolve, reject) => {

      this.prisma.category
        .findFirst({ where })
        .then(Category => resolve(Category))
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())

    })
  }

  getOneSubCategory(where): Promise<SubCategory> {
    return new Promise((resolve, reject) => {

      this.prisma.subCategory
        .findFirst({ where })
        .then(SubCategory => resolve(SubCategory))
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())

    })
  }

  getManySubCategory(where): Promise<SubCategory[]> {
    return new Promise((resolve, reject) => {

      this.prisma.subCategory
        .findMany({
          where
        })
        .then(SubCategory => resolve(SubCategory))
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())

    })
  }

  getAllProducts(skip?,take?,where?): Promise<Product>{
    
    return new Promise((resolve,reject) => {
      this.prisma.product
        .findMany(
          {
            skip,
            take,
            where,
            include:
            {
              tags: true,
              categories:
              {
                include:
                  { category: true }
              },
              images: true,
              review:
              {
                include:
                  { rating: true }
              },
              user:{
                include:{
                  profile:true
                }
              }
            }
          })
        .then(product => {
          resolve(product)
        })
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())
    })
  }

  getOneProduct(where): Promise<Product>{
    return new Promise((resolve,reject) => {
      this.prisma.product
        .findFirst({
          where,
          include: {
            tags: true,
            categories:
            {
              include:
                { category: true }
            },
            images: true,
            review:{
            include:
              { rating: true }
            },
            user:{
              include:{
                profile:true
              }
            }
          }
        })
        .then(product => {
          resolve(product)
        })
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())
    })
  }

  getFilterProducts(where, limit = null, page = null): Promise<IReturnResolver>{
    return new Promise((resolve,reject) => {
        this.prisma.product
                .findMany({ where, skip: limit * (page - 1) ? limit * (page - 1) : 0, take: limit ? limit : 50,include:{tags:true,categories:{include : {category : true}}} })
                .then(async Products => {
                    const productCount = await this.prisma.product.count({ where })
                    resolve({ Products, count: productCount })
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
    })
  }

  updateProduct(where,data,disconnectionData): Promise<Product>{
    return new Promise((resolve,reject) => {
      this.prisma.product
                .update({where,data})
                .then(async products => {
                  this.disconnectionProduct(where,disconnectionData)
                  resolve(products)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
    })
  }

  disconnectionProduct(where,data): Promise<Product>{
    return new Promise((resolve,reject) => {
      this.prisma.product.update({ where, data})
                .then(products => {
                  resolve(products)
                })
                .catch(error => reject(error))
                .finally(() => this.prisma.$disconnect())
    })
  }

  deleteProduct(where): Promise<Product>{
    return new Promise((resolve,reject) => {
      this.prisma.product
        .delete({ where })
        .then(product => {
          resolve(product)
        })
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())
    })
  }

  // REDIS PRODUCT SERVICES

  setSingleProductData(data) {
    this.setData(data, `${data.id}|${data.title}|product`, 0)
    .catch((error) => { throw error })
  }

  setProductDataRedis(data) {
    data.map(data => {
      this.setData(data,`${data.id}|${data.title}|product`,0)
    })
  }

  updateProductDataRedis(product) {
    this.setData(product, `${product.id}|${product.title}|product`, 0)
    .catch((error) => { throw error })
  }

  deleteProductDataRedis(Key) {
    this.searchAndDeleteKeys(Key)
      .catch((error) => { throw error })
  }



  // ADMIN PRODUCT SERVICES

  blockUnblockProduct(data): Promise<Product>{
    return new Promise((resolve, reject) => {
      this.prisma.product
        .update(data)
        .then(product => {resolve(product)})
        .catch(error => reject(error))
        .finally(() => this.prisma.$disconnect())
    })
  }
  
}