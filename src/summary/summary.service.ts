import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntry } from '../journal/journal.entity';

@Injectable()
export class SummaryService {
  constructor(
    @InjectRepository(JournalEntry)
    private readonly journalRepository: Repository<JournalEntry>,
  ) {}

  // Entry frequency for calendar heatmap
  async getEntryFrequency(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<{ date: string; count: number }[]> {
    const entries = await this.journalRepository
      .createQueryBuilder('entry')
      .select('DATE(entry.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('entry.userId = :userId', { userId })
      .andWhere('entry.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('DATE(entry.createdAt)')
      .getRawMany<{ date: string; count: number }>();

    return entries;
  }

  // Category distribution for pie chart/bar chart
  async getCategoryDistribution(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<{ category: string; count: number }[]> {
    const results = await this.journalRepository
      .createQueryBuilder('entry')
      .select('entry.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .where('entry.userId = :userId', { userId })
      .andWhere('entry.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('entry.category')
      .getRawMany<{ category: string; count: number }>();

    return results;
  }

  // Word count trends over time
  async getWordCountTrends(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<{ date: string; averageWordCount: number }[]> {
    const results = await this.journalRepository
      .createQueryBuilder('entry')
      .select('DATE(entry.createdAt)', 'date')
      .addSelect(
        "AVG(LENGTH(entry.content) - LENGTH(REPLACE(entry.content, ' ', '')) + 1)",
        'averageWordCount',
      )
      .where('entry.userId = :userId', { userId })
      .andWhere('entry.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('DATE(entry.createdAt)')
      .getRawMany<{ date: string; averageWordCount: number }>();

    return results;
  }

  // Average entry length by category
  async getAverageEntryLengthByCategory(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<{ category: string; averageLength: number }[]> {
    const results = await this.journalRepository
      .createQueryBuilder('entry')
      .select('entry.category', 'category')
      .addSelect('AVG(LENGTH(entry.content))', 'averageLength')
      .where('entry.userId = :userId', { userId })
      .andWhere('entry.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('entry.category')
      .getRawMany<{ category: string; averageLength: number }>();

    return results;
  }

  // Time-of-day writing pattern analysis
  async getTimeOfDayAnalysis(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<{ hour: number; count: number }[]> {
    const results = await this.journalRepository
      .createQueryBuilder('entry')
      .select('EXTRACT(HOUR FROM entry.createdAt)', 'hour')
      .addSelect('COUNT(*)', 'count')
      .where('entry.userId = :userId', { userId })
      .andWhere('entry.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('hour')
      .orderBy('hour')
      .getRawMany<{ hour: number; count: number }>();

    return results;
  }
}
