import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Person } from './person/person.entity';
import { Loan } from './loan/loan.entity';
import { PersonService } from './person/person.service';
import { PersonController } from './person/person.controller';
import { LoanService } from './loan/loan.service';
import { LoanController } from './loan/loan.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Person, Loan],
      synchronize: true,
      ssl: {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true',
      },
    }),
    TypeOrmModule.forFeature([Person, Loan]),
  ],
  controllers: [PersonController, LoanController],
  providers: [PersonService, LoanService],
})
export class AppModule {}
