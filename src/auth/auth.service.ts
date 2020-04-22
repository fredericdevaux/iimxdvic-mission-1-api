import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/userDto';
import { LoginUserDto } from '../users/loginUserDto';
import { CreateUserDto } from '../users/createUserDto';
import { ConfigService } from '../config/config.service';

interface JwtPayload { email: string;}
interface RegistrationStatus { success: boolean; message: string;}


@Injectable()

export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly configService: ConfigService, private readonly jwtService: JwtService) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = { success: true, message: 'user registered' };
    try {
      await this.usersService.create(userDto);
    } catch (err) {
      status = { success: false, message: err };
    }
    return status;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByLogin(loginUserDto);
    const token = this._createToken(user);
    return { username: user.email, ...token };
  }

  private _createToken({ email }: UserDto): any {
    const user: JwtPayload = { email };
    const accessToken = this.jwtService.sign(user);
    return { expiresIn: this.configService.get('JWT_EXPIRATION_TIME'), accessToken };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await
      this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token',
        HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
