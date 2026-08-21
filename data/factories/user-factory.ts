import { UserBuilder } from '../builders/user-builder';
import { User } from '../entities/user.entity';
import { DataRegistry } from '../registry/data-registry';

export class UserFactory {
  constructor(private registry: DataRegistry) {}

  createNewCustomer(): User {
    const user = UserBuilder.aUser().build();
    this.registry.register('user', user.id, user);
    return user;
  }

  createReturningCustomer(): User {
    const user = UserBuilder.aReturningCustomer().build();
    this.registry.register('user', user.id, user);
    return user;
  }

  createInactiveCustomer(): User {
    const user = UserBuilder.aUser().inactive().build();
    this.registry.register('user', user.id, user);
    return user;
  }

  createBatch(count: number): User[] {
    return Array.from({ length: count }, () => {
      const user = UserBuilder.aUser().build();
      this.registry.register('user', user.id, user);
      return user;
    });
  }
}