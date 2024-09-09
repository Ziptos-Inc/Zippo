// import { useState } from 'react'
import React from 'react'
import TokenCounter from './TokenCounter'

export default function TotalToken() {
    
  return (
    <div className='flex justify-center items-center'>
        <img src='/ziptos-coin.svg' className='rounded-full' height={40} width={40} alt='logo'/>
        <TokenCounter /> 
    </div>
  )
}
