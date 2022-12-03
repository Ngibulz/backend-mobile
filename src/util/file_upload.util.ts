import { uuid4 } from '@sentry/utils';
import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { extname } from "path";

export const imageFileFilter = (req,file,callback)=>{
    if(file.mimetype.match(/\/(jpg|jpeg|png)$/)){
        callback(null,true);
    }else{
        callback(new BadRequestException('only jpg,jpeg,png allowed'), false);
    }
}

export const editFileName = (req,file,callback)=>{
    callback(null,`${uuid4()}${extname(file.originalname)}`)
}

export const documentFileFilter = (req,file,callback)=>{
    if(file.mimetype.match(/\/(pdf)$/)){
        callback(null,true)
    }else{
        callback(new BadRequestException('only pdf allowed'), false);

    }
}

export const imagepdffilter = (req,file,callback)=>{
    if(file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)){
        callback(null,true);
    }else{
        callback(new BadRequestException('only jpg,jpeg,png or pdf allowed'), false);
    }
}

export const docfilter2 = (req,file,callback)=>{
    if(file.fieldname === 'uploadbast'){
        if(!file.mimetype.match(/\/(pdf)$/)){
            callback(new BadRequestException('only pdf allowed in upload bast'), false);
        }
    }
    if(file.fieldname === 'uploadinvoice'){
        if(!file.mimetype.match(/\/(jpg|jpeg|png)$/)){
            callback(new BadRequestException('only pdf allowed in upload invoice'), false);
        }
    }
    callback(null,true);
}

export const vendorfilter = (req,file,callback)=>{
    if(file.fieldname === 'uploadlogo'){
        if(!file.mimetype.match(/\/(jpg|jpeg|png)$/)){
            callback(new BadRequestException('only jpg,jpeg,or png allowed in upload logo'), false);
        }
    }
    if(file.fieldname === 'uploadnpwp'){
        if(!file.mimetype.match(/\/(pdf|jpg|jpeg|png)$/)){
            callback(new BadRequestException(`only pdf or image allowed in ${file.fieldname}`), false);
        }
    }
    if(file.fieldname === 'uploadktp'){
        if(!file.mimetype.match(/\/(pdf|jpg|jpeg|png)$/)){
            callback(new BadRequestException(`only pdf or image allowed in ${file.fieldname}`), false);
        }
    }
    if(file.fieldname === 'uploadakta'){
        if(!file.mimetype.match(/\/(pdf|jpg|jpeg|png)$/)){
            callback(new BadRequestException(`only pdf or image allowed in ${file.fieldname}`), false);
        }
    }
    callback(null,true);
}

export const uploadPayment = (req,file,callback)=>{
    if(file.fieldname === 'uploadbast'){
        if(!file.mimetype.match(/\/(pdf)$/)){
            callback(new BadRequestException('only jpg,jpeg,or png allowed in upload logo'), false);
        }
    }
    if(file.fieldname === 'uploadinvoice'){
        if(!file.mimetype.match(/\/(pdf|jpg|jpeg|png)$/)){
            callback(new BadRequestException(`only pdf or image allowed in ${file.fieldname}`), false);
        }
    }
    callback(null,true);
}