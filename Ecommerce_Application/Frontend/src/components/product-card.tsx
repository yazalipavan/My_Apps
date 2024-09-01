import React from "react";
import { FaPlus } from "react-icons/fa";

type ProductProps = {
  productId: string;
  name: string;
  photo: string;
  price: number;
  stock: number;
  handler: () => void;
};
const server = "ahdfbmdf";
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
      <img src={`${photo}`} />
      <p>{name}</p>
      <span>${price}</span>
      <div>
        <button onClick={() => handler()}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
