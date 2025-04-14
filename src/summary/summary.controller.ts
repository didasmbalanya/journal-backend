import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../types';

@Controller('summary')
@UseGuards(JwtAuthGuard)
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get('entry-frequency')
  async getEntryFrequency(
    @Req() req: AuthenticatedRequest,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.summaryService.getEntryFrequency(
      req.user.id,
      new Date(start),
      new Date(end),
    );
  }

  @Get('category-distribution')
  async getCategoryDistribution(
    @Req() req: AuthenticatedRequest,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.summaryService.getCategoryDistribution(
      req.user.id,
      new Date(start),
      new Date(end),
    );
  }

  @Get('word-count-trends')
  async getWordCountTrends(
    @Req() req: AuthenticatedRequest,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.summaryService.getWordCountTrends(
      req.user.id,
      new Date(start),
      new Date(end),
    );
  }

  @Get('average-entry-length')
  async getAverageEntryLengthByCategory(
    @Req() req: AuthenticatedRequest,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.summaryService.getAverageEntryLengthByCategory(
      req.user.id,
      new Date(start),
      new Date(end),
    );
  }

  @Get('time-of-day-analysis')
  async getTimeOfDayAnalysis(
    @Req() req: AuthenticatedRequest,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.summaryService.getTimeOfDayAnalysis(
      req.user.id,
      new Date(start),
      new Date(end),
    );
  }
}
