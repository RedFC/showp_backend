import * as _ from "lodash";
import * as fs from "fs"; 
import short from 'short-uuid';

import { ErrorService } from "../../../../services/error.service";
import { ProductService } from "../../../../services/product.service";

export class Product {

    async BlockUnblockProduct(req,res){

        try {
            const productService = new ProductService();
            let getProduct = await productService.getOneProduct({ id: req.params.id });
            let data = {data : null,msg : null};
            if (getProduct.isBlocked) {
                data.data = { isBlocked: false }
                data.msg = "Product has been Unblocked"
            } else {
                data.data = { isBlocked: true }
                data.msg = "Product has been Blocked"
            }
            let blockProduct = await productService.blockUnblockProduct({where:{id: req.params.id},data:data.data });
            res.status(200).send({ success: true, data: blockProduct, msg: data.msg, status: 200 });

        } catch (error) {
            ErrorService.handler(res, 500, { success: false, msg: error.message, status: 500 });            
        }

    }



}
