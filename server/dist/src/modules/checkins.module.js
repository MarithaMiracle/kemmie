"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInsModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const checkins_controller_1 = require("../controllers/checkins.controller");
const vibe_check_controller_1 = require("../controllers/vibe-check.controller");
const checkins_service_1 = require("../services/checkins.service");
let CheckInsModule = class CheckInsModule {
};
exports.CheckInsModule = CheckInsModule;
exports.CheckInsModule = CheckInsModule = __decorate([
    (0, common_1.Module)({
        imports: [passport_1.PassportModule.register({ defaultStrategy: 'jwt' })],
        controllers: [checkins_controller_1.CheckInsController, vibe_check_controller_1.VibeCheckController],
        providers: [checkins_service_1.CheckInsService]
    })
], CheckInsModule);
//# sourceMappingURL=checkins.module.js.map