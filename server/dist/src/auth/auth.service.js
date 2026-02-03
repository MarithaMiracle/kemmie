"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_repository_1 = require("../repositories/prisma.repository");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(email, password, name, birthday, inviteCode) {
        const exists = await this.prisma.user.findUnique({ where: { email } });
        if (exists)
            throw new common_1.BadRequestException('email_taken');
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({ data: { email, passwordHash, name, birthday: birthday ? new Date(birthday) : null } });
        let relationshipId = null;
        if (inviteCode) {
            const rel = await this.prisma.relationship.findUnique({ where: { joinCode: inviteCode } });
            if (!rel)
                throw new common_1.BadRequestException('invalid_invite');
            const count = await this.prisma.relationshipMember.count({ where: { relationshipId: rel.id } });
            if (count >= 2)
                throw new common_1.BadRequestException('relationship_full');
            await this.prisma.relationshipMember.create({ data: { relationshipId: rel.id, userId: user.id } });
            relationshipId = rel.id;
        }
        else {
            const joinCode = (0, crypto_1.randomBytes)(5).toString('hex');
            const rel = await this.prisma.relationship.create({ data: { joinCode } });
            await this.prisma.relationshipMember.create({ data: { relationshipId: rel.id, userId: user.id } });
            relationshipId = rel.id;
        }
        const token = await this.jwt.signAsync({ sub: user.id, relationshipId });
        return { token, userId: user.id, relationshipId };
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException();
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException();
        const membership = await this.prisma.relationshipMember.findFirst({ where: { userId: user.id } });
        const token = await this.jwt.signAsync({ sub: user.id, relationshipId: (membership === null || membership === void 0 ? void 0 : membership.relationshipId) || null });
        return { token, userId: user.id, relationshipId: (membership === null || membership === void 0 ? void 0 : membership.relationshipId) || null };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_repository_1.PrismaService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map