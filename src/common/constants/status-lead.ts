/**
 * Status do interesse (lead) em ordem numérica crescente no funil.
 * 1 = novo → 4 = encerrado.
 */
export const STATUS_LEAD = {
  NEW: 1,
  CONTACTED: 2,
  IN_PROGRESS: 3,
  CLOSED: 4,
} as const;

export type StatusLeadCode = (typeof STATUS_LEAD)[keyof typeof STATUS_LEAD];

export function isClosedStatus(status: number): boolean {
  return status === STATUS_LEAD.CLOSED;
}
