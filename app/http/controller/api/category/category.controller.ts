import * as _ from "lodash";
import * as fs from "fs"; 
import short from 'short-uuid';

import { ErrorService } from "../../../services/error.service";
import { ProductService } from "../../../services/product.service";

export class Category {

  async createCategory(req, res) {
    
    try {
      
      const productService = new ProductService();

      let name = req.body.name;

      let createCategory = await productService.createCategory(name.toLowerCase());

      if (createCategory) {
        res.status(200).send({ success: true, data: createCategory, msg: "Category Has Been Created", status: 200 });
      } else {
        res.status(500).send({ success: false, msg: "Some Error", status: 500 }); 
      }

    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }
  }
  
  async createSubCategory(req,res) {
    
    try {
      

      const productService = new ProductService();

      let _schema = { name : req.body.name , categoryId: req.body.categoryId};

      let createSubCategory = await productService.createSubCategory(_schema.name.toLowerCase(),_schema.categoryId);

      if (createSubCategory) {
        res.status(200).send({ success: true, data: createSubCategory, msg: "SubCategory Has Been Created", status: 200 });
      } else {
        res.status(500).send({ success: false, msg: "Some Error", status: 500 }); 
      }


    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }

  async getAllCategoryWithSubCategory(req,res){

    try {
    
      const productService = new ProductService();

      let createSubCategory = await productService.getAllCategoryWithSubCategory();

        res.status(200).send({ success: true, data: createSubCategory, msg: "Successfully Fetched", status: 200 }); 

    } catch (error) {
      ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });
    }

  }

}
