import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Writable } from "stream";
import * as ftp from "basic-ftp";

interface RouteParams {
  params: Promise<{ filename: string }>;
}

class WritableBuffer extends Writable {
  private chunks: Buffer[] = [];

  _write(
    chunk: any,
    encoding: string,
    callback: (error?: Error | null) => void
  ) {
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
        continue;
      }
    }
    await client.cd(segment);
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { filename } = await params;

  // Prevent directory traversal attacks
  if (
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\")
  ) {
    return new NextResponse("Invalid filename", { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public", "assets", filename);

  const getContentType = (fname: string) => {
    let contentType = "image/png";
    const ext = path.extname(fname).toLowerCase();
    if (ext === ".jpg" || ext === ".jpeg") {
      contentType = "image/jpeg";
    } else if (ext === ".webp") {
      contentType = "image/webp";
    } else if (ext === ".avif") {
      contentType = "image/avif";
    } else if (ext === ".svg") {
      contentType = "image/svg+xml";
    } else if (ext === ".gif") {
      contentType = "image/gif";
    }
    return contentType;
  };

  // 1. Try reading from the local disk first
  try {
    const fileBuffer = await fs.readFile(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": getContentType(filename),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (localError) {
    // 2. Fallback to fetching via FTP if configured (useful on localhost development)
    const ftpHost = process.env.FTP_HOST;
    const ftpUser = process.env.FTP_USER;
    const ftpPassword = process.env.FTP_PASSWORD;

    if (ftpHost && ftpUser && ftpPassword) {
      const client = new ftp.Client();

      try {
        await client.access({
          host: ftpHost,
          user: ftpUser,
          password: ftpPassword,
          port: Number(process.env.FTP_PORT) || 21,
          secure: false,
        });

        let ftpBuffer: Buffer | null = null;
        const remotePath = process.env.FTP_REMOTE_PATH || "public/assets";

        // Try primary path first
        try {
          await cdFtpDir(client, remotePath);
          const writableBuffer = new WritableBuffer();
          await client.downloadTo(writableBuffer, filename);
          ftpBuffer = writableBuffer.getBuffer();
        } catch (primaryErr) {
          // If primary path fails, check the secondary build-source path
          try {
            await client.cd("/");
            const secondaryPath = ".builds/last-source/public/assets";
            await cdFtpDir(client, secondaryPath);
            const writableBuffer = new WritableBuffer();
            await client.downloadTo(writableBuffer, filename);
            ftpBuffer = writableBuffer.getBuffer();
          } catch (secondaryErr) {
            throw new Error(`Failed to retrieve file from both primary and secondary paths. Primary: ${(primaryErr as Error).message}. Secondary: ${(secondaryErr as Error).message}`);
          }
        }



        return new NextResponse(ftpBuffer as any, {
          headers: {
            "Content-Type": getContentType(filename),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      } catch (ftpError) {
        console.warn(`[Asset Route] FTP fallback failed for ${filename} (file may have been deleted or not uploaded yet): ${(ftpError as Error).message}`);
      } finally {
        client.close();
      }
    }

    return new NextResponse("File not found", { status: 404 });
  }
}
