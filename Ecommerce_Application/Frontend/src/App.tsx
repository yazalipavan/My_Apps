import React ,{lazy,Suspense}from 'react'
import { BrowserRouter as Router , Routes,Route } from 'react-router-dom'
import Loader from "./components/loader"

const Home=lazy(()=>import("./pages/home"))
const Search=lazy(()=>import("./pages/search"))
const Cart=lazy(()=>import("./pages/cart"))
const App = () => {
  return (
    <Suspense fallback={<Loader/>}>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path ="/search" element={<Search/>}/>
        <Route path="/cart" element={<Cart/>}/>
      </Routes>
    </Router>
    </Suspense>
  )
}

export default App
