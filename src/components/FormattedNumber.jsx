  import React from 'react';
  
  export function FormattedNumber({ value }) {
    function formatNumberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

    return <span>{formatNumberWithCommas(value)}</span>;
  }