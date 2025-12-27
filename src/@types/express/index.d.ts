// fiz pra anexar o tipo do user no request , facilita que é uma beleza pra tudo

declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}