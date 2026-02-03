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
exports.VibesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const vibes_service_1 = require("../services/vibes.service");
let VibesController = class VibesController {
    constructor(vibes) {
        this.vibes = vibes;
    }
    async list(req, category, authorName, limit, cursor) {
        return this.vibes.list(req.user.relationshipId, { category, authorName, limit: limit ? Number(limit) : undefined, cursor });
    }
    async add(req, body) {
        return this.vibes.add(req.user.relationshipId, req.user.userId, (body.category || '').toUpperCase(), body.data || {});
    }
};
exports.VibesController = VibesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('authorName')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('cursor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], VibesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VibesController.prototype, "add", null);
exports.VibesController = VibesController = __decorate([
    (0, swagger_1.ApiTags)('Vibes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('vibes'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [vibes_service_1.VibesService])
], VibesController);
//# sourceMappingURL=vibes.controller.js.map