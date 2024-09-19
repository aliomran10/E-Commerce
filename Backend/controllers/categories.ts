import asyncHandler from "express-async-handler";
import sharp from "sharp";
import categoriesModel from "../models/categoryModel";
import { Categories } from "../Interfaces/categories";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./refactorHandler";
import { uploadSingleImage } from "../middleware/uploadImages";

export const createCategory = createOne<Categories>(categoriesModel)
export const getCategories = getAll<Categories>(categoriesModel, 'categories')
export const getCategory = getOne<Categories>(categoriesModel)
export const updateCategory = updateOne<Categories>(categoriesModel)
export const deleteCategory = deleteOne<Categories>(categoriesModel)
export const uploadCategoryImage = uploadSingleImage('image');
export const resizeCategoryImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const imageName: string = `category-${Date.now()}.jpeg`
    await sharp(req.file.buffer)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${imageName}`)
    req.body.image = imageName;
  }
  next();
});