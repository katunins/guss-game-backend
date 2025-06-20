import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { optionsDataSource } from './options.data-source';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RoundsModule } from './rounds/rounds.module';
import { Gateway } from './rounds/socket/gateway';
import { TapsService } from './taps/taps.service';
import { TapsModule } from './taps/taps.module';
1;
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (): Promise<TypeOrmModuleOptions> => {
        return optionsDataSource;
      },
    }),
    UsersModule,
    AuthModule,
    RoundsModule,
    TapsModule,
  ],
  controllers: [AppController],
  providers: [AppService, Gateway],
})
export class AppModule {}
