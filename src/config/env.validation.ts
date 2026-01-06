import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // SERVER
  PORT: Joi.number().default(3001),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // DATABASE (Postgres/Supabase)
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  // SECURITY & AUTH
  JWT_SECRET: Joi.string().required().min(8),
  JWT_EXPIRATION: Joi.string().default('7d'),

  // PAYMENT (M-Pesa)
  MPESA_CONSUMER_KEY: Joi.string().required(),
  MPESA_CONSUMER_SECRET: Joi.string().required(),
  MPESA_PASSKEY: Joi.string().required(),
  MPESA_CALLBACK_URL: Joi.string().uri().required(),

  // FRONTEND
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
});
