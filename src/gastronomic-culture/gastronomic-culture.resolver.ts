import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GastronomicCultureService } from './gastronomic-culture.service';
import { GastronomicCultureEntity } from './gastronomic-culture.entity';
import { plainToInstance } from 'class-transformer';
import { GastronomicCultureDto } from './gastronomic-culture.dto';

@Resolver()
export class GastronomicCultureResolver {
  constructor(private gastronomicCultureService: GastronomicCultureService) {}

  @Query(() => [GastronomicCultureEntity])
  cultures(): Promise<GastronomicCultureEntity[]> {
    return this.gastronomicCultureService.findAll();
  }

  @Query(() => GastronomicCultureEntity)
  culture(@Args('id') id: string): Promise<GastronomicCultureEntity> {
    const cultures = this.gastronomicCultureService.findOne(id);
    return cultures;
  }

  @Mutation(() => GastronomicCultureEntity)
  createCulture(
    @Args('culture') cultureDto: GastronomicCultureDto,
  ): Promise<GastronomicCultureEntity> {
    const culture = plainToInstance(GastronomicCultureEntity, cultureDto);
    return this.gastronomicCultureService.create(culture);
  }

  @Mutation(() => GastronomicCultureEntity)
  updateCulture(
    @Args('id') id: string,
    @Args('culture') cultureDto: GastronomicCultureDto,
  ): Promise<GastronomicCultureEntity> {
    const culture = plainToInstance(GastronomicCultureEntity, cultureDto);
    return this.gastronomicCultureService.update(id, culture);
  }

  @Mutation(() => String)
  deleteCulture(@Args('id') id: string) {
    this.gastronomicCultureService.delete(id);
    return id;
  }
}
