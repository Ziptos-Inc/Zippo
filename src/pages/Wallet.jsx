import React from "react";
import { GOOGLE_CLIENT_ID } from "../core/constants";
import useEphemeralKeyPair from "../core/useEphemeralKeyPair";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import GoogleLogo from "../components/GoogleLogo";

export default function Wallet() {
  const ephemeralKeyPair = useEphemeralKeyPair();

  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  const searchParams = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${window.location.origin}/callback`,
    response_type: "id_token",
    scope: "openid email profile",
    nonce: ephemeralKeyPair.nonce,
  });
  redirectUrl.search = searchParams.toString();

  return (
    <div className="h-[90vh] overflow-auto pt-10 pb-7">
      <div className="h-full flex flex-col items-center justify-between text-white">
        <div className="text-center flex flex-col justify-center items-center">
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

        <Drawer>
          <DrawerTrigger className="bg-[#F33439] flex justify-center items-center h-[60px] rounded-[15px] w-[354px] fold-bold text-[18px]">Connect Wallet</DrawerTrigger>
          <DrawerContent className='bg-[#0F0F0F] border-t-2 text-white pb-10'>
            <DrawerHeader className='flex justify-between'>
              <DrawerTitle className='font-bold text-[22px]'>Connect Wallet</DrawerTitle>
              <DrawerClose>
                <button variant="outline"><img src="/x-icon.svg" alt="icon" height={10} width={10} /></button>
              </DrawerClose>
            </DrawerHeader>
            <div className="px-4">
              <a href="/auth-wallet"
              className="w-full mb-2 font-thin h-[63px] uppercase text-sm rounded-[15px] flex gap-[18px] px-5 items-center bg-[#484848]/50"
              >
                  <img src="/zip-pocket.png" alt="icon" width={33} height={33}/>
                  Ziptos pocket
              </a>
              {/* <a
                href={redirectUrl.toString()}
                className="w-full font-thin h-[63px] uppercase text-sm rounded-[15px] flex gap-[18px] px-5 items-center bg-[#484848]/50"
              >
                <GoogleLogo />
                Keyless connect
              </a> */}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
