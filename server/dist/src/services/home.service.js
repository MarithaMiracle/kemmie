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
exports.HomeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_repository_1 = require("../repositories/prisma.repository");
const vibe_check_service_1 = require("./vibe-check.service");
let HomeService = class HomeService {
    constructor(prisma, vibeCheck) {
        this.prisma = prisma;
        this.vibeCheck = vibeCheck;
    }
    toDayKey(d) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
    }
    async summary(relationshipId, userId) {
        var _a, _b, _c, _d;
        const members = await this.prisma.relationshipMember.findMany({
            where: { relationshipId },
            include: { user: { select: { id: true, name: true } } }
        });
        const me = ((_b = (_a = members.find(m => m.userId === userId)) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.name) || 'You';
        const partner = ((_d = (_c = members.find(m => m.userId !== userId)) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.name) || 'Bestie';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const relationship = await this.prisma.relationship.findUnique({ where: { id: relationshipId } });
        const recent = await this.prisma.checkIn.findMany({
            where: { relationshipId, date: { lte: today } },
            orderBy: { date: 'desc' },
            take: 120
        });
        const daySet = new Set(recent.map(ci => this.toDayKey(ci.date)));
        let streak = 0;
        for (let i = 0; i < 120; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            if (daySet.has(this.toDayKey(d)))
                streak++;
            else
                break;
        }
        const lastActiveSeconds = recent.length ? Math.max(0, Math.floor((Date.now() - new Date(recent[0].date).getTime()) / 1000)) : 0;
        const relationshipAgeDays = relationship ? Math.max(0, Math.floor((today.getTime() - new Date(relationship.createdAt).getTime()) / (1000 * 60 * 60 * 24))) : 0;
        const messagesCount = await this.prisma.message.count({ where: { relationshipId } });
        const memoriesCount = await this.prisma.memory.count({ where: { relationshipId } });
        const todayVibeCheck = await this.vibeCheck.todaySummary(relationshipId);
        const bday = new Date(today.getFullYear(), 11, 21);
        if (bday < today)
            bday.setFullYear(today.getFullYear() + 1);
        const diffTime = bday.getTime() - today.getTime();
        const daysToGo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const nextBirthday = { name: 'Kemmie', daysToGo };
        return {
            currentUserName: me,
            bestieName: partner,
            streak,
            messagesCount,
            memoriesCount,
            todayVibeCheck,
            relationshipAgeDays,
            lastActiveSeconds,
            nextBirthday
        };
    }
};
exports.HomeService = HomeService;
exports.HomeService = HomeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_repository_1.PrismaService, vibe_check_service_1.VibeCheckService])
], HomeService);
//# sourceMappingURL=home.service.js.map