export type Recipe = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  image: string;
};

export const recipes: Recipe[] = [
  {
    id: "r1",
    name: "Grilled Chicken with Sautéed Greens",
    description: "Lemon-herb grilled chicken breast with garlic spinach — high protein, low carb.",
    tags: ["high-protein", "low-carb", "dinner", "gluten-free"],
    calories: 420, protein: 45, carbs: 8, fat: 18,
    ingredients: ["chicken breast", "spinach", "garlic", "olive oil", "lemon"],
    image: "/images/grilled-chicken.jpg",
  },
  {
    id: "r2",
    name: "Pan-Seared Salmon with Asparagus",
    description: "Omega-3 rich salmon fillet with roasted asparagus, low-carb high-protein.",
    tags: ["high-protein", "low-carb", "dinner", "seafood"],
    calories: 480, protein: 40, carbs: 9, fat: 28,
    ingredients: ["salmon", "asparagus", "butter", "black pepper", "garlic"],
    image: "/images/salmon.jpg",
  },
  {
    id: "r3",
    name: "Paneer Tikka Bowl",
    description: "Vegetarian high-protein bowl with grilled paneer, bell peppers, mint chutney.",
    tags: ["high-protein", "low-carb", "vegetarian", "dinner"],
    calories: 390, protein: 28, carbs: 12, fat: 22,
    ingredients: ["paneer", "bell pepper", "onion", "yogurt", "spices"],
    image: "/images/paneer-tikka.jpg",
  },
  {
    id: "r4",
    name: "Classic Fettuccine Alfredo",
    description: "Creamy pasta comfort food, rich in carbs and indulgent flavor.",
    tags: ["comfort-food", "high-carb", "dinner", "vegetarian"],
    calories: 720, protein: 18, carbs: 65, fat: 40,
    ingredients: ["fettuccine", "cream", "parmesan", "butter", "garlic"],
    image: "/images/fettuccine.jpg",
  },
  {
    id: "r5",
    name: "Beef Steak with Grilled Vegetables",
    description: "Lean beef steak with zucchini and mushrooms, high protein and low carb.",
    tags: ["high-protein", "low-carb", "dinner"],
    calories: 510, protein: 48, carbs: 10, fat: 30,
    ingredients: ["beef steak", "zucchini", "mushroom", "rosemary", "olive oil"],
    image: "/images/beef-steak.jpg",
  },
  {
    id: "r6",
    name: "Shrimp & Zucchini Noodles",
    description: "Garlic butter shrimp over spiralized zucchini — light, low-carb, high-protein.",
    tags: ["high-protein", "low-carb", "seafood", "dinner"],
    calories: 360, protein: 35, carbs: 11, fat: 16,
    ingredients: ["shrimp", "zucchini", "garlic", "butter", "chili flakes"],
    image: "/images/shrimp-pasta.jpg",
  },
  {
    id: "r7",
    name: "Veggie Stir-Fry with Tofu",
    description: "Crisp seasonal vegetables and tofu tossed in a light soy-ginger glaze.",
    tags: ["vegetarian", "low-carb", "high-protein", "dinner"],
    calories: 340, protein: 22, carbs: 18, fat: 14,
    ingredients: ["tofu", "broccoli", "carrot", "soy sauce", "ginger"],
    image: "/images/veggie-stirfry.jpg",
  },
  {
    id: "r8",
    name: "Herb-Crusted Lamb Chops",
    description: "Rosemary-crusted lamb chops, grilled to perfection — rich in protein.",
    tags: ["high-protein", "low-carb", "dinner"],
    calories: 540, protein: 42, carbs: 6, fat: 34,
    ingredients: ["lamb chops", "rosemary", "garlic", "olive oil", "thyme"],
    image: "/images/lamb-chops.jpg",
  },
  {
    id: "r9",
    name: "Wild Mushroom Risotto",
    description: "Creamy arborio rice slow-cooked with wild mushrooms and parmesan.",
    tags: ["vegetarian", "high-carb", "dinner", "comfort-food"],
    calories: 610, protein: 16, carbs: 70, fat: 24,
    ingredients: ["arborio rice", "mushroom", "parmesan", "white wine", "butter"],
    image: "/images/mushroom-risotto.jpg",
  },
  {
    id: "r10",
    name: "Grilled Tofu Protein Bowl",
    description: "Grilled tofu, quinoa, and roasted veggies — a balanced high-protein bowl.",
    tags: ["vegetarian", "high-protein", "low-carb", "dinner"],
    calories: 400, protein: 26, carbs: 20, fat: 18,
    ingredients: ["tofu", "quinoa", "bell pepper", "olive oil", "lemon"],
    image: "/images/tofu-bowl.jpg",
  },
];