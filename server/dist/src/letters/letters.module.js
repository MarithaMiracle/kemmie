"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LettersModule = void 0;
const common_1 = require("@nestjs/common");
const letters_service_1 = require("./letters.service");
const letters_controller_1 = require("./letters.controller");
const passport_1 = require("@nestjs/passport");
let LettersModule = class LettersModule {
};
exports.LettersModule = LettersModule;
exports.LettersModule = LettersModule = __decorate([
    (0, common_1.Module)({
        imports: [passport_1.PassportModule.register({ defaultStrategy: 'jwt' })],
        providers: [letters_service_1.LettersService],
        controllers: [letters_controller_1.LettersController]
    })
], LettersModule);
//# sourceMappingURL=letters.module.js.map