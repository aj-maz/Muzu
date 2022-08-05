import axios from "axios";

const upload = (data: object) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGYzNTQwOTM5OGMwNTVGYTc3OTk4ODRFZWU0NWEwQjVjZTFCREE4OEYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzcxOTUyNDE3MzAsIm5hbWUiOiJmcmVlLWZpbGUtc3RvcmUifQ.JL3F5ls1L7ErT3PGEWfw-O9ytJOG84PfFS8Ar98G9f4";
  var config = {
    method: "post",
    url: "https://api.web3.storage/upload",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    data: data,
  };

  return new Promise((resolve, reject) => {
    axios(config)
      .then((response) => {
        return resolve(response.data.cid);
      })
      .catch((error) => {
        return reject(error);
      });
  });
};

const uploadFile = (file: File) => {
  var data = file;

  var config = {
    method: "post",
    url: "https://api.nft.storage/upload",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVDRGQzZkMxOEEyMUVGYzNBRTNBNDUzRDFCRDkxYzUxNWYwRjgxRDUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0Mjk4OTY1NzM4MiwibmFtZSI6IlNwYXJkYSJ9.C2T_35hw4Yycqspgp3cHygOyuX_Pk1OTWDUGQ8RAadY",
      "Content-Type": "text/plain",
    },
    data: data,
  };

  return new Promise((resolve, reject) => {
    return axios(config)
      .then(function (response) {
        if (response.data.ok) {
          return resolve(response.data.value.cid);
        }
      })
      .catch(function (error) {
        return reject(error);
      });
  });
};

export { uploadFile, upload };
