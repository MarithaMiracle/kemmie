"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VibeCheckModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const vibe_check_controller_1 = require("../controllers/vibe-check.controller");
const vibe_check_service_1 = require("../services/vibe-check.service");
const mood_service_1 = require("../services/mood.service");
let VibeCheckModule = class VibeCheckModule {
};
exports.VibeCheckModule = VibeCheckModule;
exports.VibeCheckModule = VibeCheckModule = __decorate([
    (0, common_1.Module)({
        imports: [passport_1.PassportModule.register({ defaultStrategy: 'jwt' })],
        controllers: [vibe_check_controller_1.VibeCheckController],
        providers: [vibe_check_service_1.VibeCheckService, mood_service_1.MoodService],
        exports: [vibe_check_service_1.VibeCheckService, mood_service_1.MoodService]
    })
], VibeCheckModule);
//# sourceMappingURL=vibe-check.module.js.map