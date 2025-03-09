import type { UnipileClient } from "unipile-node-sdk";
import { MessagingError } from "../types/errors";

export interface SendMessageParams {
  accountId: string;
  recipientId: string;
  message: string;
  userId: string;
  organizationId: string;
}

export interface MessageResult {
  success: boolean;
  recipientId: string;
  messageId?: string;
  error?: string;
}

export interface UnipileConnection {
  profile_picture_url?: string | undefined;
  object: "UserRelation";
  created_at: number;
  public_identifier: string;
  headline: string;
  first_name: string;
  last_name: string;
  public_profile_url: string;
  member_urn: string;
  member_id: string;
  connection_urn: string;
}

export interface MessagingProvider {
  getConnectedAccounts(): Promise<UnipileAccount[]>;
  connectAccount(credentials: {
    username: string;
    password: string;
  }): Promise<
    | UnipileAccount
    | UnipileCheckpoint
    | UnipileAccountCreated
    | UnipileAccountReconnected
  >;
  handleCheckpoint(
    accountId: string,
    code: string
  ): Promise<
    | UnipileAccount
    | UnipileCheckpoint
    | UnipileAccountCreated
    | UnipileAccountReconnected
  >;
  sendMessage(params: SendMessageParams): Promise<MessageResult>;
  generateHostedAuthLink(userId: string): Promise<string>;
}

type UTCDateTimeMs = number;

type UnipileResponse = {
  object:
    | "Account"
    | "Checkpoint"
    | "AccountCreated"
    | "AccountReconnected"
    | "ChatStarted"
    | "HostedAuthUrl";
  account_id?: string;
  chat_id?: string;
  url?: string;
  connection_params?: {
    im?: {
      id: string;
      username: string;
      organizations: Array<{
        name: string;
        messaging_enabled: boolean;
        mailbox_urn: string;
        organization_urn: string;
      }>;
    };
  };
  checkpoint?: {
    type: "2FA" | "OTP" | "IN_APP_VALIDATION" | "CAPTCHA" | "PHONE_REGISTER";
  };
};

interface UnipileAccount {
  current_signature?: string;
  signatures?: { title: string; content: string }[];
  last_fetched_at?: UTCDateTimeMs;
  object: "Account";
  type: string;
  id: string;
  name: string;
  created_at: UTCDateTimeMs;
  groups: string[];
  sources: { type: string }[];
  connection_params: {
    im?: {
      id: string;
      username: string;
      organizations: Array<{
        name: string;
        messaging_enabled: boolean;
        mailbox_urn: string;
        organization_urn: string;
      }>;
    };
  };
  status?: string;
}

interface UnipileAccountCreated {
  object: "AccountCreated";
  account_id: string;
}

interface UnipileCheckpoint {
  object: "Checkpoint";
  account_id: string;
  checkpoint: {
    type: "2FA" | "OTP" | "IN_APP_VALIDATION" | "CAPTCHA" | "PHONE_REGISTER";
  };
}

interface UnipileAccountReconnected {
  object: "AccountReconnected";
  account_id: string;
}

interface UnipileChatStarted {
  object: "ChatStarted";
  chat_id: string;
}

interface UnipileHostedAuthURL {
  object: "HostedAuthUrl";
  url: string;
}

export class UnipileProvider implements MessagingProvider {
  private client: UnipileClient | null = null;
  private initialized = false;

  /**
   * Creates and initializes a new UnipileProvider instance
   * @returns An initialized UnipileProvider
   */
  public static async create(): Promise<UnipileProvider> {
    const provider = new UnipileProvider();
    await provider.initialize();
    return provider;
  }

  /**
   * Initializes the UnipileProvider
   * Must be called before using any other methods
   */
  public async initialize(): Promise<void> {
    if (!this.initialized) {
      await this.initializeClient();
      this.initialized = true;
    }
  }

  private async initializeClient() {
    try {
      console.log(
        "[UnipileProvider] Iniciando cliente Unipile",
        "UnipileProvider.initializeClient",
        { baseUrl: process.env.UNIPILE_BASE_URL }
      );
      const UnipileModule = await import("unipile-node-sdk");
      const { UnipileClient } = UnipileModule;
      const baseUrl = process.env.UNIPILE_BASE_URL || "https://api.unipile.com";
      const apiKey = process.env.UNIPILE_API_KEY || "";
      console.log(
        "[UnipileProvider] Configuración cargada",
        "UnipileProvider.initializeClient",
        { baseUrl }
      );
      this.client = new UnipileClient(baseUrl, apiKey);
      console.log(
        "[UnipileProvider] Cliente inicializado correctamente",
        "UnipileProvider.initializeClient"
      );
    } catch (err: unknown) {
      console.error(
        { err },
        "[UnipileProvider] Error inicializando cliente Unipile",
        "UnipileProvider.initializeClient"
      );
      throw new Error("Error al inicializar cliente Unipile");
    }
  }

  private async ensureClient() {
    if (!this.initialized) {
      await this.initialize();
    }
    if (!this.client) {
      throw new Error("No se pudo inicializar el cliente Unipile");
    }
    return this.client;
  }

  async getConnectedAccounts(): Promise<UnipileAccount[]> {
    try {
      const client = await this.ensureClient();
      console.log("[UnipileProvider] Obteniendo cuentas conectadas...");
      const response = await client.account.getAll();
      console.log(
        response.items.length,
        "[UnipileProvider] Cuentas encontradas"
      );
      return response.items as unknown as UnipileAccount[];
    } catch (error) {
      console.error(
        error,
        "[UnipileProvider] Error obteniendo cuentas conectadas"
      );
      throw new Error("Error al obtener cuentas conectadas de Unipile");
    }
  }

