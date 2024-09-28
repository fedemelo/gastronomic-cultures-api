import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RestaurantDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @Field()
  @IsInt()
  @IsNotEmpty()
  readonly michelinStars: number;

  @Field()
  @IsDateString()
  readonly awardDate: string;
}
