import type { Recipe } from "@/types/recipe";

type RecipeCardProps = {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (id: Recipe["id"]) => void;
};

export function RecipeCard({
  recipe,
  isFavorite,
  onToggleFavorite,
}: RecipeCardProps) {
  return (
    <article className="recipe-card">
      <div className="recipe-image-wrap">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="recipe-image"
          loading="lazy"
        />

        <button
          type="button"
          className={`favorite-button ${isFavorite ? "active" : ""}`}
          onClick={() => onToggleFavorite(recipe.id)}
          aria-label={
            isFavorite
              ? `Remover ${recipe.title} dos favoritos`
              : `Adicionar ${recipe.title} aos favoritos`
          }
        >
          {isFavorite ? "♥" : "♡"}
        </button>

        {recipe.category && (
          <span className="recipe-category">{recipe.category}</span>
        )}
      </div>

      <div className="recipe-content">
        <div className="recipe-meta">
          {recipe.prepTime && <span>◷ {recipe.prepTime} min</span>}
          {recipe.difficulty && <span>• {recipe.difficulty}</span>}
          {recipe.rating && <span>★ {recipe.rating.toFixed(1)}</span>}
        </div>

        <h2>{recipe.title}</h2>

        {recipe.description && (
          <p className="recipe-description">{recipe.description}</p>
        )}

        <button type="button" className="recipe-link">
          Ver receita <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}
