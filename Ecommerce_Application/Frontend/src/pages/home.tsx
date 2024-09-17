import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";
import useProductApi from "../services/useProductApi";
import { Skeleton } from "../components/loader";
import { CartItem, Product } from "../types/types";
import toast from "react-hot-toast";
import useCartStore from "../store/cartStore";

const Home = () => {
  const { addToCart } = useCartStore();

  const productApi = useProductApi();
  useEffect(() => {
    productApi.actions.readLatestProducts();
  }, []);

  const { data, isLoading, isError } = productApi.states.latestProducts;

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    addToCart(cartItem);
    toast.success("Added to Cart");
  };

  if (isError) return toast.error("Cannot fetch Products");
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
        {isLoading ? (
          <Skeleton width="80vw" />
        ) : (
          data?.products?.map((product: Product) => {
            return (
              <ProductCard
                key={product._id}
                productId={product._id}
                name={product.name}
                price={product.price}
                stock={product.stock}
                handler={addToCartHandler}
                photo={product.photo}
              />
            );
          })
        )}
      </main>
    </div>
  );
};

export default Home;
