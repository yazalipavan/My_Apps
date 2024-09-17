import React, { useEffect, useState } from "react";
import ProductCard from "../components/product-card";
import useProductApi from "../services/useProductApi";
import { Skeleton } from "../components/loader";
import toast from "react-hot-toast";
import { CartItem } from "../types/types";
import useCartStore from "../store/cartStore";

const Search = () => {
  const productApi = useProductApi();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const { addToCart } = useCartStore();

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    addToCart(cartItem);
    toast.success("Added to Cart");
  };
  const [isPrevPage, setIsPrevPage] = useState(true);
  const [isNextPage, setIsNextPage] = useState(true);
  useEffect(() => {
    if (page === 1) setIsPrevPage(false);
    else {
      setIsPrevPage(true);
    }
    if (page === 4) setIsNextPage(false);
    else {
      setIsNextPage(true);
    }
  }, [page]);

  useEffect(() => {
    productApi.actions.readAllCategories();
  }, []);

  useEffect(() => {
    const filter = {
      ...(search && { search }),
      ...(sort && { sort }),
      ...(category && category && { category }),
      ...(maxPrice && { price: maxPrice.toString() }),
      page: page.toString(),
    };
    productApi.actions.readAllProducts(filter);
  }, [search, page, category, maxPrice, sort]);

  const {
    data: searchData,
    isLoading: productLoading,
    isError: productError,
  } = productApi.states.allProducts;

  const {
    data: categoryData,
    isLoading: categoryLoading,
    isError: categoryError,
  } = productApi.states.allCategories;

  if (productError) {
    toast.error("Error fetching products");
  }
  if (categoryError) {
    toast.error("Error fetching categories");
  }

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
            }}
          >
            <option value="">None</option>
            <option value="asc">Low to High</option>
            <option value="dsc">High to Low</option>
          </select>
        </div>
        <div>
          <h4>Max Price:{maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option value="">ALL</option>
            {!categoryLoading &&
              categoryData?.categories.map((category: string) => (
                <option value={category}>{category.toUpperCase()}</option>
              ))}
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {productLoading ? (
          <Skeleton length={10} />
        ) : (
          <div className="search-product-list">
            {searchData?.products?.map((product: any) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                name={product.name}
                price={product.price}
                stock={product.stock}
                handler={addToCartHandler}
                photo={product.photo}
              />
            ))}
          </div>
        )}
        {searchData && searchData.totalPages >= 1 && (
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {searchData.totalPages}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;
