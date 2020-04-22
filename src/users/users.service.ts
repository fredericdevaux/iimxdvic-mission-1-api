import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './userDto';
import { toUserDto } from './toUserDto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from './loginUserDto';
import { CreateUserDto } from './createUserDto';
import { compare } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async findOne(options?: object): Promise<UserDto> {
    const user = await this.userRepository.findOne(options);
    return toUserDto(user);
  }

  async findByLogin({ email, password }: LoginUserDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('User not found',
        HttpStatus.UNAUTHORIZED);
    }
    // compare passwords
    const areEqual = await compare(password, user.password);
    if (!areEqual) {
      throw new HttpException('Invalid credentials',
        HttpStatus.UNAUTHORIZED);
    }
    return toUserDto(user);
  }

  async findByPayload({ email }: any): Promise<UserDto> {
    return await this.findOne({
      where:
        { email },
    });
  }

  async findById(id: number): Promise<UserDto>{
    const user = await this.userRepository.findOne(id);

    if (!user) {
      const errors = {User: ' not found'};
      throw new HttpException({errors}, 401);
    };

    return toUserDto(user);
  }

  async create(userDto: CreateUserDto): Promise<UserDto> {
    const { email, birthDate, country, firstName , lastName, siret,  password } = userDto;
    const userInDb = await this.userRepository.findOne({
      where: { email },
    });
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const user: User = await this.userRepository.create({ email, password , birthDate, country, firstName, lastName, siret});
    await this.userRepository.save(user);
    return toUserDto(user);
  }
}
