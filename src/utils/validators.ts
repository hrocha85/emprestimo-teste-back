import { cpf as cpfValidator, cnpj as cnpjValidator } from 'cpf-cnpj-validator';

export function validateCPF(cpf: string): boolean {
  return cpfValidator.isValid(cpf);
}

export function validateCNPJ(cnpj: string): boolean {
  return cnpjValidator.isValid(cnpj);
}
