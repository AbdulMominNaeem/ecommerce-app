import React from 'react'   
import { BadgePercent, Clock, GitCommitVertical, MapPin, Van } from 'lucide-react';

export const Header = () => {
  return (
    <>
    <div className="h-12 bg-gray-200/60 flex items-center py-1 px-4 sm:px-6 lg:px-8 w-full justify-between">
        <p className="text-xs " >Welcome to worldwide Megamart!</p>
        <div className="text-xs mr-4 sm:mr-10 flex items-center gap-1" >
        <MapPin className='text-cyan-700'/>
        <p className='hidden lg:block'>Deliver to</p>
        <GitCommitVertical className='opacity-50'/>
        <Van className='text-cyan-700'/>
        <p className='hidden lg:block'>Track Your Order</p>
        <GitCommitVertical className='opacity-50'/>
        <BadgePercent className='text-cyan-700'/>
        <p className='hidden lg:block'>All Offers</p>
    </div>
    
    </div>
    </>
  )
}
