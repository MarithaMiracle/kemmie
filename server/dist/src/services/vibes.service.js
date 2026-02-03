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
exports.VibesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_repository_1 = require("../repositories/prisma.repository");
let VibesService = class VibesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    timeAgo(d) {
        const ms = Date.now() - new Date(d).getTime();
        const m = Math.floor(ms / 60000);
        if (m < 1)
            return 'Now';
        if (m < 60)
            return `${m}m ago`;
        const h = Math.floor(m / 60);
        if (h < 24)
            return `${h}h ago`;
        return 'Yesterday';
    }
    toUI(v, name) {
        var _a, _b, _c, _d, _e, _f;
        const t = this.timeAgo(v.createdAt);
        const data = v.data || {};
        switch (v.category) {
            case 'FOOD':
                return { emoji: (_a = data.emoji) !== null && _a !== void 0 ? _a : '🍽️', text: data.text, type: data.type, time: t, author: name };
            case 'ACTIVITY':
                return { emoji: (_b = data.emoji) !== null && _b !== void 0 ? _b : '🎉', text: data.text, type: data.type, time: t, author: name };
            case 'MUSIC':
                return { emoji: (_c = data.emoji) !== null && _c !== void 0 ? _c : '🎵', artist: data.artist, song: data.song, status: data.status, time: t, author: name };
            case 'SHOPPING':
                return { emoji: (_d = data.emoji) !== null && _d !== void 0 ? _d : '🛍️', item: data.item, store: data.store, priority: data.priority, author: name };
            case 'PLAN':
                return { emoji: (_e = data.emoji) !== null && _e !== void 0 ? _e : '📍', plan: data.plan, date: data.date, location: data.location, author: name };
            default:
                return { emoji: '✨', text: (_f = data.text) !== null && _f !== void 0 ? _f : '', time: t, author: name };
        }
    }
    async add(relationshipId, authorId, category, data) {
        if (!['FOOD', 'ACTIVITY', 'MUSIC', 'SHOPPING', 'PLAN'].includes(category)) {
            throw new common_1.BadRequestException('invalid_category');
        }
        return this.prisma.vibe.create({ data: { relationshipId, authorId, category, data } });
    }
    async list(relationshipId, params) {
        var _a;
        const members = await this.prisma.relationshipMember.findMany({ where: { relationshipId }, include: { user: true } });
        const nameMap = new Map(members.map(m => { var _a; return [m.userId, ((_a = m.user) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown']; }));
        let authorId;
        if (params.authorName) {
            const m = members.find(x => { var _a; return (((_a = x.user) === null || _a === void 0 ? void 0 : _a.name) || '').toLowerCase() === params.authorName.toLowerCase(); });
            authorId = m === null || m === void 0 ? void 0 : m.userId;
        }
        const where = { relationshipId };
        if (params.category)
            where.category = (params.category || '').toUpperCase();
        if (authorId)
            where.authorId = authorId;
        const take = (_a = params.limit) !== null && _a !== void 0 ? _a : 50;
        const list = await this.prisma.vibe.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take,
            ...(params.cursor ? { skip: 1, cursor: { id: params.cursor } } : {})
        });
        return list.map(v => this.toUI(v, nameMap.get(v.authorId) || 'Unknown'));
    }
};
exports.VibesService = VibesService;
exports.VibesService = VibesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_repository_1.PrismaService])
], VibesService);
//# sourceMappingURL=vibes.service.js.map