import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummaryService } from './summary.service';
import { SummaryController } from './summary.controller';
import { JournalEntry } from '../journal/journal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JournalEntry])],
  providers: [SummaryService],
  controllers: [SummaryController],
})
export class SummaryModule {}
