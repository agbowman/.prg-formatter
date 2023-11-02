import * as vscode from 'vscode';

export const completionFunctions: { label: string; kind: vscode.CompletionItemKind; documentation: string; insertText: string }[] = [
  {
    label: 'AVG',
    kind: vscode.CompletionItemKind.Function,
    documentation: 'Returns the average of two or more values.',
    insertText: 'AVG'
  },
  {
    label: 'SUM',
    kind: vscode.CompletionItemKind.Function,
    documentation: 'Calculates the sum of a series of numbers.',
    insertText: 'SUM'
  }
  // ... other functions
];
