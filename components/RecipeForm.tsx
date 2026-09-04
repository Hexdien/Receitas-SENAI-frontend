"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { Recipe, RecipeInput } from "@/types/recipe";

type RecipeFormProps = {
  recipe?: Recipe | null;
  onSubmit: (input: RecipeInput) => Promise<void>;
  onClose: () => void;
};

const TAMANHO_MAXIMO = 5 * 1024 * 1024; // igual ao limite do backend

export function RecipeForm({ recipe, onSubmit, onClose }: RecipeFormProps) {
  const editando = Boolean(recipe);

  const [nome, setNome] = useState(recipe?.title ?? "");
  const [desc, setDesc] = useState(recipe?.description ?? "");
  const [tempo, setTempo] = useState(String(recipe?.prepTime ?? ""));
  const [categoria, setCategoria] = useState(
    recipe?.category?.toLowerCase() ?? ""
  );
  const [imagem, setImagem] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(recipe?.imageUrl ?? null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);

  // Esc fecha o formulário.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Libera a URL temporária do preview para não vazar memória.
  useEffect(() => {
    if (!imagem) return;

    const url = URL.createObjectURL(imagem);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [imagem]);

  function handleFile(file: File | null) {
    setError("");

    if (!file) {
      setImagem(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Escolha um arquivo de imagem (JPG, PNG, WEBP ou GIF).");
      return;
    }

    if (file.size > TAMANHO_MAXIMO) {
      setError("A imagem deve ter no máximo 5 MB.");
      return;
    }

    setImagem(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const minutos = Number(tempo);

    if (!nome.trim()) {
      setError("Informe o nome da receita.");
      return;
    }

    if (!desc.trim()) {
      setError("Informe a descrição da receita.");
      return;
    }

    if (!Number.isFinite(minutos) || minutos < 1 || minutos > 1440) {
      setError("O tempo de preparo deve ficar entre 1 e 1440 minutos.");
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        nome: nome.trim(),
        desc: desc.trim(),
        tempo: minutos,
        categoria: categoria || undefined,
        imagem,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível salvar a receita."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === dialogRef.current?.parentElement) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-form-title"
        ref={dialogRef}
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">
              {editando ? "Editar receita" : "Nova receita"}
            </span>
            <h2 id="recipe-form-title">
              {editando ? recipe?.title : "Adicionar ao cardápio"}
            </h2>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            <span>Nome</span>
            <input
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Bolo de cenoura"
              maxLength={120}
              required
            />
          </label>

          <label>
            <span>Descrição</span>
            <textarea
              value={desc}
              onChange={(event) => setDesc(event.target.value)}
              placeholder="Conte em poucas linhas como é a receita."
              rows={4}
              maxLength={1000}
              required
            />
          </label>

          <div className="modal-form-row">
            <label>
              <span>Tempo de preparo (min)</span>
              <input
                type="number"
                value={tempo}
                onChange={(event) => setTempo(event.target.value)}
                min={1}
                max={1440}
                placeholder="45"
                required
              />
            </label>

            <label>
              <span>Categoria</span>
              <select
                value={categoria}
                onChange={(event) => setCategoria(event.target.value)}
              >
                <option value="">Sem categoria</option>
                <option value="doce">Doce</option>
                <option value="salgada">Salgada</option>
              </select>
            </label>
          </div>

          <label>
            <span>
              Foto da receita{" "}
              <small>{editando ? "(deixe vazio para manter a atual)" : "(opcional)"}</small>
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
            />
          </label>

          {preview && (
            <div className="modal-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Prévia da foto da receita" />
            </div>
          )}

          {error && <div className="form-error">{error}</div>}

          <div className="modal-actions">
            <button
              type="button"
              className="button button-ghost"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="button button-primary"
              disabled={saving}
            >
              {saving ? "Salvando..." : editando ? "Salvar alterações" : "Criar receita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
