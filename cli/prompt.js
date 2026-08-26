import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

/**
 * @param {string} message
 * @param {boolean} autoConfirm
 */
export async function confirmYesNo(message, autoConfirm = false) {
  if (autoConfirm) return true;

  const rl = createInterface({ input, output });
  try {
    const answer = await rl.question(message);
    const trimmed = answer.trim().toLowerCase();
    return trimmed === "y" || trimmed === "yes";
  } finally {
    rl.close();
  }
}
