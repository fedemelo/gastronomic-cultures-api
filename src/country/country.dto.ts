/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
export class CountryDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
