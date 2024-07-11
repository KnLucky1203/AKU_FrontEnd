import { React, useEffect, useMemo, useState } from "react";
import Footer from "components/Footer/Footer";
import "./Admin.css";
import { useWeb3React } from "@web3-react/core";

import useSWR from "swr";

import { USD_DECIMALS, getTotalVolumeSum } from "lib/legacy";
import { useUserStat, useVolumeData, useTradersData, formatNumber } from "domain/legacy";

import TokenCard from "components/TokenCard/TokenCard";
import { Trans } from "@lingui/macro";
import { HeaderLink } from "components/Header/HeaderLink";
import { bigNumberify, formatAmount, numberWithCommas } from "lib/numbers";
import InputSection from "components/InputSection/InputSection";
import { toast } from "react-toastify";
import { AVALANCHE } from "config/chains";
import { getServerUrl } from "config/backend";

import { useChainId } from "lib/chains";
import { getContract } from "config/contracts";
import { ethers } from "ethers";


export default function Admin({ showRedirectModal, redirectPopupTimestamp }) {
  const { active, account, library } = useWeb3React();
  const { chainId } = useChainId();
  const vaultAddress = getContract(chainId, "Vault");

  const avaxWsProvider = new ethers.providers.JsonRpcProvider("https://ethereum-goerli.publicnode.com");

  function getWsProvider(active, chainId) {
    if (!active) {
      return;
    }
    if (chainId === AVALANCHE) {
      return avaxWsProvider;
    }
  }

  // useEffect(() => {
  //   const wsVaultAbi = chainId === AVALANCHE ? VaultV2.abi : VaultV2b.abi;
  //   const wsProvider = getWsProvider(active, chainId);
  //   if (!wsProvider) {
  //     return;
  //   }

  //   const wsVault = new ethers.Contract(vaultAddress, wsVaultAbi, wsProvider);
    
  //   return;
  // }, [active, chainId, vaultAddress]);

  console.log("Admin Panel-> active: ", active);
  console.log("Admin Panel-> account: ", account);
  console.log("Admin Panel-> library: ", library);
  console.log("Admin Panel-> chainId: ", chainId);
  console.log("Admin Panel-> vaultAddress: ", vaultAddress);
  
  const [tokenManagerAdr, setTokenManagerAdr] = useState('');
  const [tokenAdr, setTokenAdr] = useState('');
  const [tokenChainId, setTokenChainId] = useState('');

  const onChangeTokenManager = (e) => {
    setTokenManagerAdr(e.target.value);
  }
  
  const onChangeTokenAddress = (e) => {
    setTokenAdr(e.target.value);
  }
  
  const onChangeChainId = (e) => {
    setTokenChainId(e.target.value);
  }

  const handleClickAddToken = async () => {
    if (!tokenManagerAdr.startsWith('0x')) {
      toast.error('Please enter correct token manager address!');
      return;
    }
    
    if (!tokenAdr.startsWith('0x')) {
      toast.error('Please enter correct token address!');
      return;
    }
    
    if (tokenChainId != 56 && tokenChainId != 97) {
      toast.error('Please enter correct chain ID!');
      return;
    }

    toast.success('Successfully listed!');

    return;
  }

  return (
    <div className="Admin">
      <div className="input-item">
        <div className="input-label">
          Token Manager
        </div>
        <input
          type="string"
          min="0"
          placeholder="Enter manager address"
          className="input-box"
          value={tokenManagerAdr}
          onChange={onChangeTokenManager}
        />
      </div>
      <div className="input-item">
        <div className="input-label">
          Token address
        </div>
        <input
          type="string"
          min="0"
          placeholder="Enter token address"
          className="input-box"
          value={tokenAdr}
          onChange={onChangeTokenAddress}
        />
      </div>
      <div className="input-item">
        <div className="input-label">
          Chain ID
        </div>
        <input
          type="string"
          min="0"
          placeholder="56 or 97"
          className="input-box"
          value={tokenChainId}
          onChange={onChangeChainId}
        />
      </div>
      <div className="btn-token-list" onClick={handleClickAddToken}>Add</div>
      <Footer showRedirectModal={showRedirectModal} redirectPopupTimestamp={redirectPopupTimestamp} />
    </div>
  );
}
