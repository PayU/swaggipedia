const { SECRETS_FILE_PATH } = process.env;

function loadSecretsFile(): Record<string, string> {
  try {
    return require(SECRETS_FILE_PATH);
  } catch (err) {
    console.error(err, 'Failed to load secrets file');
    process.exit(1);
  }
}

const loadSecretsIfNeeded = (): void => {
  if (SECRETS_FILE_PATH) {
    console.error('Loading secrets');
    const { DATABASE_USERNAME, DATABASE_PASSWORD } = loadSecretsFile();

    Object.assign(process.env, {
      DATABASE_USERNAME,
      DATABASE_PASSWORD,
    });
  }
};

export default loadSecretsIfNeeded;
