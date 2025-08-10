# Desktop IDE

A modern desktop IDE application similar to VS Code, built with Electron and Monaco Editor. Features multi-language support and downloadable code templates.

## Features

- **Multi-language Support**: JavaScript, Python, Java, C++, C#, HTML, CSS, JSON
- **Code Editor**: Powered by Monaco Editor (same engine as VS Code)
- **Syntax Highlighting**: Full syntax highlighting for all supported languages
- **File Management**: Open, save, and manage multiple files with tabs
- **Template Downloads**: Download starter templates for any supported language
- **Dark Theme**: Professional dark theme interface
- **Cross-platform**: Runs on Windows, macOS, and Linux

## Screenshots

The IDE features a clean, modern interface with:
- File explorer sidebar
- Tabbed editor interface
- Language template buttons
- Welcome screen with quick actions

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Running the Application

To start the development version:

```bash
npm start
```

To run in debug mode:

```bash
npm run dev
```

### Building for Distribution

To build the application for your platform:

```bash
npm run build
```

To create a distributable package:

```bash
npm run dist
```

## Usage

### Opening Files

- Use **File > Open File** from the menu
- Click **Open File** on the welcome screen
- Use the keyboard shortcut `Ctrl+O` (Windows/Linux) or `Cmd+O` (macOS)

### Creating New Files

- Use **File > New File** from the menu
- Click **New File** on the welcome screen
- Use the keyboard shortcut `Ctrl+N` (Windows/Linux) or `Cmd+N` (macOS)
- Click any language button in the sidebar to create a file with a template

### Saving Files

- Use **File > Save** from the menu
- Use the keyboard shortcut `Ctrl+S` (Windows/Linux) or `Cmd+S` (macOS)

### Downloading Templates

You can download starter templates for any supported language:

1. Go to **Languages** menu and select a language template
2. Click the **Download Template** button on any language card in the welcome screen
3. Use the language buttons in the sidebar

## Supported Languages

- **JavaScript**: Modern ES6+ syntax with examples
- **Python**: Python 3 syntax with common patterns
- **Java**: Object-oriented Java with class examples
- **C++**: Modern C++ with STL usage
- **C#**: .NET compatible C# code
- **HTML**: Complete HTML5 template with CSS and JavaScript
- **CSS**: Modern CSS with flexbox and grid examples
- **JSON**: Structured configuration examples

## Project Structure

```
src/
├── main.js          # Electron main process
├── index.html       # Main application window
├── renderer.js      # Renderer process (UI logic)
└── styles.css       # Application styles

assets/              # Application icons and assets
package.json         # Project configuration and dependencies
```

## Technologies Used

- **Electron**: Desktop application framework
- **Monaco Editor**: Code editor component
- **Node.js**: JavaScript runtime
- **HTML5/CSS3**: User interface
- **JavaScript ES6+**: Application logic

## Development

### Project Setup

1. The main Electron process is in `src/main.js`
2. The renderer process (UI) is in `src/renderer.js`
3. Styles are in `src/styles.css`
4. The main window is defined in `src/index.html`

### Adding New Languages

To add support for a new language:

1. Add the language template to the `templates` object in `renderer.js`
2. Update the `getMonacoLanguage()` function to map your language
3. Add the language to the file filters in `main.js`
4. Update the UI to include the new language option

### Customizing the Theme

The application uses a VS Code-inspired dark theme. You can customize colors in `src/styles.css`:

- Background colors: `#1e1e1e`, `#252526`, `#2d2d30`
- Text colors: `#d4d4d4`, `#cccccc`, `#ffffff`
- Accent color: `#0e639c`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the package.json file for details.

## Acknowledgments

- **Monaco Editor** by Microsoft for the excellent code editor
- **Electron** team for the desktop application framework
- **VS Code** for design inspiration
