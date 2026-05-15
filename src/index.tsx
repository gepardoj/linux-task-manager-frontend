import { ContainerNode, render } from "preact";
import { LocationProvider, Router, Route } from "preact-iso";

import { Header } from "./components/Header.jsx";
import { Home } from "./pages/Home/index.jsx";
import { NotFound } from "./pages/_404.jsx";
import "./style.css";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  return (
    <LocationProvider>
      <QueryClientProvider client={queryClient}>
        <Header />
        <main>
          <Router>
            <Route path="/" component={Home} />
            <Route default component={NotFound} />
          </Router>
          <Toaster position="bottom-left" richColors />
        </main>
      </QueryClientProvider>
    </LocationProvider>
  );
}

render(<App />, document.getElementById("app") as ContainerNode);
