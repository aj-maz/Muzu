import LitJsSdk from "lit-js-sdk";
import StoreEncryptionData from "./storeEncryptionData";
import ConditionCreator from "./ConditionCreator";

const encryptFile = async (client, file) => {

  const chain = process.env.NEXT_PUBLIC_TARGET_CHAIN;

  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });

  const accessControlConditions = ConditionCreator();

  const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({
    file,
  });

  const encryptedSymmetricKey = await client.saveEncryptionKey({
    accessControlConditions,
    symmetricKey,
    authSig,
    chain,
  });

  const rootCid = await StoreEncryptionData({
    accessControlConditions,
    encryptedSymmetricKey,
    encryptedFile,
  });

  return rootCid;
};

export default encryptFile;
