import { faker } from '@faker-js/faker';
import { User } from '../entities/user.entity';

export class UserBuilder {
  private user: Partial<User> = {};

  static aUser(): UserBuilder {
    const builder = new UserBuilder();
    builder.user = {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      password: 'Test@123',
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      newsletter: false,
      privacyAgreed: true,
      status: 'active',
    };
    return builder;
  }

  static aReturningCustomer(): UserBuilder {
    return UserBuilder.aUser()
      .withEmail('john.doe@example.com')
      .withPassword('Password123!')
      .withFirstName('John')
      .withLastName('Doe');
  }

  withEmail(email: string): this { this.user.email = email; return this; }
  withPassword(password: string): this { this.user.password = password; return this; }
  withFirstName(name: string): this { this.user.firstName = name; return this; }
  withLastName(name: string): this { this.user.lastName = name; return this; }
  withPhone(phone: string): this { this.user.phone = phone; return this; }
  inactive(): this { this.user.status = 'inactive'; return this; }

  build(): User {
    return { ...this.user } as User;
  }
}