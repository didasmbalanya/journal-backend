import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JournalService } from './journal.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateJournalDto, UpdateJournalDto } from './dto/journal.dto';
import { AuthenticatedRequest } from '../types';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('journals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createDto: CreateJournalDto,
  ) {
    return this.journalService.create(req.user, createDto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.journalService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.journalService.findOne(req.user.id, +id);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateDto: UpdateJournalDto,
  ) {
    return this.journalService.update(req.user.id, +id, updateDto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.journalService.remove(req.user.id, +id);
  }
}
