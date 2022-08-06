import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { ApolloProvider } from "@apollo/client";
import client from "../lib/apolloClient";

function getLibrary(provider: any) {
  const target = new ethers.providers.Web3Provider(provider);
  return target;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Component {...pageProps} />
      </Web3ReactProvider>
    </ApolloProvider>
  );
}

export default MyApp;
