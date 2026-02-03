"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BirthdayModule = void 0;
const common_1 = require("@nestjs/common");
const birthday_service_1 = require("./birthday.service");
const birthday_controller_1 = require("./birthday.controller");
const passport_1 = require("@nestjs/passport");
let BirthdayModule = class BirthdayModule {
};
exports.BirthdayModule = BirthdayModule;
exports.BirthdayModule = BirthdayModule = __decorate([
    (0, common_1.Module)({
        imports: [passport_1.PassportModule.register({ defaultStrategy: 'jwt' })],
        providers: [birthday_service_1.BirthdayService],
        controllers: [birthday_controller_1.BirthdayController]
    })
], BirthdayModule);
//# sourceMappingURL=birthday.module.js.map