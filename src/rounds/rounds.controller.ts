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
import { RoundsService } from './rounds.service';

@Controller('rounds')
export class RoundsController {
  constructor(private readonly roundsService: RoundsService) {}

  @Post()
  create(@Req() request: Request) {
    return this.roundsService.create(request);
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.roundsService.findAll(request);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.roundsService.findOne(uuid);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.roundsService.remove(uuid);
  }
}
