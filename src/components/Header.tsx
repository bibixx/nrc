import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto p-2 flex justify-between items-center">
        <nav className="flex flex-row">
          <div className="px-2 font-bold">
            <Link to="/">Home</Link>
          </div>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
