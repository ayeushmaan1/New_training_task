import 'dotenv/config';
import { initStore, reseedStore } from './store.js';

await initStore({ force: false });
await reseedStore();
console.log('Database seeded. Demo accounts: admin@example.com / Admin123!, user@example.com / Password123!');
process.exit(0);
