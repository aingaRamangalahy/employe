import { IsNotEmpty } from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly password: string;
}
