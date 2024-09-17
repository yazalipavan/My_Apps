import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

export const newProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, category, price, stock } = req.body;

    const photo = req.file;

    if (!photo) {
      return next(new ErrorHandler("Please Add Photo", 400));
    }
    if (!name || !price || !stock || stock < 1 || !category) {
      rm(photo.path, () => {
        console.log("Deleted Successfully");
      });
      return next(
        new ErrorHandler(
          "Please enter all fields or Stock should be greather than 0",
          400
        )
      );
    }
    await Product.create({
      name,
      category: category.toLocaleLowerCase(),
      price,
      stock,
      photo: photo?.path,
    });

    invalidateCache({ product: true, admin: true });

    return res.status(201).json({
      success: true,
      message: "Product Added Successfully",
    });
  }
);

//Revalidate on every new,update,delete and on new order
export const getLatestProducts = TryCatch(async (req, res, next) => {
  let products;
  if (myCache.has("latest-products"))
    products = JSON.parse(myCache.get("latest-products") as string);
  else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    myCache.set("latest-products", JSON.stringify(products));
  }
  return res.status(200).json({
    success: true,
    products: products,
  });
});

//Revalidate on every new,update,delete and on new order
export const getCategories = TryCatch(async (req, res, next) => {
  let categories;
  if (myCache.has("categories"))
    categories = JSON.parse(myCache.get("categories") as string);
  else {
    categories = await Product.distinct("category");
    myCache.set("categories", JSON.stringify(categories));
  }

  return res.status(200).json({
    success: true,
    categories: categories,
  });
});

//Revalidate on every new,update,delete and on new order
export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;
  if (myCache.has("all-products"))
    products = JSON.parse(myCache.get("all-products") as string);
  else {
    products = await Product.find({});
    myCache.set("all-products", JSON.stringify(products));
  }
  return res.status(200).json({
    success: true,
    products,
  });
});

//Revalidate on every new,update,delete and on new order
export const getSingleProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  let product;
  if (myCache.has(`product-${id}`))
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  else {
    product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("Invalid Id", 404));
    myCache.set(`product-${id}`, JSON.stringify(product));
  }
  return res.status(200).json({
    success: true,
    product,
  });
});

export const updateProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Invalid ID", 404));
  const { name, category, price, stock } = req.body;

  const photo = req.file;

  if (photo) {
    rm(product.photo, () => {
      console.log("Deleted Successfully");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock && stock > 0) product.stock = stock;
  if (category) product.category = category;

  await product.save();
  invalidateCache({
    product: true,
    productId: [String(product._id)],
    admin: true,
  });
  return res.status(201).json({
    success: true,
    message: "Product Updated Successfully",
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Invalid Id", 404));
  rm(product.photo, () => {
    console.log("Product Photo deleted");
  });
  await product?.deleteOne();
  invalidateCache({
    product: true,
    productId: [String(product._id)],
    admin: true,
  });
  return res.status(201).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1);
    const baseQuery: BaseQuery = {};
    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };
    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };
    if (category) baseQuery.category = category;
    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredOnlyProducts] = await Promise.all([
      productsPromise,
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredOnlyProducts.length / limit);

    return res.status(200).json({
      success: true,
      products: products,
      page: page,
      totalPages: totalPage,
    });
  }
);
