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
exports.VibeCheckController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const vibe_check_service_1 = require("../services/vibe-check.service");
let VibeCheckController = class VibeCheckController {
    constructor(service) {
        this.service = service;
    }
    async todaySummary(req) {
        return this.service.todaySummary(req.user.relationshipId);
    }
    async record(req, body) {
        return this.service.recordByLabel(req.user.relationshipId, req.user.userId, body.moodLabel);
    }
};
exports.VibeCheckController = VibeCheckController;
__decorate([
    (0, common_1.Get)('today/summary'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VibeCheckController.prototype, "todaySummary", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VibeCheckController.prototype, "record", null);
exports.VibeCheckController = VibeCheckController = __decorate([
    (0, swagger_1.ApiTags)('Vibe Check'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('vibe-check'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [vibe_check_service_1.VibeCheckService])
], VibeCheckController);
//# sourceMappingURL=vibe-check.controller.js.map