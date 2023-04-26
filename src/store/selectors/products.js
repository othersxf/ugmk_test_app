import { createSelector } from "@reduxjs/toolkit";

const getProducts = state => state.products

export const getProductsStatus = createSelector(
    getProducts,
    (state) => state.status
)

export const getProductsList = createSelector(
    getProducts,
    (state) => state.list
)
