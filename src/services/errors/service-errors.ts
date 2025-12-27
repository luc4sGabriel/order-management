// fiz essa classe pra padronizar os erros do service que sao mais especificos ... 404, 403 etc ..

export class ServiceError extends Error {
  constructor(
    public message: string,
    public statusCode = 400
  ) {
    super(message);
  }
}