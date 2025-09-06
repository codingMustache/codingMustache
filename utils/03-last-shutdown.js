import { execSync } from "child_process";

const date = new Date(
    execSync("journalctl --list-boots")
        .toString()
        .match(
            /^\s*0\s+([0-9a-f]{32})\s+([A-Za-z]{3} \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [A-Z]+)\s+([A-Za-z]{3} \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [A-Z]+)$/m,
        )[2],
);
const now = new Date();

let years = now.getFullYear() - date.getFullYear();
let months = now.getMonth() - date.getMonth();
let days = now.getDate() - date.getDate();
let hours = now.getHours() - date.getHours();
let minutes = now.getMinutes() - date.getMinutes();

// Adjust negative values
if (minutes < 0) ((minutes += 60), hours--);
if (hours < 0) ((hours += 24), days--);
if (days < 0)
    ((days += new Date(now.getFullYear(), now.getMonth(), 0).getDate()),
        months--);
if (months < 0) ((months += 12), years--);

const parts = [];
if (years) parts.push(`${years} years `);
if (months) parts.push(`${months} months `);
if (days) parts.push(`${days} days`);
// if (hours) parts.push(`${hours} hours `);
// if (minutes) parts.push(`${minutes} minutes`);
/**
 * Last Shutdown
 * @author codingMustache
 * @type string
 * @returns A formatted string of amount of time an ubuntu server is up
 * @example
 * ```
 * Its Been

  7 days 22 hours, 49 minutes

 Since the last Shutdown```
 ```
 */
export default `## Home Server Up-Time\n\nIts been **${parts.join("")}** since this server shutdown`;
