export interface UserAudit {
  user: string;
  when?: Date;
  who: string;
  what: string;
  oldSalaire: number;
  newSalaire: number;
}
