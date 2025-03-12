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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    console.log('Extensão "dat-extension-vscode" ativada');
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
                    const formattedLine = `${' x '.repeat(spacesToAdd)}${key}=  ${value}`;
                    edits.push(vscode.TextEdit.replace(new vscode.Range(index, 0, index, line.length), formattedLine));
                }
            });
            return edits;
        }
    });
    context.subscriptions.push(disposable);
    // Sugestão de codificação
    vscode.workspace.onDidOpenTextDocument(document => {
        console.log('gillian Evento onDidOpenTextDocument acionado'); // Log para verificar se o evento é acionado
        console.log('gillian Documento aberto:', document.fileName); // Log para verificar o nome do documento
        console.log('gillian Documento document:', document); // Log para verificar o nome do documento
        if (document.languageId === 'dat') {
            console.log('Documento .dat detectado'); // Log para verificar se o documento é do tipo 'dat'
            // Obtém a configuração de codificação do arquivo
            const encoding = vscode.workspace.getConfiguration('files', document.uri).get('encoding');
            console.log('Codificação do documento:', encoding); // Log para verificar a codificação obtida
            if (encoding !== 'iso88591') {
                vscode.window.showInformationMessage('Considere mudar a codificação do arquivo para ISO-8859-1 para melhor compatibilidade.');
            }
        }
        else {
            console.log('Documento não é do tipo .dat');
        }
    });
}
function deactivate() {
    console.log('Extensão "dat-extension-vscode" desativada'); // Log para verificar se a extensão foi desativada
}
//# sourceMappingURL=extension.js.map