"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInterestDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_interest_dto_1 = require("./create-interest.dto");
class UpdateInterestDto extends (0, mapped_types_1.PartialType)(create_interest_dto_1.CreateInterestDto) {
}
exports.UpdateInterestDto = UpdateInterestDto;
//# sourceMappingURL=update-interest.dto.js.map