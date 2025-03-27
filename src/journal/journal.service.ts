import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { JournalEntry } from './journal.entity';
import { CreateJournalDto, UpdateJournalDto } from './dto/journal.dto';

@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(JournalEntry)
    private journalRepository: Repository<JournalEntry>,
  ) {}

  async create(user: User, createDto: CreateJournalDto) {
    const entry = this.journalRepository.create({
      ...createDto,
      user,
    });
    return this.journalRepository.save(entry);
  }

  async findAll(userId: number) {
    return this.journalRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: number, id: number) {
    const entry = await this.journalRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!entry) throw new NotFoundException('Journal entry not found');
    return entry;
  }

  async update(userId: number, id: number, updateDto: UpdateJournalDto) {
    const entry = await this.findOne(userId, id);
    return this.journalRepository.save({ ...entry, ...updateDto });
  }

  async remove(userId: number, id: number) {
    const entry = await this.findOne(userId, id);
    return this.journalRepository.remove(entry);
  }
}
