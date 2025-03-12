import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('Extensão "dat-extension-vscode" ativada');
  // Registro do provedor de formatação de documento para arquivos .dat
  let disposable = vscode.languages.registerDocumentFormattingEditProvider('dat', {
    provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
      const edits: vscode.TextEdit[] = [];
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
    // console.log('Evento onDidOpenTextDocument acionado'); // Log para verificar se o evento é acionado
    // console.log('Documento aberto:', document.fileName); // Log para verificar o nome do documento
    // console.log('Documento document:', document); // Log para verificar o nome do documento
    if (document.languageId === 'dat') {
      // console.log('Documento .dat detectado'); // Log para verificar se o documento é do tipo 'dat'
      // Obtém a configuração de codificação do arquivo
      const encoding = vscode.workspace.getConfiguration('files', document.uri).get('encoding');
      // console.log('Codificação do documento:', encoding); // Log para verificar a codificação obtida

      if (encoding !== 'iso88591') {
        vscode.window.showInformationMessage('Considere mudar a codificação do arquivo para ISO-8859-1 para melhor compatibilidade.');
      }
    } else {
      // console.log('Documento não é do tipo .dat');
    }
  });
}

export function deactivate() {
  console.log('Extensão "dat-extension-vscode" desativada'); // Log para verificar se a extensão foi desativada
}
