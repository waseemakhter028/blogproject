import React, { createContext, useReducer, ReactNode, useContext } from "react";
import { categoriesReducer, Category } from "./CategoriesReducer";

// Define Context Type
interface CategoriesContextType {
  categories: Category[];
  addCategory: (category: Category) => void;
  removeCategory: (id: number) => void;
  resetCategories: () => void;
}

// Create Context
const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

// Initial State
const initialState: Category[] =[]

// Provider Component
export const CategoriesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, dispatch] = useReducer(categoriesReducer, initialState);

  // Action functions
  const addCategory = (category: Category) => {
    dispatch({ type: "ADD_CATEGORY", payload: category });
  };

  const removeCategory = (id: number) => {
    dispatch({ type: "REMOVE_CATEGORY", payload: id });
  };

  const resetCategories = () => {
    dispatch({ type: "RESET_CATEGORIES" });
  };

  const value = React.useMemo(() => ({
    categories,
    addCategory,
    removeCategory,
    resetCategories
  }), [categories]);

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};

// Custom Hook for Easy Access
export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
};
