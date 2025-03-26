import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('journals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class JournalController {
  @Get('journals')
  getAllJournals() {
    return { message: 'All journals' };
  }
}
