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
exports.CheckInsController = void 0;
const common_1 = require("@nestjs/common");
const checkins_service_1 = require("./checkins.service");
const passport_1 = require("@nestjs/passport");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CheckInDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['GOOD', 'OKAY', 'LOW', 'STRESSED'] }),
    (0, class_validator_1.IsIn)(['GOOD', 'OKAY', 'LOW', 'STRESSED']),
    __metadata("design:type", String)
], CheckInDto.prototype, "mood", void 0);
class CheckInResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['GOOD', 'OKAY', 'LOW', 'STRESSED'] }),
    (0, class_validator_1.IsIn)(['GOOD', 'OKAY', 'LOW', 'STRESSED']),
    __metadata("design:type", String)
], CheckInResponseDto.prototype, "mood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckInResponseDto.prototype, "content", void 0);
let CheckInsController = class CheckInsController {
    constructor(service) {
        this.service = service;
    }
    record(req, dto) {
        return this.service.record(req.user.relationshipId, req.user.userId, dto.mood);
    }
    today(req) {
        return this.service.today(req.user.relationshipId, req.user.userId);
    }
    setResponse(req, dto) {
        return this.service.setResponse(req.user.relationshipId, req.user.userId, dto.mood, dto.content);
    }
};
exports.CheckInsController = CheckInsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CheckInDto]),
    __metadata("design:returntype", void 0)
], CheckInsController.prototype, "record", null);
__decorate([
    (0, common_1.Get)('today'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CheckInsController.prototype, "today", null);
__decorate([
    (0, common_1.Post)('responses'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CheckInResponseDto]),
    __metadata("design:returntype", void 0)
], CheckInsController.prototype, "setResponse", null);
exports.CheckInsController = CheckInsController = __decorate([
    (0, swagger_1.ApiTags)('Check-Ins'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('check-ins'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [checkins_service_1.CheckInsService])
], CheckInsController);
//# sourceMappingURL=checkins.controller.js.map