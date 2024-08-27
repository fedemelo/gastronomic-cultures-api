import { Module } from '@nestjs/common';
import { GastronomicCultureService } from './gastronomic-culture.service';
import { GastronomicCultureEntity } from './gastronomic-culture.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GastronomicCultureEntity])],
  providers: [GastronomicCultureService],
})
export class GastronomicCultureModule {}
