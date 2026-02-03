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
exports.MemoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_repository_1 = require("../repositories/prisma.repository");
let MemoriesService = class MemoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async stats(relationshipId) {
        const photos = await this.prisma.memory.count({ where: { relationshipId, type: 'PHOTO' } });
        const videos = await this.prisma.memory.count({ where: { relationshipId, type: 'VIDEO' } });
        const favorites = await this.prisma.memory.count({ where: { relationshipId, favorite: true } });
        return { photos, videos, total: photos + videos, favorites };
    }
    async add(relationshipId, authorId, type, url, mimeType) {
        if (!['PHOTO', 'VIDEO'].includes(type))
            throw new common_1.BadRequestException('invalid_type');
        if (!url)
            throw new common_1.BadRequestException('invalid_url');
        return this.prisma.memory.create({ data: { relationshipId, authorId, type, url, mimeType } });
    }
    async list(relationshipId, params) {
        var _a;
        const where = { relationshipId };
        if (params.type)
            where.type = params.type;
        if (typeof params.favorite === 'boolean')
            where.favorite = params.favorite;
        const take = (_a = params.limit) !== null && _a !== void 0 ? _a : 50;
        return this.prisma.memory.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take,
            ...(params.cursor ? { skip: 1, cursor: { id: params.cursor } } : {})
        });
    }
    async setFavorite(relationshipId, id, favorite) {
        const mem = await this.prisma.memory.findFirst({ where: { id, relationshipId } });
        if (!mem)
            throw new common_1.BadRequestException('not_found');
        return this.prisma.memory.update({ where: { id }, data: { favorite } });
    }
    async remove(relationshipId, id) {
        const mem = await this.prisma.memory.findFirst({ where: { id, relationshipId } });
        if (!mem)
            throw new common_1.BadRequestException('not_found');
        return this.prisma.memory.delete({ where: { id } });
    }
};
exports.MemoriesService = MemoriesService;
exports.MemoriesService = MemoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_repository_1.PrismaService])
], MemoriesService);
//# sourceMappingURL=memories.service.js.map