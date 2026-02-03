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
exports.StreaksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_repository_1 = require("../repositories/prisma.repository");
let StreaksService = class StreaksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    toDayKey(d) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
    }
    async summary(relationshipId) {
        const all = await this.prisma.checkIn.findMany({
            where: { relationshipId },
            orderBy: { date: 'asc' }
        });
        const dayKeys = Array.from(new Set(all.map(ci => this.toDayKey(ci.date))));
        const dates = dayKeys.map(k => new Date(k));
        const daySet = new Set(dayKeys);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let streakDays = 0;
        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            if (daySet.has(this.toDayKey(d)))
                streakDays++;
            else
                break;
        }
        let bestStreakDays = 0;
        let run = 0;
        for (let i = 0; i < dates.length; i++) {
            if (i === 0) {
                run = 1;
                bestStreakDays = Math.max(bestStreakDays, run);
                continue;
            }
            const prev = dates[i - 1];
            const cur = dates[i];
            const diff = Math.round((cur.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
            run = diff === 1 ? run + 1 : 1;
            bestStreakDays = Math.max(bestStreakDays, run);
        }
        const dayIndex = (d) => (d.getDay() + 6) % 7;
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - dayIndex(today));
        const week = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);
            week.push(daySet.has(this.toDayKey(d)));
        }
        const last = dates.length ? dates[dates.length - 1] : null;
        const lastActiveSeconds = last ? Math.max(0, Math.floor((new Date().getTime() - last.getTime()) / 1000)) : 0;
        return { streakDays, bestStreakDays, week, lastActiveSeconds };
    }
};
exports.StreaksService = StreaksService;
exports.StreaksService = StreaksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_repository_1.PrismaService])
], StreaksService);
//# sourceMappingURL=streaks.service.js.map