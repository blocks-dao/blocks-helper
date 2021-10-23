import React, { useState, useRef, useEffect } from 'react';
import { IonButton, IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import './ExploreContainer.css';

declare const window: any;

interface ContainerProps { }

const ExploreContainer: React.FC<ContainerProps> = () => {

  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState("");

  const addBlocksToMetamask = async () => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }], // chainId must be in hexadecimal numbers
    }).then((res:any) =>{
      window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: '0x8a6d4c8735371ebaf8874fbd518b56edd66024eb',
            symbol: 'BLOCKS',
            decimals: 18,
            image: 'https://ipfs.io/ipfs/QmRTDA6Z8ggARb1jAC4F6T3oa2hwAGi59Myc7oe8xd94Gk?filename=Blocks%20Etherscan%20Logo.png',
          },
        },
      })
      .then((success:any) => {
        if (success) {
          console.log('BLOCKS successfully added to wallet!')
        } else {
          throw new Error('Something went wrong.')
        }
      })
      .catch(console.error)
    });
  }

  const addBlocksToMetamaskXdai = async () => {    
    try {
      // check if the chain to connect to is installed
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x64' }], // chainId must be in hexadecimal numbers
      }).then((res:any) =>{
        window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: '0x1a4ea432e58bff38873af87bf68c525eb402aa1d',
              symbol: 'BLOCKS',
              decimals: 18,
              image: "https://ipfs.io/ipfs/QmRTDA6Z8ggARb1jAC4F6T3oa2hwAGi59Myc7oe8xd94Gk?filename=blocks-logo.png"
            },
          },
        })
        .then((success:any) => {
          if (success) {
            console.log('BLOCKS successfully added to wallet!')
          } else {
            throw new Error('Something went wrong.')
          }
        })
        .catch(console.error)
      })
    } catch (error:any) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then install it into the user MetaMask
      if (error.code === 4902) {
        try {
          const change = await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: "0x64",
              chainName: "xDAI Chain",
              rpcUrls: [
                  "https://rpc.xdaichain.com"
              ],
              iconUrls: [
                  "https://gblobscdn.gitbook.com/spaces%2F-Lpi9AHj62wscNlQjI-l%2Favatar.png"
              ],
              nativeCurrency: {
                  "name": "xDAI",
                  "symbol": "xDAI",
                  "decimals": 18
              },
              blockExplorerUrls: [
                  "https://blockscout.com/xdai/mainnet/"
              ]
            }],
          });
          if(change){
            window.ethereum.request({
              method: 'wallet_watchAsset',
              params: {
                type: 'ERC20',
                options: {
                  address: '0x1a4ea432e58bff38873af87bf68c525eb402aa1d',
                  symbol: 'BLOCKS',
                  decimals: 18,
                  image: "https://ipfs.io/ipfs/QmRTDA6Z8ggARb1jAC4F6T3oa2hwAGi59Myc7oe8xd94Gk?filename=blocks-logo.png",
                },
              },
            })
            .then((success:any) => {
              if (success) {
                console.log('BLOCKS successfully added to wallet!')
              } else {
                throw new Error('Something went wrong.')
              }
            })
            .catch(console.error)
          }
        } catch (addError) {
          console.error(addError);
        }
      }
      console.error(error);
    }
  }

  const addxDaiToMetamask = async() => {
      try {
        // check if the chain to connect to is installed
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x64' }], // chainId must be in hexadecimal numbers
        });
      } catch (error:any) {
        // This error code indicates that the chain has not been added to MetaMask
        // if it is not, then install it into the user MetaMask
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: "0x64",
                chainName: "xDAI Chain",
                rpcUrls: [
                    "https://rpc.xdaichain.com"
                ],
                iconUrls: [
                    "https://gblobscdn.gitbook.com/spaces%2F-Lpi9AHj62wscNlQjI-l%2Favatar.png"
                ],
                nativeCurrency: {
                    "name": "xDAI",
                    "symbol": "xDAI",
                    "decimals": 18
                },
                blockExplorerUrls: [
                    "https://blockscout.com/xdai/mainnet/"
                ]
            }],
            });
          } catch (addError) {
            console.error(addError);
          }
        }
        console.error(error);
      }
  }

  useEffect(() => {
    if (window.ethereum ) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
      .then((res:any) => {
        console.log(res[0]);
        setAddress(res[0])
      })
      .catch((error: any) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          alert('Please connect to MetaMask.');
        } else {
          console.error(error);
        }
      });
      window.ethereum.on('connect', (connectInfo: any) => {
        console.log(connectInfo.chainId)
        switch(connectInfo.chainId){
          case '0x1':
            setNetwork("Ethereum");
            break;
          case '0x64':
            setNetwork("xDAI");
        }
      });
    }
    window.ethereum.on('chainChanged', (chainId: string) => {
      console.log(chainId)
      switch(chainId){
        case '0x1':
          setNetwork("Ethereum");
          break;
        case '0x64':
          setNetwork("xDAI");
      }
      window.location.reload();
    });
    window.ethereum.on('accountsChanged', (accounts: Array<string>) => {
      console.log(accounts)
      setAddress(accounts[0])
    });
  }, []);

  return (
    <div className="body">  
      <div className="intro">
        <strong>Quickly add BLOCKS to Metamask.</strong>
        {address &&
         <>
          <p>Connected: {address}</p>
          {network &&
            <p>You are on {network}</p>
          }
         </> 
        }
      </div>
        <div className="col">
        <strong>BLOCKS on Ethereum</strong>
        <IonButton
          className="button-choose"
          color="danger"
          onClick={addBlocksToMetamask}>Add (ETH) BLOCKS to Metamask</IonButton>
        </div>
        <div className="col">
        <strong>BLOCKS on xDAI</strong>
          <IonButton
          className="button-choose"
          color="danger"
          fill="outline"
          onClick={addxDaiToMetamask}>Switch to xDai Network</IonButton>
          <IonButton
          className="button-choose"
          color="danger"
          onClick={addBlocksToMetamaskXdai}>Add (xDAI) BLOCKS to Metamask</IonButton>
        </div>  
      <div className="footer">
        <a href="https://blocks.io">Blocks.io</a>
      </div>
    </div>  
  );
};

export default ExploreContainer;
