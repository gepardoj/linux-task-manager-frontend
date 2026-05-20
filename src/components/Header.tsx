import { useLocation } from "preact-iso";

export function Header() {
  const { url } = useLocation();

  return (
    <header>
      <nav>
        <a href="/" class={url == "/" && "active"}>
          Processes
        </a>
      </nav>
    </header>
  );
}
