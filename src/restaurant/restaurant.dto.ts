/* eslint-disable prettier/prettier */
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RestaurantDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly michelinStars: number;

  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @IsDate()
  @IsNotEmpty()
  readonly awardDate: Date;
}