  async connectAccount(credentials: {
    username: string;
    password: string;
  }): Promise<
    | UnipileAccount
    | UnipileCheckpoint
    | UnipileAccountCreated
    | UnipileAccountReconnected
  > {
    try {
      const client = await this.ensureClient();
      console.log(
        credentials.username,
        "[UnipileProvider] Intentando conectar cuenta de LinkedIn"
      );
      const response = (await client.account.connectLinkedin({
        username: credentials.username,
        password: credentials.password,
      })) as UnipileResponse;

      if (response.object === "Checkpoint") {
        console.log(
          JSON.stringify(response, null, 2),
          "[UnipileProvider] Se requiere verificación adicional"
        );
        return response as UnipileCheckpoint;
      }
      if (response.object === "AccountCreated") {
        console.log(
          response.account_id,
          "[UnipileProvider] Cuenta creada exitosamente"
        );
        return response as UnipileAccountCreated;
      }
      if (response.object === "AccountReconnected") {
        console.log(
          response.account_id,
          "[UnipileProvider] Cuenta reconectada exitosamente"
        );
        return response as UnipileAccountReconnected;
      }

      console.log("[UnipileProvider] Cuenta conectada exitosamente");
      return response as unknown as UnipileAccount;
    } catch (error) {
      console.error(error, "[UnipileProvider] Error conectando cuenta");
      throw new Error("Error al conectar cuenta en Unipile");
    }
  }

  async handleCheckpoint(
    accountId: string,
    code: string
  ): Promise<
    | UnipileAccount
    | UnipileCheckpoint
    | UnipileAccountCreated
    | UnipileAccountReconnected
  > {
    try {
      const client = await this.ensureClient();
      console.log(
        accountId,
        "[UnipileProvider] Manejando checkpoint para cuenta"
      );
      const response = (await client.account.solveCodeCheckpoint({
        provider: "LINKEDIN",
        account_id: accountId,
        code,
      })) as UnipileResponse;

      if (response.object === "Checkpoint") {
        console.log("[UnipileProvider] Se requiere verificación adicional");
        return response as UnipileCheckpoint;
      }
      if (response.object === "AccountCreated") {
        console.log(
          response.account_id,
          "[UnipileProvider] Cuenta creada exitosamente"
        );
        return response as UnipileAccountCreated;
      }
      if (response.object === "AccountReconnected") {
        console.log(
          response.account_id,
          "[UnipileProvider] Cuenta reconectada exitosamente"
        );
        return response as UnipileAccountReconnected;
      }

      console.log("[UnipileProvider] Verificación exitosa");
      return response as unknown as UnipileAccount;
    } catch (error) {
      console.error(error, "[UnipileProvider] Error manejando checkpoint");
      throw new Error("Error al manejar checkpoint en Unipile");
    }
  }

  async sendMessage(params: SendMessageParams): Promise<MessageResult> {
    try {
      const client = await this.ensureClient();
      console.log(params.recipientId, "[UnipileProvider] Enviando mensaje");

      // Use a simpler structure that only includes the required parameters
      const response = (await client.messaging.startNewChat({
        account_id: params.accountId,
        attendees_ids: [params.recipientId],
        text: params.message,
        options: {
          linkedin: {
            inmail: true,
          },
        },
      })) as UnipileChatStarted;

      console.log(
        response.chat_id,
        "[UnipileProvider] Mensaje enviado exitosamente"
      );
      return {
        success: true,
        recipientId: params.recipientId,
        messageId: response.chat_id,
      };
    } catch (error) {
      console.error(error, "[UnipileProvider] Error enviando mensaje");
      throw new MessagingError(
        "Error al enviar mensaje",
        error instanceof Error ? error.message : "Error desconocido",
        true
      );
    }
  }

  async generateHostedAuthLink(userId: string): Promise<string> {
    try {
      const client = await this.ensureClient();
      console.log(
        userId,
        "[UnipileProvider] Generando enlace de autenticación"
      );

      const expiresOn = new Date();
      expiresOn.setHours(expiresOn.getHours() + 1); // Link expires in 1 hour

      const response = (await client.account.createHostedAuthLink({
        type: "create",
        providers: ["LINKEDIN"],
        api_url: process.env.UNIPILE_BASE_URL || "https://api.unipile.com",
        expiresOn: expiresOn.toISOString(),
        name: userId,
        notify_url: `${process.env.SERVER_PUBLIC_URL}/api/unipile/callback`,
        success_redirect_url: `${process.env.CLIENT_URL}`,
        failure_redirect_url: `${process.env.CLIENT_URL}`,
      })) as UnipileHostedAuthURL;

      console.log(
        response.url,
        "[UnipileProvider] Enlace de autenticación generado"
      );
      return response.url;
    } catch (error) {
      console.error(
        error,
        "[UnipileProvider] Error generando enlace de autenticación"
      );
      throw new Error("Error al generar enlace de autenticación en Unipile");
    }
  }

  async getConnections(accountId: string): Promise<UnipileConnection[]> {
    try {
      const client = await this.ensureClient();
      console.log(accountId, "[UnipileProvider] Obteniendo conexiones");
      const response = await client.users.getAllRelations({
        account_id: accountId,
        limit: 100,
      });
      return response.items;
    } catch (error) {
      console.error(error, "[UnipileProvider] Error obteniendo conexiones");
      throw new Error("Error al obtener conexiones en Unipile");
    }
  }
}

// Create a singleton instance - note that this returns a Promise<UnipileProvider>
export const unipileProviderPromise = UnipileProvider.create();

// Helper function to ensure we always have an initialized provider
export async function getUnipileProvider(): Promise<UnipileProvider> {
  return await unipileProviderPromise;
}
