const parseEnv = () => {
  // Get all environment variables
  const envVars = process.env;

  // Filter for only RSS_ prefixed variables
  const rssVars = {};
  for (const [key, value] of Object.entries(envVars)) {
    if (key.startsWith("RSS_")) {
      rssVars[key] = value;
    }
  }

  // Build the output string
  let output = "";
  const entries = Object.entries(rssVars);

  entries.forEach(([key, value], index) => {
    output += `${key}=${value}`;
    if (index < entries.length - 1) {
      output += "; ";
    }
  });

  // Print the result
  console.log(output);
};

parseEnv();