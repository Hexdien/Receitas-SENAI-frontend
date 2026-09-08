"use client";

import { useEffect, useRef } from "react";
import type { Recipe } from "@/types/recipe";

type RecipeDetailProps = {
  recipe: Recipe;
  isFavorite: boolean;
  canManage: boolean;
  busy?: boolean;
  onToggleFavorite: (id: Recipe["id"]) => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
  onClose: () => void;
};

export function RecipeDetail({
  recipe,
  isFavorite,
  canManage,
  busy = false,
  onToggleFavorite,
  onEdit,
  onDelete,
  onClose,
}: RecipeDetailProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Esc fecha os detalhes.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === dialogRef.current?.parentElement) onClose();
      }}
    >
      <div
        className="modal modal-detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-detail-title"
        ref={dialogRef}
      >
        <div className="detail-cover">
          {recipe.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={recipe.imageUrl} alt={recipe.title} />
          ) : (
            <div className="detail-cover-empty">
              <span>Sem foto</span>
            </div>
          )}

          <button
            type="button"
            className="modal-close detail-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>

          {recipe.category && (
            <span className="recipe-category">{recipe.category}</span>
          )}
        </div>

        <div className="detail-body">
          <div className="recipe-meta">
            {recipe.prepTime && <span>◷ {recipe.prepTime} min</span>}
            {recipe.difficulty && <span>• {recipe.difficulty}</span>}
            {recipe.rating && <span>★ {recipe.rating.toFixed(1)}</span>}
          </div>

          <h2 id="recipe-detail-title">{recipe.title}</h2>

          {recipe.description ? (
            <p className="detail-description">{recipe.description}</p>
          ) : (
            <p className="detail-description detail-empty">
              Esta receita ainda não tem descrição.
            </p>
          )}

          <div className="detail-actions">
            <button
              type="button"
              className={`button button-ghost ${isFavorite ? "is-favorite" : ""}`}
              onClick={() => onToggleFavorite(recipe.id)}
              disabled={busy}
              aria-pressed={isFavorite}
            >
              {isFavorite ? "♥ Favoritada" : "♡ Favoritar"}
            </button>

            {canManage && (
              <>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => onEdit?.(recipe)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  className="button button-danger"
                  onClick={() => onDelete?.(recipe)}
                  disabled={busy}
                >
                  Excluir
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
