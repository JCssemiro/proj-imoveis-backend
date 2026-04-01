import { Decimal } from '@prisma/client/runtime/library';

export function decimalToNumber(value: Decimal | number): number {
  if (typeof value === 'number') return value;
  return value.toNumber();
}
