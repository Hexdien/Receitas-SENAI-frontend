import type { GuideFilter } from "@/types/recipe";

type SidebarProps = {
  selected: GuideFilter;
  onSelect: (filter: GuideFilter) => void;
};

const items: Array<{
  key: GuideFilter;
  icon: string;
  label: string;
  description: string;
}> = [
  { key: "all", icon: "⌂", label: "Descobrir", description: "Todas as receitas" },
  { key: "favorites", icon: "♥", label: "Favoritos", description: "As que você salvou" },
  { key: "weekly", icon: "✦", label: "Queridinhos", description: "Destaques da semana" },
  { key: "quick", icon: "◷", label: "Receitas rápidas", description: "Até 30 minutos" },
  { key: "savory", icon: "♨", label: "Salgadas", description: "Para qualquer refeição" },
  { key: "sweet", icon: "✿", label: "Doces", description: "Para adoçar o dia" },
];

export function Sidebar({ selected, onSelect }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-heading">
        <span>Guia</span>
        <p>Encontre seu próximo prato</p>
      </div>

      <div className="guide-list">
        {items.map((item) => (
          <button
            type="button"
            key={item.key}
            className={`guide-item ${selected === item.key ? "active" : ""}`}
            onClick={() => onSelect(item.key)}
          >
            <span className="guide-icon" aria-hidden="true">{item.icon}</span>
            <span className="guide-copy">
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </span>
          </button>
        ))}
      </div>

      <div className="sidebar-note">
        <span className="sidebar-note-icon">✦</span>
        <strong>Cozinhar pode ser simples.</strong>
        <p>Salve suas receitas favoritas e volte quando quiser.</p>
      </div>
    </aside>
  );
}
