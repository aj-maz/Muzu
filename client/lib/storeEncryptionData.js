import { upload, uploadFile } from "./web3StorageHelper";
import { Decodeuint8arr } from "./uint8";

export default (client) =>
  async ({
    accessControlConditions,
    encryptedSymmetricKey,
    encryptedString,
    encryptedFile,
  }) => {
    try {
      let es, ef, result;
      const acc = await upload(JSON.stringify(accessControlConditions));
      const esk = await upload(Decodeuint8arr(encryptedSymmetricKey));
      if (encryptedString) {
        es = await uploadFile(encryptedString);
      } else {
        ef = await uploadFile(encryptedFile);
      }

      if (es) {
        result = await upload({
          accessControlConditions: acc,
          encryptedSymmetricKey: esk,
          encryptedString: es,
        });
      } else {
        result = await upload({
          accessControlConditions: acc,
          encryptedSymmetricKey: esk,
          encryptedFile: ef,
        });
      }

      return result;
    } catch (err) {
      console.log(err);
    }
  };
