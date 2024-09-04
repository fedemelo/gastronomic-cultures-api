import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class RestaurantDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @IsInt()
  @IsNotEmpty()
  readonly michelinStars;

  @IsDateString()
  readonly awardDate: Date;
}
