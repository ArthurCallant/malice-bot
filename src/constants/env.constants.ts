import * as dotenv from 'dotenv';
dotenv.config();

const ENV_GROUP_ID = process.env.GROUP_ID;
export const GROUP_ID: number = ENV_GROUP_ID as unknown as number;
