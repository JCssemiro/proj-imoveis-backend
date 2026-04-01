"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_LEAD = void 0;
exports.isClosedStatus = isClosedStatus;
exports.STATUS_LEAD = {
    NEW: 1,
    CONTACTED: 2,
    IN_PROGRESS: 3,
    CLOSED: 4,
};
function isClosedStatus(status) {
    return status === exports.STATUS_LEAD.CLOSED;
}
//# sourceMappingURL=status-lead.js.map