/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class RecipeDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsUrl()
    @IsNotEmpty()
    readonly photo: string;

    @IsString()
    @IsNotEmpty()
    readonly preparationProcess: string;

    @IsUrl()
    @IsNotEmpty()
    readonly video: string;
}
