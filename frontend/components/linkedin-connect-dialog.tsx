import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUnipileAuth } from "@/client/src/contexts/unipile-auth.context";
import { useCallback, useEffect, useState } from "react";

interface LinkedInConnectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LinkedInConnectDialog = ({
  isOpen,
  onClose,
}: LinkedInConnectDialogProps) => {
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const { error, isLoading, generateAuthUrl } = useUnipileAuth();

  const fetchAuthUrl = useCallback(async () => {
    try {
      const url = await generateAuthUrl();
      setAuthUrl(url);
    } catch (error) {
      console.error("Error generando URL:", error);
      setAuthUrl(null);
    }
  }, [generateAuthUrl]);

  useEffect(() => {
    console.log("isOpen", isOpen, "authUrl", authUrl);
    if (isOpen && !authUrl) {
      console.log("fetching auth url");
      fetchAuthUrl();
    }

    return () => {
      if (!isOpen) {
        setAuthUrl(null);
      }
    };
  }, [isOpen]);

  const handleConnect = () => {
    if (authUrl) {
      window.open(authUrl, "_blank", "width=600,height=600");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Conectar LinkedIn</DialogTitle>
          <DialogDescription>
            {error ? (
              <span className="text-red-500">{error}</span>
            ) : (
              "Haz clic en el botón para conectar tu cuenta de LinkedIn de forma segura."
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConnect} disabled={isLoading || !authUrl}>
            {isLoading ? "Cargando..." : "Conectar con LinkedIn"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
