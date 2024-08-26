import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { LoanService } from './loan.service';
import { Loan } from './loan.entity';

@Controller('loans')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  createLoan(@Body('personId') personId: string, @Body('amount') amount: number, @Body('numberOfInstallments') numberOfInstallments: number): Promise<Loan> {
    return this.loanService.createLoan(personId, amount, numberOfInstallments);
  }

  @Post(':id/pay')
  payLoan(@Param('id') id: string): Promise<Loan> {
    return this.loanService.payLoan(id);
  }

  @Get()
  findAll(): Promise<Loan[]> {
    return this.loanService.findAll();
  }
}
