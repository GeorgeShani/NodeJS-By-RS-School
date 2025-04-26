const parseArgs = () => {
  // Get command line arguments (skip first two elements which are node and script path)
  const args = process.argv.slice(2);

  // Parse the arguments into key-value pairs
  const parsedArgs = {};
  for (let i = 0; i < args.length; i += 2) {
    // Get property name by removing the leading '--'
    const propName = args[i].substring(2);

    // Get the value (assuming it exists)
    const value = args[i + 1];

    parsedArgs[propName] = value;
  }

  // Build the output string
  let output = "";
  const entries = Object.entries(parsedArgs);

  entries.forEach(([key, value], index) => {
    output += `${key} is ${value}`;
    if (index < entries.length - 1) {
      output += ", ";
    }
  });

  // Print the result
  console.log(output);
};

parseArgs();