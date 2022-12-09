import { BadRequestException, Body, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { documentFileFilter, imageFileFilter } from 'src/util/file_upload.util';
import { transform } from 'typescript';
import { AliOssHelperService } from './ali-oss.service';
import { Role } from '../role/role.enum';
import { RolesGuard } from '../role/roles.guard';

@Controller('alioss')
export class AliOssController {
    constructor(private readonly ossService: AliOssHelperService) { }

    @Get('geturl/:name')
    async geturls(@Param('name') nama : string){
        return this.ossService.geturl(nama);
    }

}