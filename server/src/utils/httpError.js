export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const notFound = (message = 'Не найдено') => new HttpError(404, message);
export const badRequest = (message = 'Некорректные данные') =>
  new HttpError(400, message);
export const unauthorized = (message = 'Необходима авторизация') =>
  new HttpError(401, message);
export const forbidden = (message = 'Недостаточно прав') =>
  new HttpError(403, message);

