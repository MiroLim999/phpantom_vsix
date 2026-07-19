import * as vscode from "vscode";

// The language server emits inlay hints such as the parameter-name labels
// ("view:", "data:") shown before call arguments. These settings let users
// hide that "ghost" text without touching VS Code's global inlay hint options.
export function filterPhpInlayHints(
    document: vscode.TextDocument,
    hints: vscode.InlayHint[] | null | undefined
): vscode.InlayHint[] | null | undefined {
    if (!hints || document.languageId !== "php") {
        return hints;
    }

    const config = vscode.workspace.getConfiguration("phpantom");

    if (!config.get<boolean>("inlayHints.enabled", true)) {
        return [];
    }

    if (config.get<boolean>("inlayHints.parameterNames.enabled", true)) {
        return hints;
    }

    return hints.filter((hint) => !isParameterNameHint(hint));
}

function isParameterNameHint(hint: vscode.InlayHint): boolean {
    if (hint.kind === vscode.InlayHintKind.Parameter) {
        return true;
    }

    if (hint.kind === vscode.InlayHintKind.Type) {
        return false;
    }

    // Some servers omit the kind. Parameter-name hints render as "name:" placed
    // before the argument, so fall back to matching that shape.
    return getInlayHintText(hint).trimEnd().endsWith(":");
}

function getInlayHintText(hint: vscode.InlayHint): string {
    if (typeof hint.label === "string") {
        return hint.label;
    }

    return hint.label.map((part) => part.value).join("");
}
