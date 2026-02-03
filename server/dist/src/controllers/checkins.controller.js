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
const swagger_1 = require("@nestjs/swagger");
const checkins_service_1 = require("../services/checkins.service");
const record_request_1 = require("../constants/requests/checkins/record.request");
const record_response_1 = require("../constants/responses/checkins/record.response");
const passport_1 = require("@nestjs/passport");
let CheckInsController = class CheckInsController {
    constructor(service) {
        this.service = service;
    }
    async record(body) {
        const result = await this.service.record(body.relationshipId, body.userId, body.mood);
        return { response: result.response };
    }
    async today(relationshipId, userId) {
        return this.service.today(relationshipId, userId);
    }
    async todaySummary(req) {
        return this.service.todaySummary(req.user.relationshipId);
    }
};
exports.CheckInsController = CheckInsController;
__decorate([
    (0, common_1.Post)('record'),
    (0, swagger_1.ApiOkResponse)({ type: record_response_1.RecordCheckInResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [record_request_1.RecordCheckInRequestDto]),
    __metadata("design:returntype", Promise)
], CheckInsController.prototype, "record", null);
__decorate([
    (0, common_1.Get)('today'),
    __param(0, (0, common_1.Query)('relationshipId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CheckInsController.prototype, "today", null);
__decorate([
    (0, common_1.Get)('today/summary'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CheckInsController.prototype, "todaySummary", null);
exports.CheckInsController = CheckInsController = __decorate([
    (0, swagger_1.ApiTags)('checkins'),
    (0, common_1.Controller)('checkins'),
    __metadata("design:paramtypes", [checkins_service_1.CheckInsService])
], CheckInsController);
//# sourceMappingURL=checkins.controller.js.map