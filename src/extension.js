// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

/**
 * @type {Object.<string, string>} regex map
 */
const regexMap = {
	'easyre.pint': String.raw`^[1-9]\d*$`,
	'easyre.nint': String.raw`^-[1-9]\d*$`,
	'easyre.email': String.raw`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`,
	'easyre.url': String.raw`^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$`,
	'easyre.date': String.raw`^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$`,
	'easyre.time': String.raw`/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/`,
	'easyre.time24': String.raw`/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/`,
	'easyre.time12': String.raw`/^(0\d|1[0-2]):[0-5]\d:[0-5]\d\s?(AM|PM)$/i`,
	'easyre.ipv4': String.raw`/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/`,
	'easyre.ipv6': String.raw`(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))`,
	'easyre.mac': String.raw`/^(?:(?:[0-9a-f]{2}([:\-])(?:[0-9a-f]{2}\1){4})|(?:[0-9a-f]{4}\.[0-9a-f]{4}\.[0-9a-f]{4})|(?:[0-9a-f]{12}))$/i`,
	'easyre.username': String.raw`/^[a-zA-Z0-9_-]{4,16}$/`,
	'easyre.passwd': String.raw`/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/`,
	'easyre.money': String.raw`/^\-?(?:(?:\p{Sc}\s*)(?:(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{1,2})?)|(?:(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{1,2})?)(?:\s*\p{Sc})|(?:(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{1,2})?))$/`,
	'easyre.tel': String.raw`/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/`,
	'easyre.tel-us': String.raw`/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/`,
	'easyre.tel-uk': String.raw`/^7\d{3}\s?\d{6}$/`,
	'easyre.tel-fr': String.raw`/^[1-9](\d{2}){4}$/`,
	'easyre.tel-de': String.raw`/^(1\d{1,4}|[2-9]\d{1,4})[-.\s]?\d{2,12}$/`,
	'easyre.tel-jp': String.raw`/^0\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{4}$/`,
	'easyre.tel-cn': String.raw`/^1[3-9]\d{9}$/`,
	'easyre.tel-in': String.raw`/^[6-9]\d{9}$/`,
	'easyre.tel-ru': String.raw`/^\d{3}[-.\s]?\d{3}[-.\s]?\d{2}[-.\s]?\d{2}$/`,
	'easyre.tel-br': String.raw`/^(\d{2})\s?9?\d{4}[-.\s]?\d{4}$/`,
	'easyre.tel-au': String.raw`/^4\d{2}\s?\d{3}\s?\d{3}$/`,
	'easyre.postal': String.raw`/^\d{5}(-\d{4})?$/`,
	'easyre.postal-us': String.raw`/^\d{5}(-\d{4})?$/`,
	'easyre.postal-ca': String.raw`/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/`,
	'easyre.postal-uk': String.raw`/^([A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2})$/`,
	'easyre.postal-au': String.raw`/^\d{4}$/`,
	'easyre.postal-in': String.raw`/^\d{6}$/`,
	'easyre.postal-cn': String.raw`/^\d{6}$/`,
	'easyre.postal-de': String.raw`/^\d{5}$/`,
	'easyre.postal-fr': String.raw`/^\d{5}$/`,
	'easyre.postal-jp': String.raw`/^\d{3}-\d{4}$/`,
	'easyre.postal-ru': String.raw`/^\d{6}$/`,
	'easyre.postal-br': String.raw`/^\d{5}-\d{3}$/`,
	'easyre.postal-it': String.raw`/^\d{5}$/`,
	'easyre.postal-nl': String.raw`/^\d{4}\s?[A-Za-z]{2}$/`,
	'easyre.postal-ch': String.raw`/^\d{4}$/`,
	'easyre.postal-nz': String.raw`/^\d{4}$/`,
	'easyre.fax': String.raw`/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/`,
	'easyre.whitespace': String.raw`^\s*|\s*$`,
	'easyre.colorhex': String.raw`^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$`,
	'easyre.colorrgb': String.raw`^rgb\((\d{1,3},\s?){2}\d{1,3}\)$`,
	'easyre.colorrgba': String.raw`^rgba\((\d{1,3},\s?){3}\d(\.\d+)?\)$`,
	'easyre.colorhsl': String.raw`^hsl\((\d{1,3},\s?){2}\d(\.\d+)?\)$`,
	'easyre.colorhsla': String.raw`^hsla\((\d{1,3},\s?){3}\d(\.\d+)?\)$`,

};

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	Object.keys(regexMap).forEach(commandId => {
		const regex = regexMap[commandId];
		if(regex){
			const disposable = vscode.commands.registerCommand(commandId, () => {
				const editor = vscode.window.activeTextEditor;
				if(editor){
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

	const parseDisposable = vscode.commands.registerCommand('easyre.parse', () => {
		const editor = vscode.window.activeTextEditor;
		if(editor){
			const selection = editor.selection;
			const selectedText = editor.document.getText(selection);

			if(selectedText){
				try{
					const regex = new RegExp(selectedText);
					const panel = vscode.window.createWebviewPanel(
						'regexVisualizer',
						`Regex: ${selectedText}`,
						{ viewColumn: vscode.ViewColumn.One, preserveFocus: true },
						{ enableScripts: true, localResourceRoots: [vscode.Uri.file(`${context.extensionPath}/src`)] }
					 );

					panel.webview.html = getWebviewContent(context, regex.source);
					vscode.window.showInformationMessage('Regex parsed and visualized successfully!');
				}catch(e){
					vscode.window.showErrorMessage(`Error parsing regex: ${e.message}`);
				}
			}else{
				vscode.window.showWarningMessage('No regex selected for parsing.');
			}
		}else{
			vscode.window.showWarningMessage('No active editor found.');
		}
	});

	context.subscriptions.push(parseDisposable);
}

function getWebviewContent(context, regex) {
	const path = require('path');
	const fs = require('fs');
	const filePath = context.asAbsolutePath(path.join('src', 'vis.html'));

	let FinalTable = fs.readFileSync(filePath, 'utf8');
	FinalTable = FinalTable.replace(
		'<script id="regex-placeholder"></script>',
		`<script id="regex-placeholder">const regex = ${JSON.stringify(regex)};</script>`
	);
	return FinalTable;
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
