import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ParcelsModule } from './modules/parcels/parcels.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { VerificationsModule } from './modules/verifications/verifications.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // Load Environment Variables
    ConfigModule.forRoot({
      isGlobal: true, // Available everywhere
    }),
    //  Database Connection (Postgres)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // TRUE for Dev, FALSE for Production
        ssl: {
          rejectUnauthorized: false, // Required for Supabase connection
        },
      }),
    }),
    // Cron Jobs
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    ParcelsModule,
    PaymentsModule,
    VerificationsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
