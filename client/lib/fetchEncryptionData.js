import axios from "axios";

import { Encodeuint8arr } from "./uint8";

export default async (cid) => {
  try {
    let rootData;

    if (localStorage.getItem(cid)) {
      rootData = JSON.parse(localStorage.getItem(cid));
    } else {
      rootData = (await axios.get(`https://ipfs.io/ipfs/${cid}`)).data;
      localStorage.setItem(cid, JSON.stringify(rootData));
    }

    let accessControlConditions;

    if (localStorage.getItem(rootData.accessControlConditions)) {
      accessControlConditions = JSON.parse(
        localStorage.getItem(rootData.accessControlConditions)
      );
    } else {
      accessControlConditions = (
        await axios.get(
          `https://ipfs.io/ipfs/${rootData.accessControlConditions}`
        )
      ).data;
      localStorage.setItem(
        rootData.accessControlConditions,
        JSON.stringify(accessControlConditions)
      );
    }

    let encryptedSymmetricKey;

    if (localStorage.getItem(rootData.encryptedSymmetricKey)) {
      encryptedSymmetricKey = JSON.parse(
        localStorage.getItem(rootData.encryptedSymmetricKey)
      );
    } else {
      encryptedSymmetricKey = (
        await axios.get(
          `https://ipfs.io/ipfs/${rootData.encryptedSymmetricKey}`
        )
      ).data;
      localStorage.setItem(
        rootData.encryptedSymmetricKey,
        JSON.stringify(encryptedSymmetricKey)
      );
    }

    let encryptedString, encryptedFile;

    if (rootData.encryptedString) {
      encryptedString = (
        await axios.get(`https://ipfs.io/ipfs/${rootData.encryptedString}`, {
          responseType: "blob",
        })
      ).data;
    } else {
      encryptedFile = (
        await axios.get(`https://ipfs.io/ipfs/${rootData.encryptedFile}`, {
          responseType: "blob",
        })
      ).data;
    }

    if (encryptedString) {
      return {
        accessControlConditions,
        encryptedSymmetricKey: Encodeuint8arr(encryptedSymmetricKey),
        encryptedString,
      };
    } else {
      return {
        accessControlConditions,
        encryptedSymmetricKey: Encodeuint8arr(encryptedSymmetricKey),
        encryptedFile,
      };
    }
  } catch (err) {
    console.log(err);
  }
};
