const environmentVariables = ["APP_NAME", "API_PORT", "INPUT_FOLDER", "OUTPUT_FOLDER", "MAGMA"];

function validateEnvironment() {
  for (const key of environmentVariables) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}.`);
    }
  }
}

module.exports = { validateEnvironment };
