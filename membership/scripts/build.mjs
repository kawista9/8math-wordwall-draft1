import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '../..');
const out = path.join(root, 'membership/dist');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const name of await readdir(root)) {
 if (name === 'assets' || /\.(html|js|css)$/.test(name)) await cp(path.join(root,name),path.join(out,name),{recursive:true});
}
await cp(path.join(root,'membership/client.js'),path.join(out,'membership-client.js'));
async function inspect(dir) {
 for (const name of await readdir(dir)) {
  const file = path.join(dir,name), info = await stat(file);
  if (info.isDirectory()) await inspect(file);
  else if (info.size > 25 * 1024 * 1024) throw new Error(`Asset exceeds hosting limit: ${file}`);
 }
}
await inspect(out);
console.log('Built protected word wall assets.');
