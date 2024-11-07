// pages/api/download.ts

import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { fileName } = req.query;

    if (!fileName || typeof fileName !== "string") {
      return res.status(400).json({ error: "Nome do arquivo não fornecido" });
    }

    try {
      // Defina o caminho para o diretório onde os arquivos estão armazenados
      const filePath = path.join(process.cwd(), "uploads", fileName);
      
      // Verifique se o arquivo existe
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
      }

      // Envia o arquivo como um anexo
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.setHeader("Content-Type", "application/octet-stream");
      fs.createReadStream(filePath).pipe(res);
    } catch (error) {
      console.error("Erro ao baixar o arquivo:", error);
      res.status(500).json({ error: "Erro ao processar o download do arquivo" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
