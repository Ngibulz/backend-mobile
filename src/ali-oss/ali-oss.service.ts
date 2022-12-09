import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { NormalSuccessResponse } from 'ali-oss';
import { AliOssService } from 'nestjs-ali-oss';

@Injectable()
export class AliOssHelperService {
    constructor(
        private readonly aliOssService: AliOssService) { }
        async saveFile(path: string, file: Buffer): Promise<string> {
            //path = path.replace(/\s+/g, '-').toLowerCase();
            try {
                await this.aliOssService.put(path, file, {
                    
                });
                await this.aliOssService.putACL(path, 'public-read-write');
                return Promise.resolve(path)
            } catch (errO) {
                return Promise.reject(errO);
            }
        }

        async geturl(name : string){
            try {
                if(!name || name === 'belum ada'){
                    return name
                }
                return await this.aliOssService.generateObjectUrl(name);
    
            } catch (error) {
                console.log(error);
                if(!name){
                    return "tidak ada"
                }
                return name;
            }
        }


}
