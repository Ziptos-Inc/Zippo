import React from 'react';
import NavLinks from './NavLinks';
import UserRank from './UserRank';
import { ProfileIcon, FlashIcon, BoxTickIcon, WalletIcon } from './NavBarIcons';
import { Link, useLocation } from 'react-router-dom';

const leftLinks = [
  { title: 'Friends', path: '/friends', icon: <ProfileIcon /> },
  { title: 'Boost', path: '/boost', icon: <FlashIcon /> }
];

const rightLinks = [
  { title: 'Tasks', path: '/task', icon: <BoxTickIcon /> },
  { title: 'Wallet', path: '/wallet', icon: <WalletIcon /> }
];

export default function NavBar() {
  const location = useLocation();

  return (
    <div className='flex items-center justify-center pt-6 pb-6 px-2 border-t-[3px] rounded-t-2xl shadow-5xl'>
      {location.pathname !== '/stats' ? (
        <>
          <NavLinks navLinks={leftLinks} />
          <Link to='/' className={`mx-3 rounded-3xl ${location.pathname === '/' ? 'border-white shadow-4xl' : ''}`}>
            <img src="/ziptos-logo.svg" alt="ziptos-logo"/>
          </Link>
          <NavLinks navLinks={rightLinks} />
        </>
      ) : (
        <UserRank />
      )}
    </div>
  );
}
