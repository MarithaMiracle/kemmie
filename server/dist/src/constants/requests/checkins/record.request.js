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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordCheckInRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const mood_enum_1 = require("../../enums/mood.enum");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class RecordCheckInRequestDto {
}
exports.RecordCheckInRequestDto = RecordCheckInRequestDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'rel_123', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordCheckInRequestDto.prototype, "relationshipId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'usr_abc', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordCheckInRequestDto.prototype, "userId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ enum: mood_enum_1.Mood, example: mood_enum_1.Mood.GOOD, required: true }),
    (0, class_validator_1.IsEnum)(mood_enum_1.Mood),
    __metadata("design:type", String)
], RecordCheckInRequestDto.prototype, "mood", void 0);
//# sourceMappingURL=record.request.js.map