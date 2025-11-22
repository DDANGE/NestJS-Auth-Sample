import { IsEmail, IsString } from 'class-validator';

//create api
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  username: string;
}

//update api
export class UpdateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
