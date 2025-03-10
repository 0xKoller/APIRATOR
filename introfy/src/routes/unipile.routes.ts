import express, { Request, Response } from "express";
import { getUnipileProvider } from "../services/unipileProviderService";
import { MessagingError } from "../types/errors";

const router = express.Router();

// Get all connected accounts
router.get("/accounts", async (req: Request, res: Response) => {
  try {
    const unipileProvider = await getUnipileProvider();
    const accounts = await unipileProvider.getConnectedAccounts();
    return res.json({ items: accounts });
  } catch (error) {
    console.error("Error obteniendo cuentas:", error);
    return res.status(500).json({
      error: "Error al obtener cuentas conectadas",
    });
  }
});

// Connect a new account
router.post("/accounts", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username y password son requeridos",
      });
    }

    const unipileProvider = await getUnipileProvider();
    const result = await unipileProvider.connectAccount({ username, password });
    return res.json(result);
  } catch (error) {
    console.error("Error conectando cuenta:", error);
    return res.status(500).json({
      error: "Error al conectar cuenta",
    });
  }
});

// Handle authentication checkpoint
router.post("/checkpoint", async (req: Request, res: Response) => {
  try {
    const { accountId, code } = req.body;

    if (!accountId || !code) {
      return res.status(400).json({
        error: "AccountId y code son requeridos",
      });
    }

    const unipileProvider = await getUnipileProvider();
    const result = await unipileProvider.handleCheckpoint(accountId, code);
    return res.json(result);
  } catch (error) {
    console.error("Error manejando checkpoint:", error);
    return res.status(500).json({
      error: "Error al manejar checkpoint",
    });
  }
});

// Send a message
router.post("/message", async (req: Request, res: Response) => {
  try {
    const { recipientId, message, accountId } = req.body;

    if (!recipientId || !message || !accountId) {
      return res.status(400).json({
        error: "recipientId, message y accountId son requeridos",
      });
    }

    const unipileProvider = await getUnipileProvider();
    const result = await unipileProvider.sendMessage({
      accountId,
      recipientId,
      message,
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error enviando mensaje:", error);

    if (error instanceof MessagingError) {
      return res.status(error.retryable ? 500 : 400).json({
        success: false,
        error: error.message,
        details: error.details,
      });
    }

    return res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

router.post("/auth-url", async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const unipileProvider = await getUnipileProvider();
    console.log(unipileProvider, "Unipile provider");
    const url = await unipileProvider.generateHostedAuthLink(userId);
    res.json({ url });
  } catch (error) {
    console.error(error, "Error generando URL de autenticación de Unipile");
    res.status(500).json({
      error: "Error al generar URL de autenticación",
    });
  }
});

router.post("/callback", async (req: Request, res: Response) => {
  try {
    console.log(req.body, "Callback de autenticación de Unipile recibido");
    res.status(200).send("OK");
  } catch (error) {
    console.error(error, "Error procesando callback de Unipile");
    res.status(500).json({
      error: "Error al procesar callback",
    });
  }
});

// Generate authentication link
router.post("/auth-link", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "UserId es requerido",
      });
    }

    const unipileProvider = await getUnipileProvider();
    const url = await unipileProvider.generateHostedAuthLink(userId);

    return res.json({
      success: true,
      url,
    });
  } catch (error) {
    console.error("Error generando enlace de autenticación:", error);
    return res.status(500).json({
      success: false,
      error: "Error al generar enlace de autenticación",
    });
  }
});

/**
 * @route POST /api/unipile/linkedin/search
 * @desc Search LinkedIn profiles using a LinkedIn search URL
 * @access Public
 */
router.post("/linkedin/search", async (req: Request, res: Response) => {
  try {
    const { accountId, url } = req.body;

    if (!accountId || !url) {
      return res.status(400).json({
        success: false,
        message: "Account ID and LinkedIn search URL are required",
      });
    }

    const unipileProvider = await getUnipileProvider();
    const searchResults = await unipileProvider.searchLinkedInProfiles(
      accountId,
      url
    );

    return res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.error("Error searching LinkedIn profiles:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
});

export default router;
