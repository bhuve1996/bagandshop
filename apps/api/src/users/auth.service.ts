import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UserEntity } from './entities/user.entity';
import { SessionEntity } from './entities/session.entity';

const SALT_ROUNDS = 10;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface RegisterDto {
  email: string;
  password: string;
  name?: string | null;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
  expires_at: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,
  ) {}

  async register(dto: RegisterDto): Promise<LoginResponse> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email.toLowerCase().trim() } });
    if (existing) throw new ConflictException('Email already registered');
    const password_hash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = this.userRepo.create({
      email: dto.email.toLowerCase().trim(),
      password_hash,
      name: dto.name?.trim() || null,
    });
    const saved = await this.userRepo.save(user);
    return this.createSessionResponse(saved);
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepo.findOne({ where: { email: dto.email.toLowerCase().trim() } });
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const ok = await bcrypt.compare(dto.password, user.password_hash);
    if (!ok) throw new UnauthorizedException('Invalid email or password');
    return this.createSessionResponse(user);
  }

  async logout(token: string): Promise<void> {
    await this.sessionRepo.delete({ token });
  }

  async validateSession(token: string): Promise<UserEntity | null> {
    if (!token?.trim()) return null;
    const session = await this.sessionRepo.findOne({
      where: { token },
      relations: ['user'],
    });
    if (!session?.user) return null;
    if (new Date() >= session.expires_at) {
      await this.sessionRepo.delete({ id: session.id });
      return null;
    }
    return session.user;
  }

  private async createSessionResponse(user: UserEntity): Promise<LoginResponse> {
    const token = randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + SESSION_TTL_MS);
    await this.sessionRepo.save(
      this.sessionRepo.create({
        user_id: user.id,
        token,
        expires_at,
      }),
    );
    return {
      user: this.toUserResponse(user),
      token,
      expires_at: expires_at.toISOString(),
    };
  }

  toUserResponse(user: UserEntity): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at.toISOString(),
    };
  }
}
