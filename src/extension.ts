import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // Registro do provedor de formatação de documento para arquivos .dat
  let disposable = vscode.languages.registerDocumentFormattingEditProvider('dat', {
    provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
      const edits: vscode.TextEdit[] = [];
      const text = document.getText();
      const lines = text.split(/\r?\n/);

      // Encontra o comprimento máximo da chave
      let maxKeyLength = 0;
      lines.forEach(line => {
        const match = line.match(/^\s*([A-Z_\-]+)\s*=\s*(.*)$/);
        if (match) {
          const key = match[1].trim();
          if (key.length > maxKeyLength) {
            maxKeyLength = key.length;
          }
        }
      });

      // Aplica a formatação com base no comprimento máximo da chave
      lines.forEach((line, index) => {
        const match = line.match(/^\s*([A-Z_\-]+)\s*=\s*(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim();
          const spacesToAdd = maxKeyLength - key.length + 10; // Calcula os espaços a adicionar
          const formattedLine = `    ${key}= ${' '.repeat(spacesToAdd)}${value}`;
          edits.push(vscode.TextEdit.replace(new vscode.Range(index, 0, index, line.length), formattedLine));
        }
      });

      return edits;
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
