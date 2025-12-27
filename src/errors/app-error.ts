// fiz essa classe pra padronizar os erros da aplicacao 500, 400 etc .. , e pra ajudar a capturar os erros certos no teste

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode = 400
  ) {
    super(message);
  }
}