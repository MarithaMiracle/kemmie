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
exports.ComfortService = void 0;
const common_1 = require("@nestjs/common");
const prisma_repository_1 = require("../repositories/prisma.repository");
let ComfortService = class ComfortService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async nextMessage(relationshipId) {
        let state = await this.prisma.comfortState.findFirst({ where: { relationshipId }, orderBy: { cycleId: 'desc' } });
        if (!state)
            state = await this.prisma.comfortState.create({ data: { relationshipId } });
        const all = await this.prisma.comfortMessage.findMany({ where: { relationshipId } });
        if (all.length === 0)
            return { message: null };
        const used = await this.prisma.comfortStateUsed.findMany({ where: { comfortStateId: state.id } });
        const usedIds = new Set(used.map(u => u.messageId));
        const remaining = all.filter(m => !usedIds.has(m.id));
        if (remaining.length === 0) {
            state = await this.prisma.comfortState.create({ data: { relationshipId, cycleId: state.cycleId + 1 } });
            const next = all[Math.floor(Math.random() * all.length)];
            await this.prisma.comfortStateUsed.create({ data: { comfortStateId: state.id, messageId: next.id } });
            return { message: next.content, cycleId: state.cycleId };
        }
        const chosen = remaining[Math.floor(Math.random() * remaining.length)];
        await this.prisma.comfortStateUsed.create({ data: { comfortStateId: state.id, messageId: chosen.id } });
        return { message: chosen.content, cycleId: state.cycleId };
    }
    async addMessage(relationshipId, authorId, content) {
        return this.prisma.comfortMessage.create({ data: { relationshipId, authorId, content } });
    }
};
exports.ComfortService = ComfortService;
exports.ComfortService = ComfortService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_repository_1.PrismaService])
], ComfortService);
//# sourceMappingURL=comfort.service.js.map