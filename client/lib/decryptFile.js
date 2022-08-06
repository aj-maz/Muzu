import LitJsSdk from "lit-js-sdk";

const decryptFile = (client) => async ({
  accessControlConditions,
  encryptedSymmetricKey,
  encryptedFile,
}) => {
    console.log('hi')
  const chain = process.env.NEXT_PUBLIC_TARGET_CHAIN;
  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
  const toDecrypt = LitJsSdk.uint8arrayToString(
    encryptedSymmetricKey,
    "base16"
  );
  const symmetricKey = await client.getEncryptionKey({
    accessControlConditions,
    toDecrypt,
    chain,
    authSig,
  });

  const decryptedFile = await LitJsSdk.decryptFile({
    file: encryptedFile,
    symmetricKey,
  });

  return decryptedFile;
};

export default decryptFile;
