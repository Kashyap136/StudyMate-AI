// Centralized Gemini configuration.
//
// This is the single place the Gemini model name lives. Change it here (or via
// GEMINI_MODEL in the server .env) and every AI feature picks it up.

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'