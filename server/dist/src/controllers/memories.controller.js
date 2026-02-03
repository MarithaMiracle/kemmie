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
exports.MemoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const memories_service_1 = require("../services/memories.service");
let MemoriesController = class MemoriesController {
    constructor(service) {
        this.service = service;
    }
    async stats(req) {
        return this.service.stats(req.user.relationshipId);
    }
    async list(req, type, favorite, limit, cursor) {
        return this.service.list(req.user.relationshipId, {
            type: type,
            favorite: favorite === 'true' ? true : favorite === 'false' ? false : undefined,
            limit: limit ? Number(limit) : undefined,
            cursor
        });
    }
    async add(req, body) {
        return this.service.add(req.user.relationshipId, req.user.userId, body.type, body.url, body.mimeType);
    }
    async setFavorite(req, id, body) {
        return this.service.setFavorite(req.user.relationshipId, id, body.favorite);
    }
    async remove(req, id) {
        return this.service.remove(req.user.relationshipId, id);
    }
};
exports.MemoriesController = MemoriesController;
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemoriesController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('favorite')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('cursor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MemoriesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MemoriesController.prototype, "add", null);
__decorate([
    (0, common_1.Patch)(':id/favorite'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MemoriesController.prototype, "setFavorite", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MemoriesController.prototype, "remove", null);
exports.MemoriesController = MemoriesController = __decorate([
    (0, swagger_1.ApiTags)('Memories'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('memories'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [memories_service_1.MemoriesService])
], MemoriesController);
//# sourceMappingURL=memories.controller.js.map