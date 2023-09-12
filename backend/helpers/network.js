const os = require("os");
// Get network interfaces
const networkInterfaces = os.networkInterfaces();

// Find the IPv4 address
let ipAddress;
for (const interfaceName in networkInterfaces) {
  const interfaceData = networkInterfaces[interfaceName];
  for (const iface of interfaceData) {
    if (iface.family === "IPv4" && !iface.internal) {
      ipAddress = iface.address;
      break;
    }
  }
  if (ipAddress) {
    break;
  }
}

module.exports = {
  ipAddress,
};
