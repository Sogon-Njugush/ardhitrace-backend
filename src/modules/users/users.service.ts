import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: createUserDto.email },
        { phoneNumber: createUserDto.phoneNumber },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Email or Phone Number already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    const user = this.usersRepository.create({
      ...createUserDto,
      passwordHash, // Store the hash, not the plain text
    });

    const savedUser = await this.usersRepository.save(user);

    // Remove sensitive data before returning
    delete savedUser.passwordHash;
    return savedUser;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'passwordHash', 'role', 'fullName', 'isVerified'], // Explicitly select password for login check
    });
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
