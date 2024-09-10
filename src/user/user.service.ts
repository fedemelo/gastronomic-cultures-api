import { Injectable } from '@nestjs/common';
import { User } from './user';
import { Role } from './roles/roles';

@Injectable()
export class UserService {
  private users: User[] = [
    new User(1, 'admin', 'admin_password', [Role.Admin]), // Admin with all permissions
    new User(2, 'reader', 'reader_password', [Role.ReadAll]), // User with read permissions for all resources
    new User(3, 'recipe_reader', 'specific_reader_password', [Role.ReadRecipe]), // User with read permissions for a specific resource (recipe)
    new User(4, 'writer', 'writer_password', [Role.Write]), // User with write (create and update) permissions
    new User(5, 'deleter', 'deleter_password', [Role.Delete]), // User with delete permissions
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
