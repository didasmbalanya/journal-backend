import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('journals')
@UseGuards(JwtAuthGuard)
export class JournalController {
  @Get()
  getAllJournals() {
    return { message: 'All journals' };
  }
}
