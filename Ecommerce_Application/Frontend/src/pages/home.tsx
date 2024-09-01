import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";

const Home = () => {
  const addToCartHandler = () => {
    console.log("added to cart");
  };
  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to="/search" className="findmore">
          More
        </Link>
      </h1>
      <main>
        <ProductCard
          productId="1"
          name="Macbook"
          price={345}
          stock={45}
          handler={addToCartHandler}
          photo="https://th.bing.com/th?id=OSK.HEROeoAGeEOx58HAbfF3vrg8PefhUm7KHfKtXYkxcDcJRDg&w=472&h=280&c=1&rs=2&o=6&dpr=1.3&pid=SANGAM"
        />
      </main>
    </div>
  );
};

export default Home;
