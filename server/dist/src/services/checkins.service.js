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
exports.CheckInsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_repository_1 = require("../repositories/prisma.repository");
let CheckInsService = class CheckInsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async record(relationshipId, userId, mood) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        const checkIn = await this.prisma.checkIn.upsert({
            where: { relationshipId_userId_date: { relationshipId, userId, date } },
            update: { mood: mood },
            create: { relationshipId, userId, date, mood: mood }
        });
        const partnerMembership = await this.prisma.relationshipMember.findFirst({
            where: { relationshipId, userId: { not: userId } }
        });
        let response = null;
        if (partnerMembership) {
            const res = await this.prisma.checkInResponse.findFirst({
                where: { relationshipId, authorId: partnerMembership.userId, mood: mood }
            });
            response = res ? res.content : null;
        }
        return { checkIn, response };
    }
    async today(relationshipId, userId) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return this.prisma.checkIn.findUnique({
            where: { relationshipId_userId_date: { relationshipId, userId, date } }
        });
    }
    moodToLabel(mood) {
        if (!mood)
            return '';
        switch (mood) {
            case 'GOOD': return 'Happy';
            case 'OKAY': return 'Okay';
            case 'LOW': return 'Low';
            case 'STRESSED': return 'Stressed';
            default: return '';
        }
    }
    async todaySummary(relationshipId) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        const members = await this.prisma.relationshipMember.findMany({ where: { relationshipId }, include: { user: true } });
        const items = await Promise.all(members.map(async (m) => {
            var _a;
            const ci = await this.prisma.checkIn.findUnique({
                where: { relationshipId_userId_date: { relationshipId, userId: m.userId, date } }
            });
            return {
                author: ((_a = m.user) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
                mood: this.moodToLabel((ci === null || ci === void 0 ? void 0 : ci.mood) || null),
                text: '',
                time: 'Today'
            };
        }));
        return items;
    }
    async setResponse(relationshipId, authorId, mood, content) {
        const existing = await this.prisma.checkInResponse.findFirst({
            where: { relationshipId, authorId, mood: mood }
        });
        if (existing) {
            return this.prisma.checkInResponse.update({ where: { id: existing.id }, data: { content } });
        }
        return this.prisma.checkInResponse.create({
            data: { relationshipId, authorId, mood: mood, content }
        });
    }
    labelToMood(label) {
        const l = label.trim().toLowerCase();
        if (['happy', 'energized', 'motivated', 'on fire', 'grateful'].some(x => l.includes(x)))
            return 'GOOD';
        if (['chill', 'peaceful', 'okay'].some(x => l.includes(x)))
            return 'OKAY';
        if (['tired', 'low'].some(x => l.includes(x)))
            return 'LOW';
        return 'STRESSED';
    }
    async recordByLabel(relationshipId, userId, moodLabel) {
        const mood = this.labelToMood(moodLabel);
        return this.record(relationshipId, userId, mood);
    }
};
exports.CheckInsService = CheckInsService;
exports.CheckInsService = CheckInsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_repository_1.PrismaService])
], CheckInsService);
//# sourceMappingURL=checkins.service.js.map