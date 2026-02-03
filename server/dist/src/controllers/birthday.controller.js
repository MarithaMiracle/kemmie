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
exports.BirthdayController = void 0;
const common_1 = require("@nestjs/common");
const birthday_service_1 = require("../services/birthday.service");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const countdown_response_1 = require("../constants/responses/birthday/countdown.response");
let BirthdayController = class BirthdayController {
    constructor(service) {
        this.service = service;
    }
    countdown(req) {
        return this.service.countdown(req.user.userId, req.user.relationshipId);
    }
};
exports.BirthdayController = BirthdayController;
__decorate([
    (0, common_1.Get)('countdown'),
    (0, swagger_1.ApiOkResponse)({ type: countdown_response_1.CountdownResponseDto }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BirthdayController.prototype, "countdown", null);
exports.BirthdayController = BirthdayController = __decorate([
    (0, swagger_1.ApiTags)('Birthday'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('birthday'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [birthday_service_1.BirthdayService])
], BirthdayController);
//# sourceMappingURL=birthday.controller.js.map