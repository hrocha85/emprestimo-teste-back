import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './loan.entity';
import { Person } from '../person/person.entity';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,

    @InjectRepository(Person)
    private personRepository: Repository<Person>,
  ) {}

  async createLoan(personId: string, amount: number, numberOfInstallments: number): Promise<Loan> {
    const person = await this.personRepository.findOne({ where: { id: personId }, relations: ['loans'] });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    // Validations
    if (amount < person.minLoanAmount) {
      throw new BadRequestException(`Loan amount is less than the minimum allowed: ${person.minLoanAmount}`);
    }
    
    if (amount > person.maxLoanAmount) {
      throw new BadRequestException(`Loan amount exceeds the maximum allowed: ${person.maxLoanAmount}`);
    }

    const loan = new Loan();
    loan.person = person;
    loan.amount = amount;
    loan.numberOfInstallments = numberOfInstallments;

    if (loan.numberOfInstallments > 24) {
      throw new BadRequestException('The number of installments cannot exceed: 24');
    }

    return this.loanRepository.save(loan);
  }

  async payLoan(loanId: string): Promise<Loan> {
    const loan = await this.loanRepository.findOne({ where: { id: loanId } });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    loan.status = 'paid';

    return this.loanRepository.save(loan);
  }

  findAll(): Promise<Loan[]> {
    return this.loanRepository.find({ relations: ['person'] });
  }
}