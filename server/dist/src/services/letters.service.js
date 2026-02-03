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
exports.LettersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_repository_1 = require("../repositories/prisma.repository");
let LettersService = class LettersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createLetter(relationshipId, authorId, content, unlockDate) {
        return this.prisma.letter.create({ data: { relationshipId, authorId, content, unlockDate } });
    }
    async getLetterForDate(relationshipId, date) {
        const start = new Date(date);
        const end = new Date(date);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return this.prisma.letter.findFirst({ where: { relationshipId, unlockDate: { gte: start, lte: end } } });
    }
    async getToday(relationshipId) {
        const unlockHour = Number(process.env.LETTER_UNLOCK_HOUR || 7);
        const now = new Date();
        const todayUnlock = new Date();
        todayUnlock.setHours(unlockHour, 0, 0, 0);
        const letter = await this.getLetterForDate(relationshipId, now);
        const unlocked = now.getTime() >= todayUnlock.getTime();
        const unlockInSeconds = unlocked ? 0 : Math.max(0, Math.floor((todayUnlock.getTime() - now.getTime()) / 1000));
        return { letter: unlocked ? letter : null, unlocked, unlockInSeconds };
    }
    async markRead(letterId) {
        return this.prisma.letter.update({ where: { id: letterId }, data: { readAt: new Date() } });
    }
};
exports.LettersService = LettersService;
exports.LettersService = LettersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_repository_1.PrismaService])
], LettersService);
//# sourceMappingURL=letters.service.js.map