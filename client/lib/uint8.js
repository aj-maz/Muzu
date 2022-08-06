export const Decodeuint8arr = (uint8array) => {
  return JSON.stringify(uint8array);
};

export const Encodeuint8arr = (myString) => {
  return Uint8Array.from(Object.values(myString));
};
