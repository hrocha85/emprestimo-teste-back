import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './person.entity';
import { validateCNPJ, validateCPF } from 'src/utils/validators';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  findAll(): Promise<Person[]> {
    return this.personRepository.find();
  }

  findOne(id: string): Promise<Person> {
    return this.personRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.personRepository.delete(id);
  }

  async create(personData: Partial<Person>): Promise<Person> {
    if (!personData.identifier) {
      throw new BadRequestException('Identifier is required');
    }

    // Validação do CPF/CNPJ
    if (personData.identifier.length === 11 && !validateCPF(personData.identifier)) {
      throw new BadRequestException('Invalid CPF');
    } 
    
    if (personData.identifier.length === 14 && !validateCNPJ(personData.identifier)) {
      throw new BadRequestException('Invalid CNPJ');
    }

    // Verificação de identificador existente
    const existingPerson = await this.personRepository.findOneBy({ identifier: personData.identifier });
    if (existingPerson) {
      throw new BadRequestException('Identifier already exists');
    }

    // Validação de idade
    if (personData.birthDate) {
      const birthDate = new Date(personData.birthDate);
      const age = this.calculateAge(birthDate);

      if (age < 18) {
        throw new BadRequestException('Person must be at least 18 years old');
      }
    } else {
      throw new BadRequestException('BirthDate is required');
    }

    let identifierType: string;
    let minLoanAmount: number;
    let maxLoanAmount: number;

    if (personData.identifier.length === 11) {
      identifierType = 'PF';
      minLoanAmount = 30000;
      maxLoanAmount = 1000000;
    } else if (personData.identifier.length === 14) {
      identifierType = 'PJ';
      minLoanAmount = 100000;
      maxLoanAmount = 10000000;
    } else if (personData.identifier.length === 8 && (Number(personData.identifier[0]) + Number(personData.identifier[personData.identifier.length - 1])) === 9) {
      identifierType = 'EU';
      minLoanAmount = 10000;
      maxLoanAmount = 1000000;
    } else if (personData.identifier.length === 10 && personData.identifier[personData.identifier.length - 1] === '9') {
      identifierType = 'AP';
      minLoanAmount = 40000;
      maxLoanAmount = 2500000;
    } else {
      throw new BadRequestException('Invalid identifier');
    }

    const person = this.personRepository.create({
      ...personData,
      identifierType,
      minLoanAmount,
      maxLoanAmount
    });

    return this.personRepository.save(person);
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
