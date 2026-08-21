import { UserBuilder } from '../builders/user-builder';
import { User } from '../entities/user.entity';

export const UserTemplates = {
  johnDoe: (): User =>
    UserBuilder.aUser()
      .withFirstName('John')
      .withLastName('Doe')
      .withEmail('john.doe@example.com')
      .withPassword('Password123!')
      .withPhone('+1234567890')
      .build(),

  minimalCustomer: (): User =>
    UserBuilder.aUser()
      .withFirstName('Min')
      .withLastName('User')
      .withEmail('min.user@example.com')
      .withPassword('Pass1')
      .withPhone('+0000000000')
      .build(),

  maxLengthName: (): User =>
    UserBuilder.aUser()
      .withFirstName('A'.repeat(32))
      .withLastName('B'.repeat(32))
      .withEmail('max.name@example.com')
      .build(),

  invalidEmail: (): User =>
    UserBuilder.aUser()
      .withEmail('not-an-email')
      .withPassword('Test@123')
      .build(),

  mismatchedPasswords: () => ({
    user: UserBuilder.aUser().build(),
    confirmPassword: 'DifferentPass1',
  }),

  emptyFields: (): Partial<User> => ({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  }),
};