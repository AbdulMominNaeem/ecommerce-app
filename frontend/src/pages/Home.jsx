import { useState } from 'react'
import '../App.css'
import { Header } from '../components/Header'
import { Nav } from '../components/Nav'
import { Category } from '../components/Category'
import Drop from '../components/GroceriesDrop'
import Imagebanner from '../components/Imagebanner'
import { ProductGrid } from '../components/ProductGrid'
import { CircleProduct } from '../components/CircleProduct'
import { Footer } from '../components/Footer'
// import { CircleGrid } from './components/CircleGrid'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Nav />
      <Category />
      <Imagebanner />
      <ProductGrid />
      <CircleProduct />
      <Footer />
    </>
  )
}

export default Home
