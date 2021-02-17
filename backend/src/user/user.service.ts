import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { UpdateUserDto } from './models/update-user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  all(): Promise<User[]> {
    return this.userRepository.find();
  }

  async paginate(page = 1): Promise<any> {
    const take = 1;
    const [users, total] = await this.userRepository.findAndCount({
      take,
      skip: (page - 1) * take,
    });

    return {
      data: users.map((user) => {
        const { password, ...data } = user;
        return data;
      }),
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async create(data): Promise<User> {
    return this.userRepository.save(data);
  }

  async findOne(data) {
    return await this.userRepository.findOne(data);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (!(await this.userRepository.findOne({ id: id })))
      throw new NotFoundException('user not fount');
    return await this.userRepository.update(id, updateUserDto);
  }

  async delete(id: number) {
    if (!(await this.userRepository.findOne({ id: id })))
      throw new NotFoundException('user not fount');
    return await this.userRepository.delete(id);
  }
}
