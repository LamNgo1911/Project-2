import { createSlice } from "@reduxjs/toolkit";

const localUser = JSON.parse(sessionStorage.getItem("user"));

const localFavoriteItems = JSON.parse(
  localStorage.getItem(`favoriteItems_${localUser?.id}`)
);
const localCartItems = JSON.parse(
  localStorage.getItem(`cartItems_${localUser?.id}`)
);
const localRecentViewedProducts = JSON.parse(
  localStorage.getItem(`recentViewedProducts_${localUser?.id}`)
);

const localSelectedItems = JSON.parse(
  localStorage.getItem(`selectedItems_${localUser?.id}`)
);
const initialState = {
  favoriteItems: localFavoriteItems || [],
  isInFavorite: false,
  cartItems: localCartItems || [],
  selectedItems: localSelectedItems || [],
  isInCart: false,
  recentViewItems: [],
  isFavoriteAdded: false,
  isFavoriteRemoved: false,
  isCartAdded: false,
  isCartRemoved: false,
  recentViewedProducts: localRecentViewedProducts || [],
  isInRecentViewedProducts: false,
  openProductModal: false,
  order: {},
  shippingInfo: {},
  subtotal: null,
  total: null,
  shippingFee: null,
  cardInfo: null,
  receivedOrder: null,
};

const shoppingSlice = createSlice({
  name: "shopping",
  initialState,
  reducers: {
    addToFavorite: (state, action) => {
      const { userId, product } = action.payload;

      const existingItem = state.favoriteItems.find(
        (item) => item.item._id === product?._id && item.userId === userId
      );
      if (!existingItem) {
        const newItem = {
          item: product,
          isInFavorite: true,
          userId,
        };
        state.favoriteItems.push(newItem);
        state.isFavoriteAdded = true;
        if (userId) {
          localStorage.setItem(
            `favoriteItems_${userId}`,
            JSON.stringify(state.favoriteItems)
          );
        }
      }
    },
    removefromFavorite: (state, action) => {
      const { userId, product } = action.payload;

      state.favoriteItems = state.favoriteItems
        .map((item) => {
          if (item.item._id === product?._id && item.userId === userId) {
            return { ...item, isInFavorite: false };
          }
          return item;
        })
        .filter(
          (item) => item.item._id !== product?._id && item.userId === userId
        );
      state.isFavoriteRemoved = true;
      if (userId) {
        localStorage.setItem(
          `favoriteItems_${userId}`,
          JSON.stringify(state.favoriteItems)
        );
      }
    },
    setIsFavoriteAdded: (state, action) => {
      state.isFavoriteAdded = action.payload;
    },
    setIsFavoriteRemoved: (state, action) => {
      state.isFavoriteRemoved = action.payload;
    },
    addToCart: (state, action) => {
      const { userId, color, size, id, image, price, name, category, amount } =
        action.payload;

      const existingProduct = state.cartItems.find(
        (item) =>
          item.id === id &&
          item.color === color &&
          item.size === size &&
          item.userId === userId
      );
      if (existingProduct) {
        state.cartItems = state.cartItems.map((item) => {
          if (
            item.id === id &&
            item.color === color &&
            item.size === size &&
            item.userId === userId
          ) {
            return { ...item, amount: item.amount + 1 };
          }
          return item;
        });
      } else {
        const newItem = {
          id,
          name,
          color,
          size,
          image,
          price,
          amount,
          category,
          userId,
        };
        state.cartItems.push(newItem);
      }
      state.isCartAdded = true;
      if (userId) {
        localStorage.removeItem(`cartItems_${userId}`);
      }
    },
    removeFromCart: (state, action) => {
      const { userId, id, color, size } = action.payload;

      state.cartItems = state.cartItems.filter(
        (item) =>
          !(
            item.id === id &&
            item.color === color &&
            item.size === size &&
            item.userId === userId
          )
      );

      state.isCartRemoved = true;
      if (userId) {
        localStorage.setItem(
          `cartItems_${userId}`,
          JSON.stringify(state.cartItems)
        );
      }
    },
    resetCart: (state, action) => {
      const { userId } = action.payload;

      state.cartItems = null;

      if (userId) {
        localStorage.setItem(`cartItems_${userId}`, JSON.stringify(null));
      }
    },
    setAmount: (state, action) => {
      const { userId, id, color, size, amount } = action.payload;

      state.cartItems = state.cartItems.map((item) => {
        if (
          item.id === id &&
          item.color === color &&
          item.size === size &&
          item.userId === userId
        ) {
          return { ...item, amount };
        }
        return item;
      });
      if (userId) {
        localStorage.setItem(
          `cartItems_${userId}`,
          JSON.stringify(state.cartItems)
        );
      }
    },

    setSelectedItems: (state, action) => {
      const { userId, color, size, id, image, price, name, category, amount } =
        action.payload;

      const newItem = {
        id,
        name,
        color,
        size,
        image,
        price,
        amount,
        category,
        userId,
      };
      state.selectedItems.push(newItem);
      if (userId) {
        localStorage.removeItem(`selectedItems_${userId}`);
      }
    },
    resetSelectedItems: (state, action) => {
      const { userId } = action.payload;

      state.selectedItems = null;

      if (userId) {
        localStorage.setItem(`selectedItems_${userId}`, JSON.stringify(null));
      }
    },
    setIsCartAdded: (state, action) => {
      state.isCartAdded = action.payload;
    },
    setIsCartRemoved: (state, action) => {
      state.isCartRemoved = action.payload;
    },
    setOpenProductModal: (state, action) => {
      state.openProductModal = action.payload;
    },
    addRecentViewItems: (state, action) => {
      state.recentViewItems.push(action.payload);
    },
    removeRecentViewItems: (state, action) => {
      state.recentViewItems = state.recentViewItems.filter(
        (item) => item.id !== action.payload
      );
    },
    setRecentViewedProducts: (state, action) => {
      const { userId, item } = action.payload;

      const existingItem = state.recentViewedProducts.find(
        (item) => item.item.id === item.id
      );
      if (!existingItem) {
        const newItem = {
          item: item,
          isInRecentViewedProducts: true,
          userId,
        };
        state.recentViewedProducts.push(newItem);
        if (userId) {
          localStorage.setItem(
            `recentViewedProducts_${userId}`,
            JSON.stringify(state.recentViewedProducts)
          );
        }
      }
    },
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    setShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    },
    setReceivedOrder: (state, action) => {
      state.receivedOrder = action.payload;
    },
  },
});

export const {
  addToFavorite,
  removefromFavorite,
  addToCart,
  removeFromCart,
  resetCart,
  addRecentViewItems,
  removeRecentViewItems,
  setIsFavoriteAdded,
  setIsFavoriteRemoved,
  setIsCartAdded,
  setIsCartRemoved,
  setRecentViewedProducts,
  setOpenProductModal,
  setAmount,
  setOrder,
  setShippingInfo,
  setReceivedOrder,
  setSelectedItems,
  resetSelectedItems,
} = shoppingSlice.actions;

export default shoppingSlice.reducer;
