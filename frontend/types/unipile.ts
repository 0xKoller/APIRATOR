export interface UnipileAccount {
  current_signature?: string;
  signatures?: { title: string; content: string }[];
  last_fetched_at?: number;
  object: "Account";
  type: string;
  id: string;
  name: string;
  created_at: number;
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

export interface UnipileAccountCreated {
  object: "AccountCreated";
  account_id: string;
}

export interface UnipileCheckpoint {
  object: "Checkpoint";
  account_id: string;
  checkpoint: {
    type: "2FA" | "OTP" | "IN_APP_VALIDATION" | "CAPTCHA" | "PHONE_REGISTER";
  };
}

export interface UnipileAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
  accountId?: string;
  linkedinId?: string;
}

export interface UnipileAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accountId: string | null;
  findMatchingAccount: (profileId: string) => Promise<void>;
  generateAuthUrl: () => Promise<string>;
  connectAccount: (credentials: {
    username: string;
    password: string;
  }) => Promise<void>;
  handleCheckpoint: (code: string) => Promise<void>;
  logout: () => void;
}

export interface UnipileHostedAuthURL {
  object: "HostedAuthURL";
  url: string;
}

export interface UnipileCallback {
  object: "AccountCreated" | "AccountReconnected";
  account_id: string;
  name?: string;
  type?: string;
}
