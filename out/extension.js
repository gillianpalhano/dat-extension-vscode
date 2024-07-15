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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    // Registro do provedor de formatação de documento para arquivos .dat
    let disposable = vscode.languages.registerDocumentFormattingEditProvider('dat', {
        provideDocumentFormattingEdits(document) {
            const edits = [];
            const text = document.getText();
            const lines = text.split(/\r?\n/);
            // Encontra o comprimento máximo da chave
            // let maxKeyLength = 0; // v0.1.0
            let maxKeyLength = 20; // tamanho minimo
            lines.forEach(line => {
                const match = line.match(/^\s*([A-Za-z0-9_\-]+)\s*=\s*(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    if (key.length > maxKeyLength) {
                        maxKeyLength = key.length;
                    }
                }
            });
            // Aplica a formatação com base no comprimento máximo da chave
            lines.forEach((line, index) => {
                const match = line.match(/^\s*([A-Za-z0-9_\-]+)\s*=\s*(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim();
                    // const spacesToAdd = maxKeyLength - key.length + 10; // Calcula os espaços a adicionar  // v0.10
                    // const formattedLine = `    ${key}= ${' '.repeat(spacesToAdd)}${value}`; // v0.10
                    const spacesToAdd = maxKeyLength - key.length; // Calcula os espaços a adicionar  // v0.10
                    const formattedLine = `${' '.repeat(spacesToAdd)}${key}=  ${value}`;
                    edits.push(vscode.TextEdit.replace(new vscode.Range(index, 0, index, line.length), formattedLine));
                }
            });
            return edits;
        }
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map