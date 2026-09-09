import { getRecipesForProducts } from '../../data/recipeData';
import { useMarketplaceStore } from '../../store/marketplaceStore';
import { ChefHat, Clock, Flame, ShoppingCart } from 'lucide-react';

export default function RecipeSuggestions() {
  const cart = useMarketplaceStore((s) => s.cart);
  const addToCart = useMarketplaceStore((s) => s.addToCart);
  const productNames = cart.map((i) => i.name);
  const recipes = getRecipesForProducts(productNames);

  if (recipes.length === 0) return null;

  return (
    <div className="glass-panel-sm p-4 space-y-3">
      <div className="flex items-center gap-2">
        <ChefHat className="w-4 h-4 text-soil-gold" />
        <h3 className="font-display font-bold text-sm text-text-primary">Recipes You Can Make</h3>
      </div>
      <p className="text-[10px] text-text-muted">Based on items in your cart</p>
      <div className="space-y-2">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/8 transition">
            <img src={recipe.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-text-primary">{recipe.name}</div>
              <div className="flex items-center gap-2 text-[9px] text-text-muted">
                <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {recipe.time}</span>
                <span className="flex items-center gap-0.5"><Flame className="w-2.5 h-2.5" /> {recipe.difficulty}</span>
              </div>
              <p className="text-[9px] text-text-muted/70 mt-0.5 line-clamp-1">{recipe.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
