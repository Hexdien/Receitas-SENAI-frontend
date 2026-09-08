"use client";

import type { Recipe } from "@/types/recipe";

type RecipeCardProps = {
  recipe: Recipe;
  isFavorite: boolean;
  canManage: boolean;
  busy?: boolean;
  onToggleFavorite: (id: Recipe["id"]) => void;
  onOpen: (recipe: Recipe) => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
};

export function RecipeCard({
  recipe,
  isFavorite,
  canManage,
  busy = false,
  onToggleFavorite,
  onOpen,
  onEdit,
  onDelete,
}: RecipeCardProps) {
  return (
    <article className="recipe-card">
      <div className="recipe-image-wrap">
        {recipe.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="recipe-image"
            loading="lazy"
          />
        ) : (
          /* Sem foto cadastrada: um marcador em vez de imagem quebrada. */
          <div className="recipe-image recipe-image-empty">
            <span>Sem foto</span>
          </div>
        )}

        <button
          type="button"
          className={`favorite-button ${isFavorite ? "active" : ""}`}
          onClick={() => onToggleFavorite(recipe.id)}
          disabled={busy}
          aria-pressed={isFavorite}
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

        <button
          type="button"
          className="recipe-link"
          onClick={() => onOpen(recipe)}
          aria-label={`Ver detalhes de ${recipe.title}`}
        >
          Ver receita <span aria-hidden="true">&rarr;</span>
        </button>

        {canManage && (
          <div className="recipe-admin-actions">
            <button
              type="button"
              className="button button-ghost button-small"
              onClick={() => onEdit?.(recipe)}
            >
              Editar
            </button>

            <button
              type="button"
              className="button button-danger button-small"
              onClick={() => onDelete?.(recipe)}
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
