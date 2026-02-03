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
exports.IdentityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_repository_1 = require("../repositories/prisma.repository");
let IdentityService = class IdentityService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async names(userId, relationshipId) {
        var _a, _b, _c, _d;
        const members = await this.prisma.relationshipMember.findMany({
            where: { relationshipId },
            include: { user: { select: { id: true, name: true } } }
        });
        const me = ((_b = (_a = members.find(m => m.userId === userId)) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.name) || 'You';
        const partner = ((_d = (_c = members.find(m => m.userId !== userId)) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.name) || 'Bestie';
        return { currentUserName: me, bestieName: partner };
    }
};
exports.IdentityService = IdentityService;
exports.IdentityService = IdentityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_repository_1.PrismaService])
], IdentityService);
//# sourceMappingURL=identity.service.js.map