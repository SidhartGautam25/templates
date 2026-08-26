import * as ftp from "basic-ftp";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  const credentialsToTry = [
    { user: "u899510431", pass: "GodrejAdmin2026" },
    { user: "u899510431", pass: "Godrej@2026" },
  ];

  for (const cred of credentialsToTry) {
    try {
      console.log(`\n=========================================`);
      console.log(`Trying FTP user: ${cred.user} with pass: ${cred.pass}`);
      console.log(`=========================================`);
      await client.access({
        host: process.env.FTP_HOST || "147.93.99.247",
        user: cred.user,
        password: cred.pass,
        port: Number(process.env.FTP_PORT) || 21,
        secure: false
      });

      console.log(`Login SUCCESS for user: ${cred.user}`);
      console.log("Current working directory:", await client.pwd());

      console.log("\nListing root directory:");
      const list = await client.list();
      for (const item of list) {
        console.log(`- ${item.name} (${item.isDirectory ? "dir" : "file"})`);
      }

      // Check if we can find the media/godrejpropertypune directory
      const pathsToTry = [
        "media",
        "media/godrejpropertypune",
        "files/media/godrejpropertypune",
        "domains",
        "public_html"
      ];
      for (const p of pathsToTry) {
        try {
          await client.cd("/");
          await client.cd(p);
          console.log(`Successfully cd'd to '${p}'. pwd:`, await client.pwd());
          const files = await client.list();
          console.log(`Contents of '${p}':`, files.map(f => f.name));
        } catch (err: any) {
          console.log(`Failed to cd to '${p}':`, err.message);
        }
      }

      client.close();
      break;
    } catch (err: any) {
      console.error(`Login FAILED for user ${cred.user}:`, err.message);
    }
  }
}

main();
