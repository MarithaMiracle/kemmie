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
            timestamp: new Date(m.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        }));
    }
    async stats(req) {
        const messagesCount = await this.chat.count(req.user.relationshipId);
        return { messagesCount };
    }
    async send(req, body) {
        const msg = await this.chat.send(req.user.relationshipId, req.user.userId, body.content, (body.type || 'TEXT'));
        this.gateway.server.to(`rel:${req.user.relationshipId}`).emit('message:new', msg);
        return {
            id: msg.id,
            text: msg.content,
            sender: msg.senderId === req.user.userId ? 'me' : 'them',
            timestamp: new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        };
    }
    async react(req, body) {
        const r = await this.chat.react(body.messageId, req.user.userId, body.value);
        this.gateway.server.to(`rel:${req.user.relationshipId}`).emit('message:reaction', r);
        return r;
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
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('Chat'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('chat'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [chat_service_1.ChatService, chat_gateway_1.ChatGateway])
], ChatController);
//# sourceMappingURL=chat.controller.js.map