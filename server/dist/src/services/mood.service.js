"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodService = void 0;
const common_1 = require("@nestjs/common");
let MoodService = class MoodService {
    toLabel(mood) {
        if (!mood)
            return '';
        switch (mood) {
            case 'GOOD': return 'Happy';
            case 'OKAY': return 'Okay';
            case 'LOW': return 'Low';
            case 'STRESSED': return 'Stressed';
            default: return '';
        }
    }
    fromLabel(label) {
        const l = (label || '').trim().toLowerCase();
        if (['happy', 'energized', 'motivated', 'on fire', 'grateful'].some(x => l.includes(x)))
            return 'GOOD';
        if (['chill', 'peaceful', 'okay'].some(x => l.includes(x)))
            return 'OKAY';
        if (['tired', 'low'].some(x => l.includes(x)))
            return 'LOW';
        return 'STRESSED';
    }
};
exports.MoodService = MoodService;
exports.MoodService = MoodService = __decorate([
    (0, common_1.Injectable)()
], MoodService);
//# sourceMappingURL=mood.service.js.map