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
exports.AchievementsService = void 0;
const common_1 = require("@nestjs/common");
const streaks_service_1 = require("./streaks.service");
let AchievementsService = class AchievementsService {
    constructor(streaks) {
        this.streaks = streaks;
    }
    async list(relationshipId) {
        const s = await this.streaks.summary(relationshipId);
        const d = s.streakDays;
        return [
            { key: 'week-warrior', title: 'Week Warrior', description: '7 day streak', icon: 'star', unlocked: d >= 7, remainingDays: Math.max(0, 7 - d) },
            { key: 'monthly-maven', title: 'Monthly Maven', description: '30 day streak', icon: 'award', unlocked: d >= 30, remainingDays: Math.max(0, 30 - d) },
            { key: 'legend-100', title: '100 Day Legend', description: '100 day streak', icon: 'trophy', unlocked: d >= 100, remainingDays: Math.max(0, 100 - d) }
        ];
    }
};
exports.AchievementsService = AchievementsService;
exports.AchievementsService = AchievementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [streaks_service_1.StreaksService])
], AchievementsService);
//# sourceMappingURL=achievements.service.js.map