import { Link } from "react-router-dom";
import { usePathname } from "../hooks/usePathname";
import { cn } from "../lib/utils";

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-2 p-4">
      <h2 className="mb-2 text-lg font-semibold">Navegación</h2>
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
              isActive ? "bg-accent" : "transparent",
              item.className // Permitir clases personalizadas
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
            {/* Agregar badge de "Nuevo" para el chat */}
            {item.href === "/dashboard/chat" && (
              <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                Nuevo
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
} 