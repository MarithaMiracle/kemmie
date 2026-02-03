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
exports.BirthdayService = void 0;
const common_1 = require("@nestjs/common");
const prisma_repository_1 = require("../repositories/prisma.repository");
let BirthdayService = class BirthdayService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async countdown(userId, relationshipId) {
        var _a;
        const members = await this.prisma.relationshipMember.findMany({ where: { relationshipId }, include: { user: true } });
        const partner = ((_a = members.find(m => m.userId !== userId)) === null || _a === void 0 ? void 0 : _a.user) || null;
        if (!partner || !partner.birthday)
            return { daysUntil: null, message: 'Still counting.', targetDate: null };
        const now = new Date();
        const b = new Date(partner.birthday);
        const next = new Date(now.getFullYear(), b.getMonth(), b.getDate());
        if (next < now)
            next.setFullYear(now.getFullYear() + 1);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const ms = next.getTime() - today.getTime();
        const daysUntil = Math.ceil(ms / (1000 * 60 * 60 * 24));
        const messages = ['Still counting.', 'I already know what I’m grateful for.', 'Worth the wait.'];
        const message = messages[daysUntil % messages.length];
        return { daysUntil, message, targetDate: next };
    }
};
exports.BirthdayService = BirthdayService;
exports.BirthdayService = BirthdayService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_repository_1.PrismaService])
], BirthdayService);
//# sourceMappingURL=birthday.service.js.map