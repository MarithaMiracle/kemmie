
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { LoginResponseDto } from '../constants/responses/auth/login.response';
import { PrismaService } from '../repositories/prisma.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException();
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException();
    const membership = await this.prisma.relationshipMember.findFirst({ where: { userId: user.id } });
    const token = await this.jwt.signAsync({ sub: user.id, relationshipId: membership?.relationshipId || null });
    return { accessToken: token };
  }

  async register(email: string, password: string, name: string, birthday?: string, inviteCode?: string): Promise<LoginResponseDto> {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new BadRequestException('email_taken');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({ data: { email, passwordHash, name, birthday: birthday ? new Date(birthday) : null } });
    let relationshipId: string | null = null;
    if (inviteCode) {
      const rel = await this.prisma.relationship.findUnique({ where: { joinCode: inviteCode } });
      if (!rel) throw new BadRequestException('invalid_invite');
      const count = await this.prisma.relationshipMember.count({ where: { relationshipId: rel.id } });
      if (count >= 2) throw new BadRequestException('relationship_full');
      await this.prisma.relationshipMember.create({ data: { relationshipId: rel.id, userId: user.id } });
      relationshipId = rel.id;
    } else {
      const joinCode = randomBytes(5).toString('hex');
      const rel = await this.prisma.relationship.create({ data: { joinCode } });
      await this.prisma.relationshipMember.create({ data: { relationshipId: rel.id, userId: user.id } });
      relationshipId = rel.id;
    }
    const token = await this.jwt.signAsync({ sub: user.id, relationshipId });
    return { accessToken: token };
  }

  async oauthGoogle(email?: string, name?: string): Promise<LoginResponseDto> {
    if (!email) throw new BadRequestException('missing_email');
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      const passwordHash = await bcrypt.hash(randomBytes(16).toString('hex'), 10);
      user = await this.prisma.user.create({ data: { email, passwordHash, name: name || email } });
      const joinCode = randomBytes(5).toString('hex');
      const rel = await this.prisma.relationship.create({ data: { joinCode } });
      await this.prisma.relationshipMember.create({ data: { relationshipId: rel.id, userId: user.id } });
    }
    let membership = await this.prisma.relationshipMember.findFirst({ where: { userId: user.id } });
    if (!membership) {
      const joinCode = randomBytes(5).toString('hex');
      const rel = await this.prisma.relationship.create({ data: { joinCode } });
      await this.prisma.relationshipMember.create({ data: { relationshipId: rel.id, userId: user.id } });
      membership = await this.prisma.relationshipMember.findFirst({ where: { userId: user.id } });
    }
    const token = await this.jwt.signAsync({ sub: user.id, relationshipId: membership?.relationshipId || null });
    return { accessToken: token };
  }

  async googleMobile(idToken: string): Promise<LoginResponseDto> {
    const audiences = [
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_ANDROID_CLIENT_ID,
      process.env.GOOGLE_IOS_CLIENT_ID
    ].filter(Boolean) as string[];
    if (!audiences.length) throw new BadRequestException('missing_google_client_ids');
    try {
      const client = new OAuth2Client();
      const ticket = await client.verifyIdToken({ idToken, audience: audiences });
      const payload = ticket.getPayload();
      const email = payload?.email;
      const name = payload?.name as string | undefined;
      return this.oauthGoogle(email, name);
    } catch {
      throw new UnauthorizedException('invalid_token');
    }
  }
}