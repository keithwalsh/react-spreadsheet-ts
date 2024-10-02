import fs from "fs";
import path from "path";
import ignore from "ignore";
import chalk from "chalk";

// Function to generate a directory tree structure
function generateTree(dirPath, level = 0, ig) {
    const indent = "│   ".repeat(level);
    let items;

    try {
        items = fs.readdirSync(dirPath).sort((a, b) => {
            const aPath = path.join(dirPath, a);
            const bPath = path.join(dirPath, b);
            const aIsDir = fs.lstatSync(aPath).isDirectory();
            const bIsDir = fs.lstatSync(bPath).isDirectory();

            if (aIsDir && !bIsDir) return -1; // Directories first
            if (!aIsDir && bIsDir) return 1; // Directories first
            return a.localeCompare(b); // Alphabetical order
        });
    } catch (error) {
        console.error(chalk.red(`Error reading directory: ${dirPath}`));
        return;
    }

    items.forEach((item, index) => {
        const fullPath = path.join(dirPath, item);
        let relativePath = path.relative(process.cwd(), fullPath);
        let isDirectory;

        try {
            isDirectory = fs.lstatSync(fullPath).isDirectory();
        } catch (error) {
            console.error(chalk.red(`Error accessing: ${fullPath}`));
            return;
        }

        // Append '/' for directories to match ignore patterns like 'coverage/'
        const pathToCheck = isDirectory ? `${relativePath}/` : relativePath;

        // Skip ignored paths
        if (ig.ignores(pathToCheck)) {
            return;
        }

        const isLastItem = index === items.length - 1;
        const pointer = isLastItem ? "└── " : "├── ";
        const connector = isLastItem ? "    " : "│   ";

        // Apply colors using chalk
        const itemName = isDirectory ? chalk.blue(item) : chalk.green(item);
        console.log(indent + pointer + itemName);

        if (isDirectory) {
            generateTree(fullPath, level + 1, ig);
        }
    });
}

// Function to set up ignore patterns
function setupIgnore(additionalExclusions = []) {
    const gitignoreFile = path.join(process.cwd(), ".gitignore");
    const ig = ignore();

    if (fs.existsSync(gitignoreFile)) {
        const gitignoreContent = fs.readFileSync(gitignoreFile, "utf8");
        ig.add(gitignoreContent);
    }

    if (additionalExclusions.length > 0) {
        ig.add(additionalExclusions);
    }

    return ig;
}

// Main function
function generateProjectTree() {
    // Define additional folders and files to exclude
    const additionalExclusions = ["coverage/", ".git/", "project-tree.mjs", "storybook-static/"];

    const ig = setupIgnore(additionalExclusions);

    // Print the root directory name in bold
    console.log(chalk.bold(path.basename(process.cwd())));

    // Start generating the tree from the current working directory
    generateTree(process.cwd(), 0, ig);
}

// Run the program
generateProjectTree();
