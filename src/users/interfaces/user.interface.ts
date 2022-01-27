export interface User {
  _id?: string;
  id?: number;
  name: string;
  password: string;
  role: string;
  salaire: number;
  service: string;
  createdAt?: Date;
  updatedAt?: Date;
}
