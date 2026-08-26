import * as ftp from "basic-ftp";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log("Connecting to FTP...");
    await client.access({
      host: process.env.FTP_HOST || "147.93.99.247",
      user: "u899510431.upload",
      password: "Godrej@2026",
      port: 21,
      secure: false
    });

    console.log("Login SUCCESS!");
    console.log("PWD:", await client.pwd());

    console.log("Listing root directory:");
    const list = await client.list();
    for (const item of list) {
      console.log(`- ${item.name} (${item.isDirectory ? "dir" : "file"})`);
    }

    // Try to CWD into different paths to see what exists
    const pathsToTry = [
      "public",
      "public/assets",
      "nodejs",
      "nodejs/public",
      "nodejs/public/assets",
      "domains",
      "public_html"
    ];

    for (const p of pathsToTry) {
      try {
        await client.cd("/");
        await client.cd(p);
        console.log(`CWD to '${p}' SUCCESS. PWD:`, await client.pwd());
        const files = await client.list();
        console.log(`  Files:`, files.map(f => `${f.name} (${f.isDirectory ? "dir" : "file"})`));
      } catch (err: any) {
        console.log(`CWD to '${p}' FAILED:`, err.message);
      }
    }

  } catch (err: any) {
    console.error("FTP Error:", err.message);
  } finally {
    client.close();
  }
}

main();
