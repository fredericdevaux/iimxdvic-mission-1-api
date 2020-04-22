import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty() id: string;
  @IsNotEmpty() @IsEmail() email: string;
  @IsNotEmpty()  firstName: string;
  @IsNotEmpty()  lastName: string;
  @IsNotEmpty()  birthDate: string;
  @IsNotEmpty()  siret: string;
}
