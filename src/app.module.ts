import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import devConfig from './config/dev.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CompanyModule } from './modules/company/company.module';


@Module({
  imports: [
    ConfigModule.forRoot({ load: [devConfig], isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('db').url,
      }),
    }),
    AuthModule,
    UserModule,
    CompanyModule,
    ScheduleModule.forRoot(),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}