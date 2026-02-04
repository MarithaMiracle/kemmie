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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const chat_service_1 = require("../services/chat.service");
const chat_gateway_1 = require("../gateways/chat.gateway");
let ChatController = class ChatController {
    constructor(chat, gateway) {
        this.chat = chat;
        this.gateway = gateway;
    }
    async messages(req, limit = '50', cursor) {
        const list = await this.chat.list(req.user.relationshipId, Number(limit), cursor);
        return list.map(m => ({
            id: m.id,
            text: m.content,
            sender: m.senderId === req.user.userId ? 'me' : 'them',
            createdAt: m.createdAt.toISOString(),
            timestamp: new Date(m.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            pinned: !!m.pinned,
            replyToId: m.replyToId || null,
            editedAt: m.editedAt ? m.editedAt.toISOString() : undefined,
            replyTo: m.replyTo ? { id: m.replyTo.id, text: m.replyTo.content, sender: (m.replyTo.senderId === req.user.userId ? 'me' : 'them') } : undefined,
        }));
    }
    async stats(req) {
        const messagesCount = await this.chat.count(req.user.relationshipId);
        return { messagesCount };
    }
    async send(req, body) {
        const msg = await this.chat.send(req.user.relationshipId, req.user.userId, body.content, (body.type || 'TEXT'), body.replyToId);
        this.gateway.server.to(`rel:${req.user.relationshipId}`).emit('message:new', msg);
        return {
            id: msg.id,
            text: msg.content,
            sender: msg.senderId === req.user.userId ? 'me' : 'them',
            createdAt: msg.createdAt.toISOString(),
            timestamp: new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            pinned: !!msg.pinned,
            replyToId: msg.replyToId || null,
            replyTo: msg.replyTo ? { id: msg.replyTo.id, text: msg.replyTo.content, sender: (msg.replyTo.senderId === req.user.userId ? 'me' : 'them') } : undefined,
        };
    }
    async react(req, body) {
        const r = await this.chat.react(body.messageId, req.user.userId, body.value);
        this.gateway.server.to(`rel:${req.user.relationshipId}`).emit('message:reaction', r);
        return r;
    }
    async edit(req, id, body) {
        const updated = await this.chat.edit(id, req.user.userId, body.content);
        return {
            id: updated.id,
            text: updated.content,
            sender: updated.senderId === req.user.userId ? 'me' : 'them',
            createdAt: updated.createdAt.toISOString(),
            timestamp: new Date(updated.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            pinned: !!updated.pinned,
            replyToId: updated.replyToId || null,
            editedAt: updated.editedAt ? updated.editedAt.toISOString() : undefined,
        };
    }
    async remove(req, id) {
        await this.chat.delete(id, req.user.userId);
        return { id };
    }
    async pin(req, id, body) {
        const updated = await this.chat.pin(id, req.user.userId, body.pinned);
        return { id: updated.id, pinned: !!updated.pinned };
    }
    async restore(req, id) {
        const updated = await this.chat.restore(id, req.user.userId);
        return { id: updated.id };
    }
    async unpinAll(req) {
        var _a;
        const res = await this.chat.unpinAll(req.user.relationshipId);
        return { count: (_a = res.count) !== null && _a !== void 0 ? _a : 0 };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)('messages'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('cursor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "messages", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "stats", null);
__decorate([
    (0, common_1.Post)('messages'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "send", null);
__decorate([
    (0, common_1.Post)('reactions'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "react", null);
__decorate([
    (0, common_1.Patch)('messages/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "edit", null);
__decorate([
    (0, common_1.Delete)('messages/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)('messages/:id/pin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "pin", null);
__decorate([
    (0, common_1.Patch)('messages/:id/restore'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "restore", null);
__decorate([
    (0, common_1.Patch)('messages/unpin-all'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "unpinAll", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('Chat'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('chat'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [chat_service_1.ChatService, chat_gateway_1.ChatGateway])
], ChatController);
//# sourceMappingURL=chat.controller.js.map