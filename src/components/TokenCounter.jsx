import React from 'react'
import { useGameStore } from '../lib/store/game-store';
import { FormattedNumber } from './FormattedNumber';

export default function TokenCounter() {
  const { points } = useGameStore();
  return (
    <h1 className='text-[34px] text-white font-bold mb-2'><FormattedNumber value={points} /> ZP</h1>
  )
}
