import React from "react";
import { FaPlus } from "react-icons/fa";
import { CartItem } from "../types/types";

type ProductProps = {
  productId: string;
  name: string;
  photo: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};

const ProductCard = ({
  productId,
  name,
  photo,
  price,
  stock,
  handler,
}: ProductProps) => {
  return (
    <div className="product-card">
      <img src={`${import.meta.env.VITE_SERVER}/${photo}`} />
      <p>{name}</p>
      <span>${price}</span>
      <div>
        <button
          onClick={() =>
            handler({
              productId,
              name,
              photo,
              price,
              stock,
              quantity: 1,
            })
          }
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
