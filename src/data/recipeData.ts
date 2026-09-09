export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  image: string;
}

export const RECIPES: Recipe[] = [
  {
    id: 'r1',
    name: 'Tomato Sambar',
    ingredients: ['Tomato', 'Onion', 'Potato'],
    time: '30 min',
    difficulty: 'Easy',
    description: 'Classic South Indian sambar with fresh tomatoes and vegetables. Pairs perfectly with rice or idli.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'r2',
    name: 'Aloo Gobi',
    ingredients: ['Potato', 'Carrot'],
    time: '25 min',
    difficulty: 'Easy',
    description: 'Spiced potato and cauliflower dry curry — a North Indian staple loved across India.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'r3',
    name: 'Mango Lassi',
    ingredients: ['Mango'],
    time: '5 min',
    difficulty: 'Easy',
    description: 'Refreshing yogurt-based mango smoothie — the perfect summer cooler.',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'r4',
    name: 'Brinjal Bharta',
    ingredients: ['Brinjal', 'Onion'],
    time: '35 min',
    difficulty: 'Medium',
    description: 'Smoky mashed eggplant curry cooked with onions and spices. Best with roti.',
    image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'r5',
    name: 'Green Beans Poriyal',
    ingredients: ['Green Beans', 'Onion'],
    time: '15 min',
    difficulty: 'Easy',
    description: 'South Indian stir-fried green beans with coconut and mustard seeds.',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db87?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'r6',
    name: 'Apple Kheer',
    ingredients: ['Apple'],
    time: '20 min',
    difficulty: 'Easy',
    description: 'Creamy Indian rice pudding with grated apples and cardamom — a festive dessert.',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'r7',
    name: 'Onion Pakora',
    ingredients: ['Onion'],
    time: '15 min',
    difficulty: 'Easy',
    description: 'Crispy deep-fried onion fritters — the ultimate monsoon snack with chai.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'r8',
    name: 'Carrot Halwa',
    ingredients: ['Carrot'],
    time: '40 min',
    difficulty: 'Medium',
    description: 'Rich and indulgent grated carrot dessert slow-cooked in milk and ghee.',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=400&q=80',
  },
];

export function getRecipesForProducts(productNames: string[]): Recipe[] {
  const lower = productNames.map((n) => n.toLowerCase());
  return RECIPES.filter((r) => r.ingredients.some((ing) => lower.includes(ing.toLowerCase())));
}
