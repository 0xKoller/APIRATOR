export class MessagingError extends Error {
  constructor(
    message: string,
    public details: string,
    public retryable: boolean
  ) {
    super(message);
    this.name = "MessagingError";
  }
}

export const ERROR_CODES = {
  RATE_LIMIT: "RATE_LIMIT",
  INVALID_RECIPIENT: "INVALID_RECIPIENT",
  NETWORK_ERROR: "NETWORK_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.RATE_LIMIT]: "Has excedido el límite de mensajes por minuto",
  [ERROR_CODES.INVALID_RECIPIENT]: "El destinatario no es válido",
  [ERROR_CODES.NETWORK_ERROR]: "Error de conexión",
  [ERROR_CODES.UNAUTHORIZED]: "No tienes permiso para enviar mensajes",
} as const;
