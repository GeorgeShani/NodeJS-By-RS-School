/**
 * Manual pages for File Manager commands
 * Provides detailed information about available commands and their usage
 */

// Command documentation with descriptions, syntax, and examples
const commandDocs = {
  // Navigation commands
  up: {
    description: "Navigate up one directory level",
    syntax: "up",
    example: "up",
    details:
      "Moves to the parent directory of the current working directory. Cannot go above root directory.",
  },
  cd: {
    description: "Change current directory",
    syntax: "cd <path_to_directory>",
    example: "cd Documents",
    details:
      "Changes the current working directory to the specified path. Path can be absolute or relative.",
  },
  ls: {
    description: "List directory contents",
    syntax: "ls",
    example: "ls",
    details:
      "Displays a table with name, type, size, and last modified date of files and directories. Directories are listed first, followed by files, both sorted alphabetically.",
  },

  // File operations
  cat: {
    description: "Display file contents",
    syntax: "cat <path_to_file>",
    example: "cat example.txt",
    details:
      "Reads the content of the specified file and displays it in the console. Uses Readable stream for efficient reading.",
  },
  add: {
    description: "Create a new empty file",
    syntax: "add <new_file_name>",
    example: "add newfile.txt",
    details:
      "Creates a new empty file with the specified name in the current working directory.",
  },
  mkdir: {
    description: "Create a new directory",
    syntax: "mkdir <new_directory_name>",
    example: "mkdir new_folder",
    details:
      "Creates a new directory with the specified name in the current working directory.",
  },
  rn: {
    description: "Rename a file",
    syntax: "rn <path_to_file> <new_filename>",
    example: "rn old.txt new.txt",
    details:
      "Renames the specified file to the new filename. The file content remains unchanged.",
  },
  cp: {
    description: "Copy a file",
    syntax: "cp <path_to_file> <path_to_new_directory>",
    example: "cp file.txt backups/",
    details:
      "Copies the specified file to the target directory. Uses Readable and Writable streams for efficient copying.",
  },
  mv: {
    description: "Move a file",
    syntax: "mv <path_to_file> <path_to_new_directory>",
    example: "mv file.txt archive/",
    details:
      "Moves the specified file to the target directory. The file is copied to the new location and deleted from the original location.",
  },
  rm: {
    description: "Remove a file",
    syntax: "rm <path_to_file>",
    example: "rm file.txt",
    details: "Deletes the specified file from the file system.",
  },

  // OS information
  os: {
    description: "Display operating system information",
    syntax: "os <option>",
    example: "os --cpus",
    details:
      "Displays information about the operating system. Available options:\n" +
      "  --EOL: Display End-Of-Line character\n" +
      "  --cpus: Display CPU information (count, model, clock rate)\n" +
      "  --homedir: Display home directory path\n" +
      "  --username: Display current system username\n" +
      "  --architecture: Display CPU architecture",
  },

  // Hash calculation
  hash: {
    description: "Calculate file hash",
    syntax: "hash <path_to_file>",
    example: "hash document.pdf",
    details: "Calculates and displays the SHA-256 hash of the specified file.",
  },

  // Compression
  compress: {
    description: "Compress a file using Brotli algorithm",
    syntax: "compress <path_to_file> <path_to_destination>",
    example: "compress large.txt compressed.br",
    details:
      "Compresses the source file using the Brotli algorithm and saves it to the destination path. Uses Streams API for efficiency.",
  },
  decompress: {
    description: "Decompress a Brotli-compressed file",
    syntax: "decompress <path_to_file> <path_to_destination>",
    example: "decompress compressed.br extracted.txt",
    details:
      "Decompresses the Brotli-compressed file and saves it to the destination path. Uses Streams API for efficiency.",
  },

  // Help/exit commands
  man: {
    description: "Display manual pages for commands",
    syntax: "man [command]",
    example: "man cp",
    details:
      "Without arguments, lists all available commands. With a command name, displays detailed information about that specific command.",
  },
  ".exit": {
    description: "Exit the File Manager",
    syntax: ".exit",
    example: ".exit",
    details:
      "Terminates the File Manager application and displays a goodbye message.",
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
    console.log("up                 - Navigate up one directory level");
    console.log("cd <path>          - Change current directory");
    console.log("ls                 - List directory contents");

    console.log("\n-- File Operations --");
    console.log("cat <file>         - Display file contents");
    console.log("add <file>         - Create a new empty file");
    console.log("mkdir <dir>        - Create a new directory");
    console.log("rn <file> <new>    - Rename a file");
    console.log("cp <file> <dir>    - Copy a file to directory");
    console.log("mv <file> <dir>    - Move a file to directory");
    console.log("rm <file>          - Remove a file");

    console.log("\n-- OS Information --");
    console.log("os --EOL           - Display End-Of-Line character");
    console.log("os --cpus          - Display CPU information");
    console.log("os --homedir       - Display home directory path");
    console.log("os --username      - Display system username");
    console.log("os --architecture  - Display CPU architecture");

    console.log("\n-- Other Utilities --");
    console.log("hash <file>        - Calculate file hash (SHA-256)");
    console.log("compress <src> <dst>    - Compress file using Brotli");
    console.log("decompress <src> <dst>  - Decompress Brotli file");
    console.log(
      "man [command]      - Display this help or specific command help"
    );
    console.log(".exit              - Exit the File Manager");

    console.log(
      "\nFor detailed information about a command, type: man <command>"
    );
    console.log("================================================\n");
  } catch (error) {
    console.log("Failed to display manual");
  }
};

export { showManual };
