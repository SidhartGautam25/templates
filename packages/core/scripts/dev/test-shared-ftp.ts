import * as ftp from "basic-ftp";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  const hosts = [
    "srv1835.hstgr.io",
    "godrejpropertypune.com"
  ];

  const credentialsToTry = [
    { user: "u899510431", pass: "GodrejAdmin2026" },
    { user: "u899510431", pass: "Godrej@2026" },
    // Also try with u899510431.godrej in case they created it on the shared hosting as well
    { user: "u899510431.godrej", pass: "Godrej@2026" },
    { user: "u899510431.godrej", pass: "GodrejAdmin2026" },
  ];

  for (const host of hosts) {
    for (const cred of credentialsToTry) {
      try {
        console.log(`\n=========================================`);
        console.log(`Trying Host: ${host} | FTP user: ${cred.user} | Password: ${cred.pass}`);
        console.log(`=========================================`);
        await client.access({
          host: host,
          user: cred.user,
          password: cred.pass,
          port: 21,
          secure: false
        });

        console.log(`Login SUCCESS!`);
        console.log("Current working directory:", await client.pwd());

        console.log("\nListing root directory:");
        const list = await client.list();
        for (const item of list) {
          console.log(`- ${item.name} (${item.isDirectory ? "dir" : "file"})`);
        }

        const pathsToTry = [
          "media",
          "media/godrejpropertypune",
          "public_html/media/godrejpropertypune",
          "public_html/media"
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
        return; // Success! Exit early.
      } catch (err: any) {
        console.error(`FAILED:`, err.message);
      }
    }
  }
}

main();
