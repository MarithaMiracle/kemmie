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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_repository_1 = require("../repositories/prisma.repository");
let ChatService = class ChatService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async send(relationshipId, senderId, content, type, replyToId) {
        return this.prisma.message.create({ data: { relationshipId, senderId, content, type, replyToId } });
    }
    async react(messageId, userId, value) {
        return this.prisma.messageReaction.upsert({
            where: { messageId_userId_value: { messageId, userId, value } },
            update: {},
            create: { messageId, userId, value }
        });
    }
    async edit(messageId, userId, content) {
        return this.prisma.message.update({ where: { id: messageId }, data: { content, editedAt: new Date() } });
    }
    async delete(messageId, userId) {
        return this.prisma.message.update({ where: { id: messageId }, data: { deletedAt: new Date() } });
    }
    async pin(messageId, userId, pinned) {
        return this.prisma.message.update({
            where: { id: messageId },
            data: { pinned },
            select: { id: true, pinned: true }
        });
    }
    async restore(messageId, userId) {
        return this.prisma.message.update({ where: { id: messageId }, data: { deletedAt: null } });
    }
    async unpinAll(relationshipId) {
        return this.prisma.message.updateMany({ where: { relationshipId }, data: { pinned: false } });
    }
    async list(relationshipId, take = 50, cursor) {
        return this.prisma.message.findMany({
            where: { relationshipId, deletedAt: null },
            include: { replyTo: { select: { id: true, content: true, senderId: true } } },
            orderBy: { createdAt: 'desc' },
            take,
            ...(cursor ? { skip: 1, cursor: { id: cursor } } : {})
        });
    }
    async count(relationshipId) {
        return this.prisma.message.count({ where: { relationshipId } });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_repository_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map