import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: AuthDto): Promise<{ access_token: string }> {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const user = await this.userService.create(dto.email, dto.password);
    return this.generateToken(user);
  }

  async login(dto: AuthDto): Promise<{ access_token: string }> {
    const user = await this.userService.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(user);
  }

  private generateToken(user: { email: string; id: number }): {
    access_token: string;
  } {
    const payload: { email: string; sub: number } = {
      email: user.email,
      sub: user.id,
    };

    const token: string = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }
}
