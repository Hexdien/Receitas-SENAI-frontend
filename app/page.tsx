"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { RecipeCard } from "@/components/RecipeCard";
import { Sidebar } from "@/components/Sidebar";
import { getRecipes } from "@/lib/api";
import type { GuideFilter, Recipe } from "@/types/recipe";

const filterTitles: Record<GuideFilter, { eyebrow: string; title: string }> = {
  all: { eyebrow: "Inspiração para hoje", title: "Receitas que dão vontade de cozinhar" },
  favorites: { eyebrow: "Sua seleção", title: "Receitas favoritas" },
  weekly: { eyebrow: "Mais amadas", title: "Queridinhos da semana" },
  quick: { eyebrow: "Pouco tempo, muito sabor", title: "Receitas rápidas" },
  savory: { eyebrow: "Do café ao jantar", title: "Receitas salgadas" },
  sweet: { eyebrow: "Um carinho em forma de receita", title: "Doces" },
};

export default function HomePage() {
  const [selectedFilter, setSelectedFilter] = useState<GuideFilter>("all");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Array<Recipe["id"]>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("recipe_favorites");

    if (saved) {
      try {
        setFavoriteIds(JSON.parse(saved));
      } catch {
        localStorage.removeItem("recipe_favorites");
      }
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadRecipes() {
      setLoading(true);
      setError("");

      try {
        const data = await getRecipes(selectedFilter);

        if (active) {
          setRecipes(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível carregar as receitas."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRecipes();

    return () => {
      active = false;
    };
  }, [selectedFilter]);

  const displayedRecipes = useMemo(() => {
    if (selectedFilter !== "favorites") return recipes;

    return recipes.filter((recipe) => favoriteIds.includes(recipe.id));
  }, [recipes, selectedFilter, favoriteIds]);

  function toggleFavorite(id: Recipe["id"]) {
    setFavoriteIds((current) => {
      const next = current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id];

      localStorage.setItem("recipe_favorites", JSON.stringify(next));
      return next;
    });
  }

  const currentTitle = filterTitles[selectedFilter];

  return (
    <>
      <Header />

      <div className="page-shell">
        <Sidebar selected={selectedFilter} onSelect={setSelectedFilter} />

        <main className="main-content">
          <section className="hero">
            <div>
              <span className="eyebrow">{currentTitle.eyebrow}</span>
              <h1>{currentTitle.title}</h1>
              <p>
                Descubra novas ideias, escolha seus favoritos e encontre
                receitas para todos os momentos.
              </p>
            </div>

            <div className="hero-badge" aria-hidden="true">
              <span>Receita boa</span>
              <strong>é receita compartilhada.</strong>
            </div>
          </section>

          <section className="recipes-section" aria-live="polite">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Explore</span>
                <h2>Receitas em destaque</h2>
              </div>

              {!loading && !error && (
                <span className="recipe-count">
                  {displayedRecipes.length}{" "}
                  {displayedRecipes.length === 1 ? "receita" : "receitas"}
                </span>
              )}
            </div>

            {loading && (
              <div className="state-card">
                <div className="spinner" />
                <strong>Carregando receitas...</strong>
                <p>Estamos preparando as melhores sugestões.</p>
              </div>
            )}

            {!loading && error && (
              <div className="state-card state-error">
                <span className="state-icon">!</span>
                <strong>Não conseguimos carregar as receitas.</strong>
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && displayedRecipes.length === 0 && (
              <div className="state-card">
                <span className="state-icon">♡</span>
                <strong>Nenhuma receita por aqui ainda.</strong>
                <p>
                  Tente outra categoria ou adicione algumas receitas aos
                  favoritos.
                </p>
              </div>
            )}

            {!loading && !error && displayedRecipes.length > 0 && (
              <div className="recipe-grid">
                {displayedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={favoriteIds.includes(recipe.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
