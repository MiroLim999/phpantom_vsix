import * as os from "os";
import * as path from "path";

// Expand a leading "~" to the current user's home directory.
// Uses os.homedir() so it works across platforms (USERPROFILE on Windows,
// HOME on macOS/Linux) and accepts both "/" and "\" as the separator that
// follows the tilde, since users commonly type "~/..." even on Windows.
export function expandHome(file: string): string {
    if (file === "~") {
        return os.homedir() || file;
    }

    if (file.startsWith("~/") || file.startsWith(`~${path.sep}`)) {
        const home = os.homedir();
        return home ? path.join(home, file.slice(2)) : file;
    }

    return file;
}

export function formatError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
