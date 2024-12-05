function catchErrorMessage(message: string, error: unknown) {
  if (error instanceof Error) {
    console.log(`[server]: ${message}: ${error.message}`);
  } else {
    console.log(`[server]: ${message}`);
  }
}

export default catchErrorMessage;
