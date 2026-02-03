"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOfToday = startOfToday;
function startOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}
//# sourceMappingURL=date.helper.js.map