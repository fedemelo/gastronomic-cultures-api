import { IsNotEmpty, IsString } from 'class-validator';

export class GastronomicCultureDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
