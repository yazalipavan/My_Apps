import React, { useEffect, useState } from "react";
import ProductCard from "../components/product-card";

const Search = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const addToCartHandler = () => {};
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
            <option value="">All</option>
            <option value="game">Game</option>
            <option value="laptop">Laptop</option>
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
        <div className="search-product-list">
          <ProductCard
            productId="1"
            name="Macbook"
            price={345}
            stock={45}
            handler={addToCartHandler}
            photo="https://th.bing.com/th?id=OSK.HEROeoAGeEOx58HAbfF3vrg8PefhUm7KHfKtXYkxcDcJRDg&w=472&h=280&c=1&rs=2&o=6&dpr=1.3&pid=SANGAM"
          />
        </div>
        <article>
          <button
            disabled={!isPrevPage}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>{page} of 4</span>
          <button
            disabled={!isNextPage}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </article>
      </main>
    </div>
  );
};

export default Search;
