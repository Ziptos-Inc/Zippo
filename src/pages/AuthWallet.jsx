import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useKeylessAccounts } from "../core/useKeylessAccounts";
import { useToast } from "@/components/ui/use-toast";
import { collapseAddress } from "../core/utils";
import { useUser } from '../contexts/UserContext';
import { db } from '../config/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Account } from "@aptos-labs/ts-sdk";




function AuthWallet() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const [walletAddress, setWalletAddress] = useState(null);

  // const { activeAccount, disconnectKeylessAccount } = useKeylessAccounts();

  useEffect(() => {
    if (user) {
      checkWalletStatus();
    }
  }, [user]);

  const checkWalletStatus = async () => {
    if (!user || !user.id) {
      console.log("No user ID available");
      return;
    }
  
    try {
      // First, check if the user already has a publicKey
      if (user.publicKey) {
        setWalletAddress(user.publicKey);
        return;
      }
  
      // If not, check the walletUsers collection
      const walletDocRef = doc(db, 'walletUsers', user.id.toString());
      const walletDoc = await getDoc(walletDocRef);
  
      if (walletDoc.exists() && walletDoc.data().publicKey) {
        setWalletAddress(walletDoc.data().publicKey);
      } else {
        // If no wallet exists, create a new one
        await createNewWallet(user.id);
        toast({
          description: "Welcome! Since you dont have a wallet with us we've succesfully generated a wallet for you",
        });
      }
    } catch (error) {
      console.error("Error checking wallet status:", error);
    }
  };

  const createNewWallet = async (userId) => {
    try {
      const bob = Account.generate();
      console.log("Generated account:", bob);
      const encrypted = await encrypt(bob.privateKey.toString());
      const newWalletData = {
        publicKey: bob.accountAddress.toString(),
        iv: encrypted.iv,
        encryptedData: encrypted.encryptedData,
      };
  
      // Update the zippoUsers collection
      const zippoUserDocRef = doc(db, 'zippoUsers', userId.toString());
      await setDoc(zippoUserDocRef, newWalletData, { merge: true });
  
      console.log("Wallet data saved to Firestore");
  
      setWalletAddress(bob.accountAddress.toString());
    } catch (error) {
      console.error("Error creating new wallet:", error);
    }
  };

  function handleClick(referralLink) {
    navigator.clipboard.writeText(referralLink);

    toast({
      description: "Copied link to clipboard",
    });
  }

  async function encrypt(text) {
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      await crypto.subtle.digest('SHA-256', encoder.encode(import.meta.env.ENCRYPTING_KEY)),
      { name: 'AES-CBC' },
      false,
      ['encrypt']
    );
    
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-CBC', iv: iv },
      cryptoKey,
      data
    );
    
    return {
      iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
      encryptedData: Array.from(new Uint8Array(encryptedData)).map(b => b.toString(16).padStart(2, '0')).join('')
    };
  }

  async function decrypt(encryptedObj) {
    const iv = new Uint8Array(encryptedObj.iv.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const encryptedData = new Uint8Array(encryptedObj.encryptedData.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(import.meta.env.ENCRYPTING_KEY)),
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    );
    
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: iv },
      cryptoKey,
      encryptedData
    );
    
    return new TextDecoder().decode(decryptedData);
  }

  return (
    <main className="flex h-[90vh] overflow-auto pt-10 pb-7 px-5 flex-col items-center justify-center">
      <div className="text-white">
        <div className="text-center flex flex-col justify-center items-center mb-[21px]">
          <img
            src="/ziptos-logo.svg"
            alt="logo"
            width={99}
            height={99}
            className="shadow-logo rounded-full mt-[124px] mb-[38px]"
          />
          <h1 className="font-bold text-2xl">Connect your wallet</h1>
          <p className="w-[308px] text-[16px]">
            Hello Zippo, listing is on it’s way! Connect your wallet to access
            the upcoming <span className="text-[#F33439]">Ziptos</span>{" "}
            airdrops.
          </p>
        </div>

        <div className="grid gap-4">
          {walletAddress ? (
            <div className="flex h-[53px] gap-1">
              <div className="flex justify-center items-center bg-[#484848]/50 rounded-[15px] w-[55px]">
                <img
                  src="/empty-wallet.svg"
                  alt="icon"
                  height={29}
                  width={29}
                />
              </div>
              <div className="flex flex-1 justify-between items-center rounded-[15px] px-5 py-2 shadow-sm bg-[#484848]/50 cursor-not-allowed">
                <span>{collapseAddress(walletAddress)}</span>
                <button
                  onClick={() => handleClick(walletAddress)}
                  className="bg-transparent"
                >
                  <img
                    src="/copy-to-clipboard.svg"
                    alt="icon"
                    height={20}
                    width={20}
                  />
                </button>
              </div>
            </div>
          ) : (
            <p>Loading wallet...</p>
          )}
          <button
            className="text-[#F33439] bg-white text-[18px] font-bold flex justify-center items-center h-[60px] rounded-[15px] w-[354px] fold-bold"
            onClick={() => navigate('/wallet')}
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    </main>
  );
}

export default AuthWallet;
