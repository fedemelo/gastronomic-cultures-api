import { Role } from './roles/roles';

export class User {
  id: number;
  username: string;
  password: string;
  roles: Role[];

  constructor(id: number, username: string, password: string, roles: Role[]) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.roles = roles;
  }
}
