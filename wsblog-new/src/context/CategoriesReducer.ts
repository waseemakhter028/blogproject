export type Category = {
  id: number
};

// Define Action Types
type Action =
  | { type: "ADD_CATEGORY"; payload: Category }
  | { type: "REMOVE_CATEGORY"; payload: number }
  | { type: "RESET_CATEGORIES" };

// Initial State
const initialState: Category[] = []

// Reducer Function
export const categoriesReducer = (state: Category[], action: Action): Category[] => {
  switch (action.type) {
    case "ADD_CATEGORY":
    return [...state, { ...action.payload }];

    case "REMOVE_CATEGORY":
      return state.filter((category) => category.id !== action.payload);

    case "RESET_CATEGORIES":
      return initialState;

    default:
      return state;
  }
};
