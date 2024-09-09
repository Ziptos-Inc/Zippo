import { useLocation } from 'react-router-dom';

export function FlashIcon() {
  const location = useLocation();

  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill={`${location.pathname === '/boost' ? '#FFB500' : 'none'}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.0901 12.2799H9.1801V19.4799C9.1801 21.1599 10.0901 21.4999 11.2001 20.2399L18.7701 11.6399C19.7001 10.5899 19.3101 9.7199 17.9001 9.7199H14.8101V2.5199C14.8101 0.839898 13.9001 0.499897 12.7901 1.7599L5.2201 10.3599C4.3001 11.4199 4.6901 12.2799 6.0901 12.2799Z"
        stroke={`${location.pathname === '/boost' ? '#1E1E1E' : 'white'}`}
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
} 

export function BoxTickIcon()  {
  const location = useLocation();

  return (
  <svg
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill={`${location.pathname === '/task' ? '#FFB500' : 'none'}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.9583 18.6565C23.9791 19.4377 23.7708 20.1773 23.3958 20.8128C23.1875 21.1878 22.9062 21.5315 22.5937 21.8128C21.875 22.4794 20.927 22.8857 19.875 22.9169C18.3541 22.9482 17.0104 22.1669 16.2708 20.969C15.875 20.3544 15.6354 19.6149 15.625 18.8336C15.5937 17.5211 16.1771 16.3336 17.1146 15.5524C17.8229 14.969 18.7187 14.6044 19.6979 14.5836C22 14.5315 23.9062 16.3544 23.9583 18.6565Z"
      stroke={`${location.pathname === '/task' ? '#1E1E1E' : 'white'}`}
      stroke-width="1.04167"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M18.1666 18.7815L19.2187 19.7814L21.3958 17.6772"
      stroke={`${location.pathname === '/task' ? '#1E1E1E' : 'white'}`}
      stroke-width="1.04167"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M3.30225 7.75L12.5001 13.0729L21.6356 7.78122"
      stroke={`${location.pathname === '/task' ? '#1E1E1E' : 'white'}`}
      stroke-width="1.04167"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12.5002 22.5104V13.0625"
      stroke={`${location.pathname === '/task' ? '#1E1E1E' : 'white'}`}
      stroke-width="1.04167"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M22.5106 9.55225V15.4481C22.5106 15.5002 22.5106 15.5418 22.5002 15.5939C21.771 14.9585 20.8335 14.5835 19.7918 14.5835C18.8126 14.5835 17.9064 14.9273 17.1876 15.5002C16.2293 16.2606 15.6251 17.4377 15.6251 18.7502C15.6251 19.5314 15.8439 20.271 16.2293 20.896C16.3231 21.0627 16.4376 21.2189 16.5626 21.3648L14.6564 22.4169C13.4689 23.0835 11.5314 23.0835 10.3439 22.4169L4.78139 19.3335C3.52098 18.6356 2.48975 16.8856 2.48975 15.4481V9.55225C2.48975 8.11475 3.52098 6.36477 4.78139 5.66685L10.3439 2.5835C11.5314 1.91683 13.4689 1.91683 14.6564 2.5835L20.2189 5.66685C21.4793 6.36477 22.5106 8.11475 22.5106 9.55225Z"
      stroke={`${location.pathname === '/task' ? '#1E1E1E' : 'white'}`}
      stroke-width="1.04167"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
}

export function WalletIcon() {
  const location = useLocation();

  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill={`${location.pathname === '/wallet' ? '#FFB500' : 'none'}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.9977 14.5851C18.5602 15.0122 18.3102 15.6268 18.3727 16.283C18.4664 17.408 19.4977 18.2309 20.6227 18.2309H22.6018V19.4705C22.6018 21.6268 20.8414 23.3872 18.6852 23.3872H6.72685C4.5706 23.3872 2.81018 21.6268 2.81018 19.4705V12.4601C2.81018 10.3039 4.5706 8.54346 6.72685 8.54346H18.6852C20.8414 8.54346 22.6018 10.3039 22.6018 12.4601V13.9601H20.4977C19.9143 13.9601 19.3831 14.1893 18.9977 14.5851Z"
        stroke={`${location.pathname === '/wallet' ? '#1E1E1E' : 'white'}`}
        stroke-width="0.735294"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2.81018 13.3973V8.63696C2.81018 7.39738 3.5706 6.29316 4.72685 5.85566L12.9977 2.73066C14.2893 2.24108 15.6748 3.19944 15.6748 4.58486V8.54318"
        stroke={`${location.pathname === '/wallet' ? '#1E1E1E' : 'white'}`}
        stroke-width="0.735294"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M23.7048 15.0229V17.1688C23.7048 17.7417 23.2464 18.2104 22.6631 18.2313H20.6214C19.4964 18.2313 18.4652 17.4083 18.3714 16.2833C18.3089 15.6271 18.5589 15.0125 18.9964 14.5854C19.3819 14.1896 19.9131 13.9604 20.4964 13.9604H22.6631C23.2464 13.9813 23.7048 14.45 23.7048 15.0229Z"
        stroke={`${location.pathname === '/wallet' ? '#1E1E1E' : 'white'}`}
        stroke-width="0.735294"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.49768 12.9707H14.7893"
        stroke={`${location.pathname === '/wallet' ? '#1E1E1E' : 'white'}`}
        stroke-width="0.735294"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
} 

export function ProfileIcon() {
  const location = useLocation();

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={`${location.pathname === '/friends' ? '#FFB500' : 'none'}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z"
        stroke={`${location.pathname === '/friends' ? '#1E1E1E' : 'white'}`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z"
        stroke={`${location.pathname === '/friends' ? '#1E1E1E' : 'white'}`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}