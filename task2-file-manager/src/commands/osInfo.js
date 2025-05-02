import os from "os";

// Get and display OS information
const getOSInfo = (flag) => {
  try {
    switch (flag) {
      case "--EOL":
        console.log(`EOL character on this OS: [${JSON.stringify(os.EOL)}]`);
        break;
      case "--cpus":
        const cpus = os.cpus();
        console.log(`Total CPUs: ${cpus.length}`);
        cpus.forEach((cpu, index) => {
          console.log(`CPU ${index + 1}: ${cpu.model} (${(cpu.speed / 1000).toFixed(2)} GHz)`);
        });
        break;
      case "--homedir":
        console.log(`Home directory: ${os.homedir()}`);
        break;
      case "--username":
        console.log(`System Username: ${os.userInfo().username}`);
        break;
      case "--architecture":
        console.log(`CPU Architecture: ${process.arch}`);
        break;
      default:
        throw new Error("Invalid OS info parameter");
    }
  } catch (error) {
    throw new Error("Failed to get OS info");
  }
};

export { getOSInfo };