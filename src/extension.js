// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

/**
 * @type {Object.<string, string>} regex map
 */
const regexMap = {
	'easyre.email': String.raw`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`,
	'easyre.url': String.raw`^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$`,
	'easyre.tel': String.raw`^\+?[1-9]\d{1,14}$`,
};

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "easyre" is now active!');

	Object.keys(regexMap).forEach(commandId => {
		const regex = regexMap[commandId];
		if(regex){
			const disposable = vscode.commands.registerCommand(commandId, () => {
				const editor = vscode.window.activeTextEditor;
				if(editor){
					const doc = editor.document;
					const selection = editor.selection;
					editor.edit(editBuilder => {
						if(!selection.isEmpty){
							editBuilder.replace(selection, regex);
						}else{
							editBuilder.insert(selection.active, regex);
						}
					});
					const title = `Regex: ${commandId}`;
					vscode.window.showInformationMessage(`Inserted ${title}`);
				}else{
					vscode.window.showWarningMessage('No active editor found to insert this regex.');
				}
			});
			context.subscriptions.push(disposable);
		}else{
			console.warn('Regex not found');
		}
	});
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
