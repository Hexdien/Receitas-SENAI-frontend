"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeForm } from "@/components/RecipeForm";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/lib/auth-context";
import {
  addFavorite,
  createRecipe,
  deleteRecipe,
  getRecipes,
  removeFavorite,
  updateRecipe,
} from "@/lib/api";
import type { GuideFilter, Recipe, RecipeInput } from "@/types/recipe";

const filterTitles: Record<GuideFilter, { eyebrow: string; title: string }> = {
  all: { eyebrow: "Inspiração para hoje", title: "Receitas que dão vontade de cozinhar" },
  favorites: { eyebrow: "Sua seleção", title: "Receitas favoritas" },
  weekly: { eyebrow: "Mais amadas", title: "Queridinhos da semana" },
  quick: { eyebrow: "Pouco tempo, muito sabor", title: "Receitas rápidas" },
  savory: { eyebrow: "Do café ao jantar", title: "Receitas salgadas" },
  sweet: { eyebrow: "Um carinho em forma de receita", title: "Doces" },
};

/** Texto do estado vazio conforme o filtro escolhido. */
const emptyMessages: Record<GuideFilter, string> = {
  all: "Ainda não há receitas cadastradas.",
  favorites: "Você ainda não favoritou nenhuma receita.",
  weekly: "Ainda não há receitas cadastradas.",
  quick: "Não há receitas de até 30 minutos por aqui.",
  savory: "Não há receitas salgadas cadastradas.",
  sweet: "Não há receitas doces cadastradas.",
};

export default function HomePage() {
  const { user, isAdmin, loading: loadingAuth } = useAuth();

  const [selectedFilter, setSelectedFilter] = useState<GuideFilter>("all");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Recipe | null>(null);
  const [busyId, setBusyId] = useState<Recipe["id"] | null>(null);
  const [notice, setNotice] = useState("");

  const loadRecipes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setRecipes(await getRecipes(selectedFilter));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível carregar as receitas."
      );
    } finally {
      setLoading(false);
    }
  }, [selectedFilter]);

  // Espera a sessão ser restaurada: sem o token, "favoritos" viria vazio
  // e nenhum coração apareceria marcado.
  useEffect(() => {
    if (loadingAuth) return;
    loadRecipes();
  }, [loadRecipes, loadingAuth, user]);

  // Some com o aviso de sucesso depois de alguns segundos.
  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  async function toggleFavorite(id: Recipe["id"]) {
    if (!user) {
      setError("Faça login para salvar receitas nos seus favoritos.");
      return;
    }

    const receita = recipes.find((item) => item.id === id);
    if (!receita) return;

    const eraFavorita = Boolean(receita.favorite);

    setBusyId(id);
    setError("");

    // Atualiza na hora e desfaz se a API recusar.
    setRecipes((atual) =>
      atual.map((item) =>
        item.id === id ? { ...item, favorite: !eraFavorita } : item
      )
    );

    try {
      if (eraFavorita) {
        await removeFavorite(id);
      } else {
        await addFavorite(id);
      }

      // Na aba de favoritos a receita desfavoritada precisa sumir da lista.
      if (eraFavorita && selectedFilter === "favorites") {
        setRecipes((atual) => atual.filter((item) => item.id !== id));
      }
    } catch (err) {
      setRecipes((atual) =>
        atual.map((item) =>
          item.id === id ? { ...item, favorite: eraFavorita } : item
        )
      );

      setError(
        err instanceof Error ? err.message : "Não foi possível atualizar o favorito."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleSubmit(input: RecipeInput) {
    if (editing) {
      await updateRecipe(editing.id, input);
      setNotice("Receita atualizada.");
    } else {
      await createRecipe(input);
      setNotice("Receita criada.");
    }

    setFormOpen(false);
    setEditing(null);
    await loadRecipes();
  }

  async function handleDelete(recipe: Recipe) {
    const confirmado = window.confirm(
      `Excluir "${recipe.title}"? Essa ação não pode ser desfeita.`
    );

    if (!confirmado) return;

    setBusyId(recipe.id);
    setError("");

    try {
      await deleteRecipe(recipe.id);
      setRecipes((atual) => atual.filter((item) => item.id !== recipe.id));
      setNotice("Receita excluída.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível excluir a receita."
      );
    } finally {
      setBusyId(null);
    }
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

              <div className="section-heading-actions">
                {!loading && !error && (
                  <span className="recipe-count">
                    {recipes.length}{" "}
                    {recipes.length === 1 ? "receita" : "receitas"}
                  </span>
                )}

                {isAdmin && (
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() => {
                      setEditing(null);
                      setFormOpen(true);
                    }}
                  >
                    + Nova receita
                  </button>
                )}
              </div>
            </div>

            {notice && <div className="form-success">{notice}</div>}

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
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={loadRecipes}
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {!loading && !error && recipes.length === 0 && (
              <div className="state-card">
                <span className="state-icon">♡</span>
                <strong>Não há receitas</strong>
                <p>{emptyMessages[selectedFilter]}</p>

                {isAdmin && selectedFilter !== "favorites" && (
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() => {
                      setEditing(null);
                      setFormOpen(true);
                    }}
                  >
                    Cadastrar a primeira
                  </button>
                )}
              </div>
            )}

            {!loading && !error && recipes.length > 0 && (
              <div className="recipe-grid">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={Boolean(recipe.favorite)}
                    canManage={isAdmin}
                    busy={busyId === recipe.id}
                    onToggleFavorite={toggleFavorite}
                    onEdit={(item) => {
                      setEditing(item);
                      setFormOpen(true);
                    }}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {formOpen && (
        <RecipeForm
          recipe={editing}
          onSubmit={handleSubmit}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      )}
    </>
  );
}
