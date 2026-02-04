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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("../services/auth.service");
const login_response_1 = require("../constants/responses/auth/login.response");
const google_mobile_request_1 = require("../constants/requests/auth/google-mobile.request");
const dev_login_request_1 = require("../constants/requests/auth/dev-login.request");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async googleMobile(body) {
        return this.authService.googleMobile(body.idToken);
    }
    async devLogin(body) {
        return this.authService.devLogin(body.email);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('google/mobile'),
    (0, swagger_1.ApiOkResponse)({ type: login_response_1.LoginResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [google_mobile_request_1.GoogleMobileLoginRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleMobile", null);
__decorate([
    (0, common_1.Post)('dev/login'),
    (0, swagger_1.ApiOkResponse)({ type: login_response_1.LoginResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dev_login_request_1.DevLoginRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "devLogin", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map