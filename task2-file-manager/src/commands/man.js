/**
 * Manual pages for File Manager commands
 * Displays helpful information about all supported commands and their usage
 */

// Command documentation with descriptions, syntax, and examples
const commandDocs = {
  // Navigation commands
  up: {
    description: "Move up one directory level",
    syntax: "up",
    example: "up",
    details:
      "Navigates to the parent of the current working directory. You cannot move above the root directory.",
  },
  cd: {
    description: "Change the current directory",
    syntax: "cd <path_to_directory>",
    example: "cd Documents",
    details:
      "Changes your working directory to the given path. The path may be absolute or relative.",
  },
  ls: {
    description: "List contents of the current directory",
    syntax: "ls",
    example: "ls",
    details:
      "Displays a table with name, type, size, and last modified date. Lists directories first, followed by files, sorted alphabetically.",
  },

  // File operations
  cat: {
    description: "Read and display a file's content",
    syntax: "cat <path_to_file>",
    example: "cat example.txt",
    details:
      "Outputs the contents of a file to the console using a readable stream.",
  },
  add: {
    description: "Create an empty file",
    syntax: "add <new_file_name>",
    example: "add newfile.txt",
    details:
      "Creates a new, empty file in your current working directory with the specified name.",
  },
  mkdir: {
    description: "Create a new directory",
    syntax: "mkdir <new_directory_name>",
    example: "mkdir new_folder",
    details:
      "Creates a new directory inside the current working directory with the given name.",
  },
  rn: {
    description: "Rename an existing file",
    syntax: "rn <path_to_file> <new_filename>",
    example: "rn old.txt new.txt",
    details:
      "Renames a file without altering its content. The new name is applied in the same location.",
  },
  cp: {
    description: "Copy a file to a new location",
    syntax: "cp <path_to_file> <path_to_new_directory>",
    example: "cp file.txt backups/",
    details:
      "Copies a file to the specified directory using readable and writable streams for better performance.",
  },
  mv: {
    description: "Move a file to a new location",
    syntax: "mv <path_to_file> <path_to_new_directory>",
    example: "mv file.txt archive/",
    details:
      "Transfers a file to the new directory by copying it first, then deleting it from the original location.",
  },
  rm: {
    description: "Delete a file",
    syntax: "rm <path_to_file>",
    example: "rm file.txt",
    details: "Removes the specified file permanently from the file system.",
  },

  // OS information
  os: {
    description: "Show system-related information",
    syntax: "os <option>",
    example: "os --cpus",
    details:
      "Displays system info based on the option provided:\n" +
      "  --EOL: Show the End-Of-Line marker used by your OS\n" +
      "  --cpus: List CPU model, speed, and core count\n" +
      "  --homedir: Display the current user's home directory\n" +
      "  --username: Show your system username\n" +
      "  --architecture: Print the CPU architecture (e.g., x64)",
  },

  // Hash calculation
  hash: {
    description: "Generate SHA-256 hash of a file",
    syntax: "hash <path_to_file>",
    example: "hash document.pdf",
    details:
      "Calculates the SHA-256 cryptographic hash of the provided file and outputs it to the console.",
  },

  // Compression
  compress: {
    description: "Compress a file using Brotli",
    syntax: "compress <path_to_file> <path_to_destination>",
    example: "compress large.txt compressed.br",
    details:
      "Compresses a file using the Brotli algorithm and saves the result to the specified destination using streams.",
  },
  decompress: {
    description: "Decompress a Brotli-compressed file",
    syntax: "decompress <path_to_file> <path_to_destination>",
    example: "decompress compressed.br extracted.txt",
    details:
      "Uncompresses a Brotli file and writes the output to the destination. Uses stream processing for performance.",
  },

  // Help/exit commands
  man: {
    description: "Display the help manual",
    syntax: "man [command]",
    example: "man cp",
    details:
      "Without arguments, lists all available commands. Provide a command name to get detailed help on it.",
  },
  ".exit": {
    description: "Exit the File Manager",
    syntax: ".exit",
    example: ".exit",
    details:
      "Safely closes the File Manager session and displays a farewell message.",
  },
  clear: {
    description: "Clear the terminal screen",
    syntax: "clear",
    example: "clear",
    details:
      "Clears all output from the terminal and resets the prompt position.",
  },
};

// Display manual information for all commands or a specific command
const showManual = (commandName) => {
  try {
    // If a specific command is requested
    if (commandName && commandName !== "man") {
      if (commandDocs[commandName]) {
        const cmd = commandDocs[commandName];
        console.log("\n=== Command Manual ===");
        console.log(`Command: ${commandName}`);
        console.log(`Description: ${cmd.description}`);
        console.log(`Syntax: ${cmd.syntax}`);
        console.log(`Example: ${cmd.example}`);
        console.log(`Details: ${cmd.details}`);
        console.log("=====================\n");
      } else {
        console.log(`No manual entry for '${commandName}'`);
      }

      return;
    }

    // If no specific command is provided, show all commands with brief descriptions
    console.log("\n=== File Manager Commands ===");

    console.log("\n-- Navigation --");
    console.log("up                 - Move up one directory level");
    console.log("cd <path>          - Change current working directory");
    console.log("ls                 - List contents of the current directory");

    console.log("\n-- File Operations --");
    console.log("cat <file>         - Read and display a file");
    console.log("add <file>         - Create a new empty file");
    console.log("mkdir <dir>        - Make a new directory");
    console.log("rn <file> <new>    - Rename a file");
    console.log("cp <file> <dir>    - Copy a file to a directory");
    console.log("mv <file> <dir>    - Move a file to a directory");
    console.log("rm <file>          - Delete a file");

    console.log("\n-- OS Information --");
    console.log("os --EOL           - Show End-Of-Line character");
    console.log("os --cpus          - Show CPU details");
    console.log("os --homedir       - Show your home directory");
    console.log("os --username      - Show current user");
    console.log("os --architecture  - Show CPU architecture");

    console.log("\n-- Other Utilities --");
    console.log("hash <file>        - Generate SHA-256 hash of file");
    console.log("compress <src> <dst>    - Compress file with Brotli");
    console.log("decompress <src> <dst>  - Decompress Brotli file");
    console.log("man [command]      - Show help for all or specific command");
    console.log("clear              - Clear the terminal screen");
    console.log(".exit              - Exit the File Manager");

    console.log(
      "\n📘 For detailed help about a specific command, type: man <command>"
    );
    console.log("================================================\n");
  } catch (error) {
    console.log("Failed to display manual");
  }
};

export { showManual };
