import React from 'react'

export default function Character() {
  return (
    <div class="rounded-[20px] p-[1.38px] bg-gradient-to-r from-white/60 to-white/70 flex items-center">
      <div className="rounded-[calc(20px-1.38px)] flex gap-3 items-center bg-[#2c281e] h-12">
        <span className='ml-4 text-sm font-bold text-white'>Zippo</span>
        <div className='relative'>
            <span className='bg-[#5CB75F] size-4 rounded-full flex justify-center items-center absolute -top-1 -left-2'><img src="/check-icon.svg" alt="check" /></span>
            <img
            src="/character-emily.png"
            height={31}
            width={31}
            alt="character"
            className='mr-3'
            />
        </div>
      </div>
    </div>
  )
}
