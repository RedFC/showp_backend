import * as _ from "lodash";
import * as fs from "fs";
import short from 'short-uuid';

import { ErrorService } from "../../../services/error.service";
import { ProductService } from "../../../services/product.service";

import { ProductImages } from '../productImages/productImages.controller'

export class Product {

  async create(req, res) {
    try {
      const ImageUploads = new ProductImages();
      const productService = new ProductService();

      const ParseTags = JSON.parse(req.body.tags)
      let Tags = ParseTags.map(x => {
        return { where: { name: x }, create: { name: x } }
      });
      let Category = JSON.parse(req.body.categories);
      let _Parse = {
        baseCost: Number(req.body.baseCost),
        refundable: JSON.parse(req.body.refundable)
      };

      let _schema = {
        published: req.body.published,
        title: req.body.title,
        description: req.body.description,
        baseCost: _Parse.baseCost,
        currency: req.body.currency,
        refundable: _Parse.refundable,
        authorId: req.body.authorId,
        tags: {
          connectOrCreate: Tags
        },
        user: {
          connect: { id: req.user.id }
        },
        categories: {
          connect: Category
        },
        quantity: Number(req.body.quantity),
        images: null
      }

      if (req.files) {
        ImageUploads.uploader(
          (error) => {
            ErrorService.handler(res, error.status, error);
  
          }, req,
          async (uploader) => {
  
            if (uploader.length) {
              let images = uploader.map(x => {
                return { cloudinaryId: x.cloudinaryId }
              });
              _schema.images = {
                connect: images
              }
            }
            console.log(_schema.images);

            let createProduct = await productService.createProduct(_schema);
            if (createProduct) {
              productService.setSingleProductData(createProduct);
              res.status(200).send({
                success: true,
                data: createProduct,
                msg: "Product Has Been Created Successfully",
                status: 200
              });
            }

          });
      }
      else {
        ErrorService.handler(res, 500, { success: false, msg: "Files Not Found", status: 500 });
      }

      

    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }

  async getAllproducts(req, res) {
    try {
      const productService = new ProductService();
      let getAllProducts = await productService.getAllProducts(
        req.query.skip ? Number(req.query.skip) : 0,
        req.query.take ? Number(req.query.take) : 100000,
        {
          OR: [{ isBlocked: false },
          { userId: req.user.id }
          ]
        });
      productService.setProductDataRedis(getAllProducts);
      res.status(200).send({ success: true, data: getAllProducts, msg: "Succesfully Fetched", status: 200 });

    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }
  }


  async getOneproducts(req, res) {
    try {
      const productService = new ProductService();
      let getOneProducts = await productService.getOneProduct(
        {
          isBlocked: false,
          id : req.params.id
        });
        if(getOneProducts){
          res.status(200).send({ success: true, data: getOneProducts, msg: "Succesfully Fetched", status: 200 });
        }else{
          res.status(200).send({ success: true,msg: "Product Not Found", status: 200 });
        }

    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }
  }

  async getMyproducts(req, res) {
    try {
      const productService = new ProductService();
      let getMyProducts = await productService.getAllProducts(0,10000,{
        userId :  req.user.id
      });
        if(getMyProducts){
          res.status(200).send({ success: true, data: getMyProducts, msg: "Succesfully Fetched", status: 200 });
        }else{
          res.status(200).send({ success: true,msg: "Product Not Found", status: 200 });
        }

    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }
  }

  async SearchProducts(req, res) {
    try {

      let limit = _.toInteger(req.query.limit);
      let page = _.toInteger(req.query.page);
      let { key, id } = req.query;
      let productService = new ProductService();
      if (id != null && id != "" && id != undefined) {
        let Product = await productService.getOneProduct({ id });
        res.send({
          success: true, data: Product
        })
      }
      else {
        let LikeQuery = { title: { contains: key } };
        let { Products, count } = await productService.getFilterProducts(LikeQuery, limit, page)
        productService.setProductDataRedis(Products)
        res.send({
          success: true,
          status: 200,
          data: Products,
          page: page,
          pages: Math.ceil(count / limit),
          count
        });
      }
    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }

  async update(req, res) {

    try {
      const ImageUploads = new ProductImages();
      const productService = new ProductService();

      let Tags
      if (req.body.tags) {
        Tags = JSON.parse(req.body.tags).map(x => {
          return { where: { name: x }, create: { name: x } }
        })
      }

      let category;
      if (req.body.categories) {
        category = JSON.parse(req.body.categories)
      }

      let disconnectedTags
      if (req.body.disconnectedTags) {
        disconnectedTags = JSON.parse(req.body.disconnectedTags).map(x => {
          return { name: x }
        })
      }

      let paramsId = req.params.id;

      let _schema = {
        title: req.body.title,
        description: req.body.description,
        baseCost: req.body.baseCost ? Number(req.body.baseCost) : undefined,
        currency: req.body.currency,
        refundable:req.body.refundable ? JSON.parse(req.body.refundable) : undefined,
        authorId: req.body.authorId,
        tags: {
          connectOrCreate: Tags,
        },
        user: {
          connect: { id: req.user.id }
        },
        categories: {
          connect: category,
        },
        quantity: req.body.quantity ? (res.productqty + Number(req.body.quantity)) : undefined
      }


      let _disconnection = {
        tags: {
          disconnect: req.body.disconnectedTags ? disconnectedTags : undefined
        },
        categories: {
          disconnect: req.body.disconnectedCategories ? JSON.parse(req.body.disconnectedCategories) : undefined
        },
        images: {
          disconnect:req.body.disconnectedImages ? JSON.parse(req.body.disconnectedImages) : undefined
        }
      }

      if (req.files.length) {
        console.log("files");
        ImageUploads.uploader(
          (error) => {
            ErrorService.handler(res, error.status, error);
  
          }, req,
          async (uploader) => {
  
            if (uploader.length) {
              let images = uploader.map(x => {
                return { cloudinaryId: x.cloudinaryId }
              });
              _schema['images'] = {
                connect: images
              }
            }
  
            let updateProduct = await productService.updateProduct({ id: paramsId }, _schema, _disconnection);

            if (updateProduct) {

              let getproduct = await productService.getOneProduct({ id: paramsId });

              if (getproduct) {
                productService.updateProductDataRedis(getproduct);
              }

              return res.send({
                success: true,
                status: 200,
                data: updateProduct,
                msg: "Successfully Updated",
              })

            }

          });        

      } else {
        let updateProduct = await productService.updateProduct({ id: paramsId }, _schema, _disconnection);

        if (updateProduct) {

          let getproduct = await productService.getOneProduct({ id: paramsId });

          if (getproduct) {
            productService.updateProductDataRedis(getproduct);
          }

          return res.send({
            success: true,
            status: 200,
            data: updateProduct,
            msg: "Successfully Updated",
          })

        }
        
      }

    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }

  async deleteProduct(req, res) {

    try {
      const productService = new ProductService();

      let deleteProduct = await productService.deleteProduct({ id: req.params.id });
      if (deleteProduct) {
        productService.deleteProductDataRedis(req.params.id);
        return res.send({
          success: true,
          status: 200,
          data: deleteProduct,
          msg: "Successfully Deleted"
        })
      }

    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }


}
