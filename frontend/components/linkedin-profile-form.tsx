import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLinkedinProfileStore } from "@/store/linkedin-profile-store";
import { useUnipileAuth } from "@/client/src/contexts/unipile-auth.context";
import axios from "axios";

export function LinkedInProfileForm() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setLinkedinUrl, setLinkedinId } = useLinkedinProfileStore();

  const { findMatchingAccount } = useUnipileAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError("Por favor ingresa tu URL de LinkedIn");
      return;
    }

    try {
      setIsLoading(true);
      // Save the URL in the store
      setLinkedinUrl(url);

      // Fetch the LinkedIn ID from the URL
      const response = await axios.get("/api/linkedin/profile", {
        params: {
          url,
        },
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Error al obtener el ID de LinkedIn"
        );
      }
      const linkedinId = response.data.data.urn;

      if (!linkedinId) {
        throw new Error("No se pudo obtener el ID de LinkedIn");
      }

      // Save the LinkedIn ID in the store
      setLinkedinId(linkedinId);

      // Check if the user already has a Unipile account
      await findMatchingAccount(linkedinId);
    } catch (err) {
      console.error("Error fetching LinkedIn profile:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error al obtener tu perfil de LinkedIn"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="linkedin-url">Tu URL de LinkedIn</Label>
        <Input
          id="linkedin-url"
          placeholder="https://www.linkedin.com/in/tu-perfil"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Verificando..." : "Verificar perfil"}
      </Button>
    </form>
  );
}
