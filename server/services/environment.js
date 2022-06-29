const environmentVariables = ["APP_NAME", "API_PORT", "INPUT_FOLDER", "OUTPUT_FOLDER", "MAGMA", "DATA_BUCKET"];

export function validateEnvironment(requiredVariables = environmentVariables) {
  for (const key of requiredVariables) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}.`);
    }
  }
}
