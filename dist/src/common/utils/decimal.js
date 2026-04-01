"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decimalToNumber = decimalToNumber;
function decimalToNumber(value) {
    if (typeof value === 'number')
        return value;
    return value.toNumber();
}
//# sourceMappingURL=decimal.js.map