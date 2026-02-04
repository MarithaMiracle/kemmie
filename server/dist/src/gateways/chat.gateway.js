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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("../services/chat.service");
const jwt_1 = require("@nestjs/jwt");
let ChatGateway = class ChatGateway {
    constructor(chat, jwt) {
        this.chat = chat;
        this.jwt = jwt;
    }
    handleConnection(client) {
        var _a, _b;
        const token = ((_a = client.handshake.auth) === null || _a === void 0 ? void 0 : _a.token) || ((_b = client.handshake.query) === null || _b === void 0 ? void 0 : _b.token);
        if (!token)
            return client.disconnect();
        try {
            const payload = this.jwt.verify(String(token), { secret: process.env.JWT_SECRET || 'changeme' });
            client.data.userId = payload.sub;
            client.data.relationshipId = payload.relationshipId;
            client.join(`rel:${payload.relationshipId}`);
        }
        catch {
            client.disconnect();
        }
    }
    async send(client, data) {
        if (!client.data.relationshipId || !client.data.userId)
            return;
        const msg = await this.chat.send(client.data.relationshipId, client.data.userId, data.content, data.type, data.replyToId);
        this.server.to(`rel:${client.data.relationshipId}`).emit('message:new', msg);
    }
    async react(client, data) {
        if (!client.data.relationshipId || !client.data.userId)
            return;
        const r = await this.chat.react(data.messageId, client.data.userId, data.value);
        this.server.to(`rel:${client.data.relationshipId}`).emit('message:reaction', r);
    }
    async callOffer(client, data) {
        if (!client.data.relationshipId || !client.data.userId)
            return;
        client.broadcast.to(`rel:${client.data.relationshipId}`).emit('call:offer', { from: client.data.userId, sdp: data.sdp });
    }
    async callAnswer(client, data) {
        if (!client.data.relationshipId || !client.data.userId)
            return;
        client.broadcast.to(`rel:${client.data.relationshipId}`).emit('call:answer', { from: client.data.userId, sdp: data.sdp });
    }
    async callIce(client, data) {
        if (!client.data.relationshipId || !client.data.userId)
            return;
        client.broadcast.to(`rel:${client.data.relationshipId}`).emit('call:ice', { from: client.data.userId, candidate: data.candidate });
    }
    async callEnd(client) {
        if (!client.data.relationshipId || !client.data.userId)
            return;
        client.broadcast.to(`rel:${client.data.relationshipId}`).emit('call:end', { from: client.data.userId });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message:send'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "send", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message:react'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "react", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('call:offer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "callOffer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('call:answer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "callAnswer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('call:ice'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "callIce", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('call:end'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "callEnd", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [chat_service_1.ChatService, jwt_1.JwtService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map