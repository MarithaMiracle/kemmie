"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = paginate;
function paginate(page = 1, pageSize = 20) {
    const take = pageSize;
    const skip = (page - 1) * pageSize;
    return { take, skip };
}
//# sourceMappingURL=pagination.util.js.map