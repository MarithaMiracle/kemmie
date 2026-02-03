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
exports.LettersController = void 0;
const common_1 = require("@nestjs/common");
const letters_service_1 = require("./letters.service");
const class_validator_1 = require("class-validator");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
class CreateLetterDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLetterDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateLetterDto.prototype, "unlockDate", void 0);
let LettersController = class LettersController {
    constructor(service) {
        this.service = service;
    }
    create(req, dto) {
        return this.service.createLetter(req.user.relationshipId, req.user.userId, dto.content, new Date(dto.unlockDate));
    }
    today(req) {
        return this.service.getToday(req.user.relationshipId);
    }
    byDate(req, date) {
        return this.service.getLetterForDate(req.user.relationshipId, new Date(date));
    }
    read(id) {
        return this.service.markRead(id);
    }
};
exports.LettersController = LettersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateLetterDto]),
    __metadata("design:returntype", void 0)
], LettersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('today'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LettersController.prototype, "today", null);
__decorate([
    (0, common_1.Get)(':date'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LettersController.prototype, "byDate", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LettersController.prototype, "read", null);
exports.LettersController = LettersController = __decorate([
    (0, swagger_1.ApiTags)('Letters'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('letters'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [letters_service_1.LettersService])
], LettersController);
//# sourceMappingURL=letters.controller.js.map