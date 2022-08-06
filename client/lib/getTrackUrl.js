import fetchEncryptionData from "./fetchEncryptionData";
import decryptFile from "./decryptFile";

export default (client) => async (cid, name) => {
  const fetchedData = await fetchEncryptionData(cid);

  const decryptedFile = await decryptFile(client)(fetchedData);

  const arrayBufferToFile = (buffer, filename) => {
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    return new File([blob], filename, { type: "application/octet-stream" });
  };

  const url = URL.createObjectURL(arrayBufferToFile(decryptedFile, name));
  return url;
};
