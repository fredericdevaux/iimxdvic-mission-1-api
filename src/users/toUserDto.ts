import { UserDto } from './userDto';
import { User } from './user.entity';

export const toUserDto = (data: User): UserDto => {
  const { id, email, firstName, lastName, siret, birthDate } = data;
  const userDto: UserDto = { id, email,  firstName, lastName, siret, birthDate};
  return userDto;
};
