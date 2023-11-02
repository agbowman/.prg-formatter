"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const completionItems_1 = require("./completionItems");
const ifDecorationType = vscode.window.createTextEditorDecorationType({
    // Define the styles for the decoration
    borderRadius: '3px',
    backgroundColor: 'rgba(255, 255, 0, 0.3)' // Example color, change as needed
});
function createInitialsRegExp(completionFunctions) {
    const uniqueInitials = new Set(completionFunctions.map(func => func.label[0].toLowerCase()));
    return new RegExp(`[${Array.from(uniqueInitials).join('')}]$`, 'i');
}
const initialsRegExp = createInitialsRegExp(completionItems_1.completionFunctions);
class MyCompletionItemProvider {
    provideCompletionItems(document, position, token, context) {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        if (!initialsRegExp.test(linePrefix)) {
            return undefined;
        }
        // Convert your imported completion functions to VS Code CompletionItems
        return completionItems_1.completionFunctions.map(func => {
            const completionItem = new vscode.CompletionItem(func.label, func.kind);
            completionItem.documentation = new vscode.MarkdownString(func.documentation);
            completionItem.insertText = func.insertText;
            return completionItem;
        });
    }
}
function updateIfEndifDecorations(editor) {
    // Clear existing decorations
    editor.setDecorations(ifDecorationType, []);
    const text = editor.document.getText();
    const ifRegex = /if\b/gi;
    const endifRegex = /endif\b/gi;
    const ifRanges = [];
    const endifRanges = [];
    let match;
    while (match = ifRegex.exec(text)) {
        const startPos = editor.document.positionAt(match.index);
        const endPos = editor.document.positionAt(match.index + match[0].length);
        const range = new vscode.Range(startPos, endPos);
        ifRanges.push(range);
    }
    while (match = endifRegex.exec(text)) {
        const startPos = editor.document.positionAt(match.index);
        const endPos = editor.document.positionAt(match.index + match[0].length);
        const range = new vscode.Range(startPos, endPos);
        endifRanges.push(range);
    }
    // Assuming a simple structure where each 'if' matches the following 'endif'
    // This logic should be adjusted for nested or more complex structures
    for (let i = 0; i < Math.min(ifRanges.length, endifRanges.length); i++) {
        if (editor.selection.intersection(ifRanges[i]) || editor.selection.intersection(endifRanges[i])) {
            editor.setDecorations(ifDecorationType, [ifRanges[i], endifRanges[i]]);
            break;
        }
    }
}
// You would also need to register the provider with VSCode in the extension activation function.
// For example:
function activate(context) {
    console.log('Extension "vscode prg-formatter" is now active.');
    const provider = new MyCompletionItemProvider();
    // We use the spread operator to convert the string into an array of characters
    const triggerCharacters = [...'abcdefghijklmnopqrstuvwxyz'];
    const providerDisposable = vscode.languages.registerCompletionItemProvider('customprg', // The language identifier
    provider, ...triggerCharacters // Spread the array to use each letter as a trigger character
    );
    context.subscriptions.push(providerDisposable);
    //---now for the highlighter code:
    // Register the event listener for text editor selection changes
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(event => {
        updateIfEndifDecorations(event.textEditor);
    }));
    // Initial call to set decorations for the active editor
    if (vscode.window.activeTextEditor) {
        updateIfEndifDecorations(vscode.window.activeTextEditor);
    }
}
exports.activate = activate;
function deactivate() {
    // Clean up if necessary
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map