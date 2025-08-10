const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

let monaco;
let currentEditor;
let openFiles = new Map();
let activeFileId = 'welcome';

// Language templates
const templates = {
    javascript: {
        name: 'JavaScript',
        extension: 'js',
        content: `// JavaScript Template
console.log('Hello, World!');

// Function example
function greet(name) {
    return \`Hello, \${name}!\`;
}

// Class example
class Calculator {
    constructor() {
        this.result = 0;
    }
    
    add(number) {
        this.result += number;
        return this;
    }
    
    multiply(number) {
        this.result *= number;
        return this;
    }
    
    getResult() {
        return this.result;
    }
}

// Usage
const calc = new Calculator();
const result = calc.add(5).multiply(3).getResult();
console.log('Result:', result);

// Arrow function
const processArray = (arr) => arr
    .filter(x => x > 0)
    .map(x => x * 2)
    .reduce((sum, x) => sum + x, 0);

console.log(processArray([1, -2, 3, -4, 5]));`
    },
    python: {
        name: 'Python',
        extension: 'py',
        content: `# Python Template
print("Hello, World!")

# Function example
def greet(name):
    return f"Hello, {name}!"

# Class example
class Calculator:
    def __init__(self):
        self.result = 0
    
    def add(self, number):
        self.result += number
        return self
    
    def multiply(self, number):
        self.result *= number
        return self
    
    def get_result(self):
        return self.result

# Usage
calc = Calculator()
result = calc.add(5).multiply(3).get_result()
print(f"Result: {result}")

# List comprehension
numbers = [1, -2, 3, -4, 5]
processed = sum([x * 2 for x in numbers if x > 0])
print(f"Processed: {processed}")

# Dictionary example
person = {
    "name": "John Doe",
    "age": 30,
    "city": "New York"
}

for key, value in person.items():
    print(f"{key}: {value}")`
    },
    java: {
        name: 'Java',
        extension: 'java',
        content: `// Java Template
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Create calculator instance
        Calculator calc = new Calculator();
        int result = calc.add(5).multiply(3).getResult();
        System.out.println("Result: " + result);
        
        // Array processing
        int[] numbers = {1, -2, 3, -4, 5};
        int processed = processArray(numbers);
        System.out.println("Processed: " + processed);
    }
    
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
    
    public static int processArray(int[] arr) {
        int sum = 0;
        for (int num : arr) {
            if (num > 0) {
                sum += num * 2;
            }
        }
        return sum;
    }
}

class Calculator {
    private int result;
    
    public Calculator() {
        this.result = 0;
    }
    
    public Calculator add(int number) {
        this.result += number;
        return this;
    }
    
    public Calculator multiply(int number) {
        this.result *= number;
        return this;
    }
    
    public int getResult() {
        return this.result;
    }
}`
    },
    cpp: {
        name: 'C++',
        extension: 'cpp',
        content: `// C++ Template
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <numeric>

using namespace std;

// Function example
string greet(const string& name) {
    return "Hello, " + name + "!";
}

// Class example
class Calculator {
private:
    int result;
    
public:
    Calculator() : result(0) {}
    
    Calculator& add(int number) {
        result += number;
        return *this;
    }
    
    Calculator& multiply(int number) {
        result *= number;
        return *this;
    }
    
    int getResult() const {
        return result;
    }
};

// Function to process array
int processArray(const vector<int>& arr) {
    vector<int> filtered;
    copy_if(arr.begin(), arr.end(), back_inserter(filtered), [](int x) { return x > 0; });
    
    transform(filtered.begin(), filtered.end(), filtered.begin(), [](int x) { return x * 2; });
    
    return accumulate(filtered.begin(), filtered.end(), 0);
}

int main() {
    cout << "Hello, World!" << endl;
    
    // Calculator usage
    Calculator calc;
    int result = calc.add(5).multiply(3).getResult();
    cout << "Result: " << result << endl;
    
    // Array processing
    vector<int> numbers = {1, -2, 3, -4, 5};
    int processed = processArray(numbers);
    cout << "Processed: " << processed << endl;
    
    return 0;
}`
    },
    csharp: {
        name: 'C#',
        extension: 'cs',
        content: `// C# Template
using System;
using System.Linq;

namespace DesktopIDE
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
            
            // Calculator usage
            var calc = new Calculator();
            int result = calc.Add(5).Multiply(3).GetResult();
            Console.WriteLine($"Result: {result}");
            
            // Array processing
            int[] numbers = {1, -2, 3, -4, 5};
            int processed = ProcessArray(numbers);
            Console.WriteLine($"Processed: {processed}");
        }
        
        static string Greet(string name)
        {
            return $"Hello, {name}!";
        }
        
        static int ProcessArray(int[] arr)
        {
            return arr.Where(x => x > 0)
                     .Select(x => x * 2)
                     .Sum();
        }
    }
    
    public class Calculator
    {
        private int result;
        
        public Calculator()
        {
            result = 0;
        }
        
        public Calculator Add(int number)
        {
            result += number;
            return this;
        }
        
        public Calculator Multiply(int number)
        {
            result *= number;
            return this;
        }
        
        public int GetResult()
        {
            return result;
        }
    }
}`
    },
    html: {
        name: 'HTML',
        extension: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Template</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            background-color: #f4f4f4;
            padding: 20px;
            border-radius: 5px;
        }
        .btn {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        .btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to HTML Template</h1>
        <p>This is a sample HTML page with some basic styling and JavaScript functionality.</p>
        
        <h2>Interactive Elements</h2>
        <button class="btn" onclick="showMessage()">Click Me!</button>
        <button class="btn" onclick="changeColor()">Change Color</button>
        
        <h2>Form Example</h2>
        <form>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
            <br><br>
            
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <br><br>
            
            <button type="submit" class="btn">Submit</button>
        </form>
        
        <h2>List Example</h2>
        <ul>
            <li>HTML - Structure</li>
            <li>CSS - Styling</li>
            <li>JavaScript - Interactivity</li>
        </ul>
    </div>

    <script>
        function showMessage() {
            alert('Hello from JavaScript!');
        }
        
        function changeColor() {
            const container = document.querySelector('.container');
            const colors = ['#f4f4f4', '#e3f2fd', '#f3e5f5', '#e8f5e8'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            container.style.backgroundColor = randomColor;
        }
    </script>
</body>
</html>`
    },
    css: {
        name: 'CSS',
        extension: 'css',
        content: `/* CSS Template */

/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f4f4f4;
}

/* Container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
.header {
    background-color: #333;
    color: white;
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: #007bff;
}

/* Main content */
.main {
    margin-top: 80px;
    padding: 2rem 0;
}

/* Cards */
.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    margin: 1rem 0;
    transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

/* Buttons */
.btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    font-size: 1rem;
    transition: background-color 0.3s;
}

.btn:hover {
    background-color: #0056b3;
}

.btn-secondary {
    background-color: #6c757d;
}

.btn-secondary:hover {
    background-color: #545b62;
}

/* Grid system */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
}

