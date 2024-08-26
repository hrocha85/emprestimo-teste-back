import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Loan } from '../loan/loan.entity';

@Entity({ name: 'persons' })
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'identifier', nullable: false, unique: true })
  identifier: string;

  @Column({ name: 'birthDate', nullable: false })
  birthDate: Date;

  @Column({ name: 'identifierType', nullable: true })
  identifierType: string;

  @Column({ name: 'minLoanAmount', nullable: true })
  minLoanAmount: number;

  @Column({ name: 'maxLoanAmount', nullable: true })
  maxLoanAmount: number;

  @OneToMany(() => Loan, (loan) => loan.person)
  loans: Loan[];
}
