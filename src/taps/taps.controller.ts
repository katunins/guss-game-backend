import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { TapsService } from './taps.service';

@Controller('taps')
export class TapsController {
  constructor(private readonly tapsService: TapsService) {}

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string, @Req() request: Request) {
    return this.tapsService.findOne(uuid, request);
  }
}
