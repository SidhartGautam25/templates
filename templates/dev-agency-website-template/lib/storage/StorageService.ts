import path from "path";
import { Readable } from "stream";
import * as ftp from "basic-ftp";

export interface UploadResult {
  url: string;
  logs: string[];
}

export interface IStorageService {
  uploadFile(file: File, folder?: string): Promise<UploadResult>;
  deleteFile(filePath: string): Promise<void>;
}

// Helper to navigate FTP directories with dynamic fallback for "public_html" prefix
async function cdFtpDir(client: ftp.Client, remotePath: string) {
  const segments = remotePath.split("/").filter(Boolean);
  for (const segment of segments) {
    if (segment === "public_html") {
      const list = await client.list();
      const hasPublicHtml = list.some(item => item.name === "public_html" && item.isDirectory);
      if (!hasPublicHtml) {
        continue;
      }
    }
    await client.cd(segment);
  }
}

// Helper to ensure and navigate FTP directories with dynamic fallback for "public_html" prefix and collect logs
async function ensureFtpDir(client: ftp.Client, remotePath: string, logs: string[]) {
  const segments = remotePath.split("/").filter(Boolean);
  let currentPath = "";
  for (const segment of segments) {
    if (segment === "public_html") {
      const list = await client.list();
      const hasPublicHtml = list.some(item => item.name === "public_html" && item.isDirectory);
      if (!hasPublicHtml) {
        continue;
      }
    }
    const list = await client.list();
    const exists = list.some(item => item.name === segment && item.isDirectory);
    if (!exists) {
      const folderName = currentPath ? `${currentPath}/${segment}` : segment;
      logs.push(`FTP directory '${folderName}' did not exist.`);
      logs.push(`Creating directory '${folderName}' on the FTP server...`);
      console.log(`[FtpStorageService] Creating directory '${folderName}' on FTP server.`);
    }
    await client.ensureDir(segment);
    currentPath = currentPath ? `${currentPath}/${segment}` : segment;
  }
}

export class FtpStorageService implements IStorageService {
  private host = process.env.FTP_HOST;
  private user = process.env.FTP_USER;
  private password = process.env.FTP_PASSWORD;
  private port = Number(process.env.FTP_PORT) || 21;
  private remotePath = process.env.FTP_REMOTE_PATH || "public/assets";

  async uploadFile(file: File, folder: string = "assets"): Promise<UploadResult> {
    if (!this.host || !this.user || !this.password) {
      console.error("[StorageService] ERROR: FTP Upload Configuration is missing.");
      throw new Error("FTP Upload Configuration is missing. Please configure FTP_HOST, FTP_USER, and FTP_PASSWORD environment variables.");
    }

    const client = new ftp.Client();
    const logs: string[] = [];
    
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || ".png";
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
      
      await client.access({
        host: this.host,
        user: this.user,
        password: this.password,
        port: this.port,
        secure: false,
      });

      // Robust navigation to target directory and collect logs if folders are created
      await ensureFtpDir(client, this.remotePath, logs);
      
      // Upload buffer as a Readable stream
      const stream = Readable.from(buffer);
      await client.uploadFrom(stream, uniqueName);
      
      // Return the public URL path served by Next.js (e.g. "/assets/12345-abc.png") and the logs
      return {
        url: `/${folder}/${uniqueName}`,
        logs
      };
    } catch (error) {
      console.error("FTP storage upload failed:", error);
      throw new Error(`Failed to upload file to FTP storage: ${(error as Error).message}`);
    } finally {
      client.close();
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!this.host || !this.user || !this.password) {
      console.error("[StorageService] ERROR: FTP Deletion Configuration is missing.");
      throw new Error("FTP Deletion Configuration is missing. Please configure FTP_HOST, FTP_USER, and FTP_PASSWORD environment variables.");
    }

    const client = new ftp.Client();
    
    try {
      const filename = path.basename(fileUrl);
      
      await client.access({
        host: this.host,
        user: this.user,
        password: this.password,
        port: this.port,
        secure: false,
      });

      await cdFtpDir(client, this.remotePath);
      await client.remove(filename);
    } catch (error) {
      console.warn(`Could not delete file ${fileUrl} on FTP:`, error);
    } finally {
      client.close();
    }
  }
}

if (typeof window === "undefined") {
  const hasFtp = !!(process.env.FTP_HOST && process.env.FTP_USER && process.env.FTP_PASSWORD);
  console.log(`[StorageService] Initialized. FTP Storage active: ${hasFtp ? "Yes" : "NO (FTP_HOST, FTP_USER, and FTP_PASSWORD are required)"}`);
}

// Export the active storage service
export const storageService: IStorageService = new FtpStorageService();
