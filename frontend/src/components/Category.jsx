import { GitCommitVertical, Menu, Search, ShoppingCart, UserRound } from 'lucide-react'
import GroceriesDrop from './GroceriesDrop'
import ElectronicsDrop from './ElectronicsDrop'
import FashionDrop from './FashionDrop'
import BeautyDrop from './BeautyDrop'

export const Category = () => {
  return (
    <div className="h-17 border-b border-t border-gray-800/20 bg-white flex items-center py-3 px-30 gap-3   " >
      <GroceriesDrop />      
      <ElectronicsDrop />
      <FashionDrop />
      <BeautyDrop />
    
    </div>
  )
}
