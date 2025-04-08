import React from 'react'
import CategoryList from '../../components/Products/CategoryList'
import BannerProduct from '../../components/Products/BannerProduct'
import HorizontalCardProduct from '../../components/Products/HorizontalCardProduct'
import VerticalCardProduct from '../../components/Products/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <CategoryList/>
      <BannerProduct/>

      <HorizontalCardProduct category={"airpodes"} heading={"Top's Airpodes"}/>
      <HorizontalCardProduct category={"watches"} heading={"Popular's Watches"}/>

      <VerticalCardProduct category={"mobiles"} heading={"Mobiles"}/>
      <VerticalCardProduct category={"Mouse"} heading={"Mouse"}/>
      <VerticalCardProduct category={"televisions"} heading={"Televisions"}/>
      <VerticalCardProduct category={"camera"} heading={"Camera & Photography"}/>
      <VerticalCardProduct category={"earphones"} heading={"Wired Earphones"}/>
      <VerticalCardProduct category={"speakers"} heading={"Bluetooth Speakers"}/>
      <VerticalCardProduct category={"refrigerator"} heading={"Refrigerator"}/>
      <VerticalCardProduct category={"trimmers"} heading={"Trimmers"}/>
    </div>
  )
}

export default Home