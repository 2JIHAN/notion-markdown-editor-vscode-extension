import * as vscode from 'vscode';
import { NotionMarkdownEditorProvider } from './notionMarkdownEditorProvider';

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(NotionMarkdownEditorProvider.register(context));

  context.subscriptions.push(
    vscode.commands.registerCommand('notionMdEditor.openSourceView', async () => {
      const activeTabInput = vscode.window.tabGroups.activeTabGroup.activeTab?.input;
      if (!activeTabInput || typeof activeTabInput !== 'object' || !('uri' in activeTabInput)) return;
      await vscode.commands.executeCommand(
        'vscode.openWith',
        (activeTabInput as { uri: vscode.Uri }).uri,
        'default'
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('notionMdEditor.openBlockView', async () => {
      const activeTabInput = vscode.window.tabGroups.activeTabGroup.activeTab?.input;
      if (!activeTabInput || typeof activeTabInput !== 'object' || !('uri' in activeTabInput)) return;
      await vscode.commands.executeCommand(
        'vscode.openWith',
        (activeTabInput as { uri: vscode.Uri }).uri,
        'notionMdEditor.editor'
      );
    })
  );
}

export function deactivate(): void {}
