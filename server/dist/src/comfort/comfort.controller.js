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
exports.ComfortController = void 0;
const common_1 = require("@nestjs/common");
const comfort_service_1 = require("./comfort.service");
const passport_1 = require("@nestjs/passport");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ComfortMessageDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComfortMessageDto.prototype, "content", void 0);
let ComfortController = class ComfortController {
    constructor(service) {
        this.service = service;
    }
    next(req) {
        return this.service.nextMessage(req.user.relationshipId);
    }
    add(req, dto) {
        return this.service.addMessage(req.user.relationshipId, req.user.userId, dto.content);
    }
};
exports.ComfortController = ComfortController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ComfortController.prototype, "next", null);
__decorate([
    (0, common_1.Post)('messages'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ComfortMessageDto]),
    __metadata("design:returntype", void 0)
], ComfortController.prototype, "add", null);
exports.ComfortController = ComfortController = __decorate([
    (0, swagger_1.ApiTags)('Bad Day'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('bad-day'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [comfort_service_1.ComfortService])
], ComfortController);
//# sourceMappingURL=comfort.controller.js.map