"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./modules/prisma.module");
const auth_module_1 = require("./modules/auth.module");
const letters_module_1 = require("./modules/letters.module");
const birthday_module_1 = require("./modules/birthday.module");
const vibe_check_module_1 = require("./modules/vibe-check.module");
const comfort_module_1 = require("./modules/comfort.module");
const chat_module_1 = require("./modules/chat.module");
const identity_module_1 = require("./modules/identity.module");
const home_module_1 = require("./modules/home.module");
const vibes_module_1 = require("./modules/vibes.module");
const streaks_module_1 = require("./modules/streaks.module");
const achievements_module_1 = require("./modules/achievements.module");
const memories_module_1 = require("./modules/memories.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            jwt_1.JwtModule.register({ secret: process.env.JWT_SECRET || 'changeme', signOptions: { expiresIn: '7d' } }),
            auth_module_1.AuthModule,
            letters_module_1.LettersModule,
            birthday_module_1.BirthdayModule,
            vibe_check_module_1.VibeCheckModule,
            vibes_module_1.VibesModule,
            comfort_module_1.ComfortModule,
            identity_module_1.IdentityModule,
            home_module_1.HomeModule,
            chat_module_1.ChatModule,
            streaks_module_1.StreaksModule,
            achievements_module_1.AchievementsModule,
            memories_module_1.MemoriesModule
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map