"use client";
import axios from "axios";
import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type {
  UnipileAccount,
  UnipileAccountCreated,
  UnipileAuthContextType,
  UnipileAuthState,
  UnipileCheckpoint,
} from "@/types/unipile";
import { useLinkedinProfileStore } from "@/store/linkedin-profile-store";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const UnipileAuthContext = createContext<UnipileAuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  error: null,
  accountId: null,
  findMatchingAccount: async () => {},
  generateAuthUrl: async () => "",
  connectAccount: async () => {},
  handleCheckpoint: async () => {},
  logout: () => {},
});

export const UnipileAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<UnipileAuthState>({
    isAuthenticated: false,
    isLoading: false,
    accountId: undefined,
    linkedinId: undefined,
  });

  const { linkedinId, setUnipileAccountId, setLinkedinId, setIsAuthenticated } =
    useLinkedinProfileStore();

  console.log("state unipile auth", state);

  const [checkpointData, setCheckpointData] =
    useState<UnipileCheckpoint | null>(null);
  const [lastCheckedId, setLastCheckedId] = useState<string | null>(null);

  const findMatchingAccount = useCallback(
    async (explicitLinkedinId?: string): Promise<void> => {
      const idToCheck = explicitLinkedinId || linkedinId;

      if (!idToCheck) {
        console.log("No LinkedIn ID available to check for matching accounts");
        return;
      }

      if (lastCheckedId === idToCheck) {
        return;
      }

      try {
        setState((prev) => ({ ...prev, isLoading: true, error: undefined }));
        const response = await axios.get<{ items: UnipileAccount[] }>(
          "/api/unipile/accounts"
        );
        setLastCheckedId(idToCheck);
        const accounts = response.data.items;
        const matchingAccount = accounts.find(
          (account) => account.connection_params?.im?.id === idToCheck
        );

        if (matchingAccount) {
          setState((prev) => ({
            ...prev,
            accountId: matchingAccount.id,
            linkedinId: idToCheck,
            isAuthenticated: true,
            isLoading: false,
            error: undefined,
          }));

          // Update the Zustand store
          setUnipileAccountId(matchingAccount.id);
          setLinkedinId(idToCheck);
          setIsAuthenticated(true);

          return;
        }

        setState((prev) => ({
          ...prev,
          isLoading: false,
          accountId: undefined,
          linkedinId: undefined,
          isAuthenticated: false,
          error: "No se encontró una cuenta de LinkedIn conectada",
        }));

        // Update the Zustand store
        setUnipileAccountId(null);
        setIsAuthenticated(false);
      } catch (err) {
        console.error("Error finding matching account:", err);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          accountId: undefined,
          linkedinId: undefined,
          isAuthenticated: false,
          error: "Error al buscar cuenta conectada",
        }));

        // Update the Zustand store
        setUnipileAccountId(null);
        setIsAuthenticated(false);
      }
    },
    [
      linkedinId,
      lastCheckedId,
      setUnipileAccountId,
      setLinkedinId,
      setIsAuthenticated,
    ]
  );

  // Effect to automatically check for matching account when linkedinId changes
  useEffect(() => {
    if (linkedinId && linkedinId !== lastCheckedId) {
      findMatchingAccount();
    }
  }, [linkedinId, lastCheckedId, findMatchingAccount]);

  const connectAccount = async (credentials: {
    username: string;
    password: string;
  }) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: undefined }));
      const response = await axios.post<
        UnipileAccount | UnipileCheckpoint | UnipileAccountCreated
      >("/api/messaging/connect", credentials);

      if ("object" in response.data) {
        if (response.data.object === "Checkpoint") {
          setCheckpointData(response.data as UnipileCheckpoint);
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: "Se requiere verificación adicional",
          }));
          return;
        }
        if (response.data.object === "AccountCreated") {
          const accountCreated = response.data as UnipileAccountCreated;
          await findMatchingAccount(accountCreated.account_id);
          return;
        }
      }

      const account = response.data as UnipileAccount;
      if (account.connection_params?.im?.id) {
        await findMatchingAccount(account.connection_params.im.id);
      }
    } catch (err) {
      console.error("Error connecting account:", err);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        accountId: undefined,
        linkedinId: undefined,
        isAuthenticated: false,
        error: "Error al conectar cuenta de LinkedIn",
      }));
    }
  };

  const handleCheckpoint = async (code: string) => {
    if (!checkpointData) {
      setState((prev) => ({
        ...prev,
        error: "No hay un checkpoint pendiente",
      }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: undefined }));
      const response = await axios.post<
        UnipileAccount | UnipileCheckpoint | UnipileAccountCreated
      >("/api/messaging/checkpoint", {
        accountId: checkpointData.account_id,
        code,
      });

      if ("object" in response.data) {
        if (response.data.object === "Checkpoint") {
          setCheckpointData(response.data as UnipileCheckpoint);
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: "Se requiere verificación adicional",
          }));
          return;
        }
        if (response.data.object === "AccountCreated") {
          const accountCreated = response.data as UnipileAccountCreated;
          await findMatchingAccount(accountCreated.account_id);
          setCheckpointData(null);
          return;
        }
      }

      const account = response.data as UnipileAccount;
      if (account.connection_params?.im?.id) {
        await findMatchingAccount(account.connection_params.im.id);
      }
      setCheckpointData(null);
    } catch (err) {
      console.error("Error handling checkpoint:", err);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Error al verificar el código",
      }));
    }
  };

  const logout = () => {
    setState({
      isAuthenticated: false,
      isLoading: false,
      accountId: undefined,
      linkedinId: undefined,
    });
    setCheckpointData(null);
    setLastCheckedId(null);

    // Update the Zustand store
    setUnipileAccountId(null);
    setLinkedinId(null);
    setIsAuthenticated(false);
  };

  const generateAuthUrl = async (): Promise<string> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: undefined }));
      const response = await axios.post<{ url: string }>(
        "/api/unipile/auth-url",
        {
          userId: state.accountId || linkedinId || "new-user",
        }
      );
      setState((prev) => ({ ...prev, isLoading: false }));
      return response.data.url;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Error al generar el enlace de autenticación",
      }));
      throw error;
    }
  };

  return (
    <UnipileAuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error || null,
        accountId: state.accountId || null,
        findMatchingAccount,
        connectAccount,
        handleCheckpoint,
        logout,
        generateAuthUrl,
      }}
    >
      {children}
    </UnipileAuthContext.Provider>
  );
};

export const useUnipileAuth = () => {
  const context = useContext(UnipileAuthContext);
  if (context === undefined) {
    throw new Error(
      "useUnipileAuth debe ser usado dentro de un UnipileAuthProvider"
    );
  }
  return context;
};
