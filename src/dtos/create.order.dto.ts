// precisei fazer esse DTO pra tipar certo o codigo ._. .. tava dando mt problema de tipagem , e ainda 
// deu nos testes alguns mas ai usei mock e any msm , so simulando o objeto

export interface CreateOrderServiceDTO {
  name: string;
  value: number;
}

export interface CreateOrderDTO {
  lab: string;
  patient: string;
  customer: string;
  services: CreateOrderServiceDTO[];
}