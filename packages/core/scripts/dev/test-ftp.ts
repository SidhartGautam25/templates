import * as ftp from "basic-ftp";
import dotenv from "dotenv";
import { Writable } from "stream";
dotenv.config();

class WritableBuffer extends Writable {
  private chunks: Buffer[] = [];
  _write(chunk: any, encoding: string, callback: (error?: Error | null) => void) {
    this.chunks.push(Buffer.from(chunk));
    callback();
  }
  getBuffer() {
    return Buffer.concat(this.chunks);
  }
}

async function cdFtpDir(client: ftp.Client, remotePath: string) {
  const segments = remotePath.split("/").filter(Boolean);
  for (const segment of segments) {
    if (segment === "public_html") {
      const list = await client.list();
      const hasPublicHtml = list.some(item => item.name === "public_html" && item.isDirectory);
      if (!hasPublicHtml) {
        console.log("Skipping 'public_html' segment (jailed FTP).");
        continue;
      }
    }
    await client.cd(segment);
  }
}

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  const testFilename = "1782633557861-f36oyon.avif"; // An asset we know exists in /.builds/last-source/public/assets
  
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: Number(process.env.FTP_PORT) || 21,
      secure: false
    });
    
    // Try Primary path
    let success = false;
    let fileBuffer: Buffer | null = null;
    
    try {
      console.log("Checking primary path...");
      const remotePath = process.env.FTP_REMOTE_PATH || "public_html/public/assets";
      await cdFtpDir(client, remotePath);
      
      const writableBuffer = new WritableBuffer();
      await client.downloadTo(writableBuffer, testFilename);
      fileBuffer = writableBuffer.getBuffer();
      success = true;
      console.log("Found in primary path!");
    } catch (err) {
      console.log("Primary path failed (expected if not uploaded yet):", (err as Error).message);
    }
    
    // Try Secondary build-source path if primary failed
    if (!success) {
      try {
        console.log("Checking secondary build-source path...");
        // Reset to FTP root
        await client.cd("/");
        const secondaryPath = ".builds/last-source/public/assets";
        await cdFtpDir(client, secondaryPath);
        
        const writableBuffer = new WritableBuffer();
        await client.downloadTo(writableBuffer, testFilename);
        fileBuffer = writableBuffer.getBuffer();
        success = true;
        console.log("Found in secondary build-source path!");
      } catch (err) {
        console.log("Secondary path failed:", (err as Error).message);
      }
    }
    
    if (success && fileBuffer) {
      console.log(`Success! Downloaded file size: ${fileBuffer.length} bytes`);
    } else {
      console.log("Failed to find file in both paths.");
    }
    
  } catch (err) {
    console.error("FTP Connection Error:", err);
  } finally {
    client.close();
  }
}
main();