/* Flexbox utilities */
.flex {
    display: flex;
}

.flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Text utilities */
.text-center {
    text-align: center;
}

.text-large {
    font-size: 1.25rem;
}

.text-small {
    font-size: 0.875rem;
}

/* Responsive design */
@media (max-width: 768px) {
    .nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-links {
        gap: 1rem;
    }
    
    .grid {
        grid-template-columns: 1fr;
    }
    
    .main {
        margin-top: 120px;
    }
}`
    },
    json: {
        name: 'JSON',
        extension: 'json',
        content: `{
  "name": "json-template",
  "version": "1.0.0",
  "description": "A sample JSON configuration file",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com",
    "website": "https://yourwebsite.com"
  },
  "config": {
    "theme": "dark",
    "language": "en",
    "features": {
      "autoSave": true,
      "syntaxHighlighting": true,
      "codeCompletion": true,
      "debugging": false
    },
    "editor": {
      "fontSize": 14,
      "fontFamily": "Consolas, monospace",
      "tabSize": 4,
      "wordWrap": true,
      "lineNumbers": true
    }
  },
  "supportedLanguages": [
    {
      "name": "JavaScript",
      "extensions": [".js", ".jsx"],
      "syntax": "javascript"
    },
    {
      "name": "Python",
      "extensions": [".py", ".pyw"],
      "syntax": "python"
    },
    {
      "name": "Java",
      "extensions": [".java"],
      "syntax": "java"
    },
    {
      "name": "C++",
      "extensions": [".cpp", ".cc", ".cxx"],
      "syntax": "cpp"
    },
    {
      "name": "HTML",
      "extensions": [".html", ".htm"],
      "syntax": "html"
    },
    {
      "name": "CSS",
      "extensions": [".css"],
      "syntax": "css"
    }
  ],
  "keybindings": {
    "save": "Ctrl+S",
    "open": "Ctrl+O",
    "new": "Ctrl+N",
    "find": "Ctrl+F",
    "replace": "Ctrl+H",
    "undo": "Ctrl+Z",
    "redo": "Ctrl+Y"
  },
  "plugins": [
    {
      "name": "Syntax Highlighter",
      "version": "2.1.0",
      "enabled": true
    },
    {
      "name": "Auto Complete",
      "version": "1.5.3",
      "enabled": true
    },
    {
      "name": "File Explorer",
      "version": "3.0.1",
      "enabled": true
    }
  ],
  "recentFiles": [
    "/path/to/file1.js",
    "/path/to/file2.py",
    "/path/to/file3.html"
  ],
  "metadata": {
    "created": "2025-08-10T10:00:00Z",
    "lastModified": "2025-08-10T12:30:00Z",
    "version": "1.0.0"
  }
}`
    }
};

// Initialize Monaco Editor
window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
        if (label === 'json') {
            return '../node_modules/monaco-editor/min/vs/language/json/json.worker.js';
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return '../node_modules/monaco-editor/min/vs/language/css/css.worker.js';
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return '../node_modules/monaco-editor/min/vs/language/html/html.worker.js';
        }
        if (label === 'typescript' || label === 'javascript') {
            return '../node_modules/monaco-editor/min/vs/language/typescript/ts.worker.js';
        }
        return '../node_modules/monaco-editor/min/vs/editor/editor.worker.js';
    }
};

require.config({ 
    paths: { 
        'vs': '../node_modules/monaco-editor/min/vs' 
    }
});

require(['vs/editor/editor.main'], function() {
    monaco = window.monaco;
    
    console.log('Monaco Editor loaded successfully');
    
    // Set dark theme
    monaco.editor.setTheme('vs-dark');
    
    // Initialize the welcome screen
    initializeApp();
}, function(error) {
    console.error('Failed to load Monaco Editor:', error);
    // Initialize app without Monaco for testing
    initializeApp();
});

function initializeApp() {
    // Add event listeners
    document.getElementById('new-file-btn').addEventListener('click', createNewFile);
    document.getElementById('open-file-btn').addEventListener('click', () => {
        // Trigger the main process to open file dialog
        // This would normally be handled by the menu
    });
    
    // Language button listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            createNewFileWithTemplate(lang);
        });
    });
    
    // Template download buttons
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.template-card');
            const lang = card.dataset.lang;
            downloadTemplate(lang);
        });
    });
    
    // Tab close functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-close')) {
            const tab = e.target.closest('.tab');
            const fileId = tab.dataset.file;
            closeFile(fileId);
        }
    });
    
    // Tab switching
    document.addEventListener('click', (e) => {
        if (e.target.closest('.tab') && !e.target.classList.contains('tab-close')) {
            const tab = e.target.closest('.tab');
            const fileId = tab.dataset.file;
            switchToFile(fileId);
        }
    });
}

function createNewFile() {
    console.log('Creating new file...');
    
    if (!monaco) {
        alert('Monaco Editor is not loaded yet. Please wait a moment and try again.');
        return;
    }
    
    const fileId = 'untitled-' + Date.now();
    const fileName = 'Untitled';
    
    try {
        createEditorTab(fileId, fileName, '', 'javascript');
        switchToFile(fileId);
        console.log('New file created successfully');
    } catch (error) {
        console.error('Error creating new file:', error);
        alert('Error creating new file: ' + error.message);
    }
}

function createNewFileWithTemplate(language) {
    console.log('Creating new file with template:', language);
    
    if (!monaco) {
        alert('Monaco Editor is not loaded yet. Please wait a moment and try again.');
        return;
    }
    
    const template = templates[language];
    if (!template) {
        console.error('Template not found for language:', language);
        return;
    }
    
    const fileId = 'untitled-' + Date.now();
    const fileName = `Untitled.${template.extension}`;
    
    try {
        createEditorTab(fileId, fileName, template.content, language);
        switchToFile(fileId);
        console.log('New file with template created successfully');
    } catch (error) {
        console.error('Error creating new file with template:', error);
        alert('Error creating new file: ' + error.message);
    }
}

function createEditorTab(fileId, fileName, content, language) {
    console.log('Creating editor tab for:', fileName);
    
    try {
        // Create tab
        const tabBar = document.getElementById('tab-bar');
        if (!tabBar) {
            throw new Error('Tab bar not found');
        }
        
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.dataset.file = fileId;
        tab.innerHTML = `
            <span class="tab-name">${fileName}</span>
            <span class="tab-close">&times;</span>
        `;
        tabBar.appendChild(tab);
        
        // Create editor pane
        const editorContainer = document.getElementById('editor-container');
        if (!editorContainer) {
            throw new Error('Editor container not found');
        }
        
        const editorPane = document.createElement('div');
        editorPane.className = 'editor-pane';
        editorPane.id = `editor-${fileId}`;
        editorContainer.appendChild(editorPane);
        
        // Create Monaco editor or fallback
        let editor;
        if (monaco && monaco.editor) {
            editor = monaco.editor.create(editorPane, {
                value: content,
                language: getMonacoLanguage(language),
                theme: 'vs-dark',
                automaticLayout: true,
                fontSize: 14,
                wordWrap: 'on',
                minimap: { enabled: true },
                scrollBeyondLastLine: false
            });
            console.log('Monaco editor created successfully');
        } else {
            // Fallback: create a simple textarea
            console.warn('Monaco editor not available, using fallback textarea');
            const textarea = document.createElement('textarea');
            textarea.value = content;
            textarea.style.width = '100%';
            textarea.style.height = '100%';
            textarea.style.border = 'none';
            textarea.style.outline = 'none';
            textarea.style.resize = 'none';
            textarea.style.backgroundColor = '#1e1e1e';
            textarea.style.color = '#d4d4d4';
            textarea.style.fontFamily = 'Consolas, monospace';
            textarea.style.fontSize = '14px';
            textarea.style.padding = '10px';
            editorPane.appendChild(textarea);
            
            // Create a simple editor-like object
            editor = {
                getValue: () => textarea.value,
                setValue: (value) => { textarea.value = value; },
                focus: () => textarea.focus(),
                onDidChangeModelContent: (callback) => {
                    textarea.addEventListener('input', callback);
                },
                dispose: () => {
                    if (textarea.parentNode) {
                        textarea.parentNode.removeChild(textarea);
                    }
                }
            };
        }
        
        // Store file info
        openFiles.set(fileId, {
            fileName: fileName,
            content: content,
            editor: editor,
            language: language,
            path: null,
            isDirty: false
        });
        
        // Add content change listener
        if (editor.onDidChangeModelContent) {
            editor.onDidChangeModelContent(() => {
                markFileDirty(fileId);
            });
        }
        
        console.log('Editor tab created successfully');
        
    } catch (error) {
        console.error('Error creating editor tab:', error);
        throw error;
    }
}

function getMonacoLanguage(lang) {
    const langMap = {
        'javascript': 'javascript',
        'python': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'csharp': 'csharp',
        'html': 'html',
        'css': 'css',
        'json': 'json'
    };
    return langMap[lang] || 'plaintext';
}

function switchToFile(fileId) {
    // Remove active class from all tabs and panes
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.editor-pane').forEach(pane => pane.classList.remove('active'));
    
    // Add active class to selected tab and pane
    const selectedTab = document.querySelector(`[data-file="${fileId}"]`);
    const selectedPane = document.getElementById(`editor-${fileId}`) || document.getElementById(fileId);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedPane) selectedPane.classList.add('active');
    
    activeFileId = fileId;
    
    // Focus editor if it exists
    const fileInfo = openFiles.get(fileId);
    if (fileInfo && fileInfo.editor) {
        fileInfo.editor.focus();
    }
}

function closeFile(fileId) {
    if (fileId === 'welcome') return; // Don't close welcome tab
    
    const tab = document.querySelector(`[data-file="${fileId}"]`);
    const pane = document.getElementById(`editor-${fileId}`);
    
    if (tab) tab.remove();
    if (pane) pane.remove();
    
    // Dispose editor
    const fileInfo = openFiles.get(fileId);
    if (fileInfo && fileInfo.editor) {
        fileInfo.editor.dispose();
    }
    
    openFiles.delete(fileId);
    
    // Switch to another tab if this was active
    if (activeFileId === fileId) {
        const remainingTabs = document.querySelectorAll('.tab');
        if (remainingTabs.length > 0) {
            const nextTab = remainingTabs[remainingTabs.length - 1];
            switchToFile(nextTab.dataset.file);
        }
    }
}

function markFileDirty(fileId) {
    const fileInfo = openFiles.get(fileId);
    if (fileInfo) {
        fileInfo.isDirty = true;
        const tab = document.querySelector(`[data-file="${fileId}"]`);
        const tabName = tab.querySelector('.tab-name');
        if (!tabName.textContent.startsWith('● ')) {
            tabName.textContent = '● ' + tabName.textContent;
        }
    }
}

function downloadTemplate(language) {
    const template = templates[language];
    if (!template) return;
    
    const blob = new Blob([template.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template.${template.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// IPC Event Listeners
ipcRenderer.on('menu-new-file', () => {
    createNewFile();
});

ipcRenderer.on('file-opened', (event, fileData) => {
    const fileId = 'file-' + Date.now();
    const language = detectLanguageFromExtension(fileData.name);
    
    createEditorTab(fileId, fileData.name, fileData.content, language);
    
    // Update file info with actual path
    const fileInfo = openFiles.get(fileId);
    if (fileInfo) {
        fileInfo.path = fileData.path;
        fileInfo.isDirty = false;
    }
    
    switchToFile(fileId);
});

ipcRenderer.on('menu-save-file', async () => {
    if (activeFileId && openFiles.has(activeFileId)) {
        const fileInfo = openFiles.get(activeFileId);
        const content = fileInfo.editor.getValue();
        
        const result = await ipcRenderer.invoke('save-file', {
            path: fileInfo.path,
            content: content
        });
        
        if (result.success) {
            fileInfo.isDirty = false;
            if (result.path) {
                fileInfo.path = result.path;
            }
            
            // Remove dirty indicator
            const tab = document.querySelector(`[data-file="${activeFileId}"]`);
            const tabName = tab.querySelector('.tab-name');
            tabName.textContent = tabName.textContent.replace('● ', '');
        }
    }
});

ipcRenderer.on('download-template', (event, language) => {
    downloadTemplate(language);
});

function detectLanguageFromExtension(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const extMap = {
        '.js': 'javascript',
        '.jsx': 'javascript',
        '.ts': 'typescript',
        '.tsx': 'typescript',
        '.py': 'python',
        '.java': 'java',
        '.cpp': 'cpp',
        '.cc': 'cpp',
        '.cxx': 'cpp',
        '.c': 'c',
        '.cs': 'csharp',
        '.html': 'html',
        '.htm': 'html',
        '.css': 'css',
        '.json': 'json',
        '.xml': 'xml',
        '.md': 'markdown',
        '.php': 'php',
        '.rb': 'ruby',
        '.go': 'go',
        '.rs': 'rust',
        '.swift': 'swift',
        '.kt': 'kotlin'
    };
    return extMap[ext] || 'plaintext';
}
