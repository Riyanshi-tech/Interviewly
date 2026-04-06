"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const rawConnectionString = process.env.DATABASE_URL;
const connectionString = rawConnectionString?.replace(/&?channel_binding=require/, "");
const pool = new pg_1.Pool({ connectionString });
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});
const adapter = new adapter_pg_1.PrismaPg(pool);
exports.prisma = new client_1.PrismaClient({ adapter });
//# sourceMappingURL=prisma.js.map