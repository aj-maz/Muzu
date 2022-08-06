import { createContext, useState, useEffect } from "react";
import LitJsSdk from "lit-js-sdk";

export const LitContext = createContext({});

export const LitProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const connector = async () => {
      setLoading(true);

      const cli = new LitJsSdk.LitNodeClient({ debug: false });
      try {
        await cli.connect();
        setLoading(false);
        setClient(cli);
      } catch (e) {
        setLoading(false);
        console.error(e);
      }
    };

    connector();
  }, []);

  return (
    <LitContext.Provider value={{ loading, client }}>
      {children}
    </LitContext.Provider>
  );
};
