import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Language, LanguageProvider } from "../contexts/LanguageContext";
import { useState } from "react";
import { Button } from "flowbite-react";

export const Route = createRootRoute({
  component: App,
});

function App() {
  const [lang, setLang] = useState<Language>("fr");

  return (
    <LanguageProvider
      value={{
        lang,
        setLang,
      }}
    >
      <div className="flex flex-col min-h-screen">
        <nav className="flex flex-row justify-between items-center bg-gray-800 text-slate-200 font-bold py-5 px-10">
          <h6 className="text-white">MSM Payments</h6>
          <Button.Group className="">
            <Button
              onClick={() => setLang("fr")}
              className="bg-gray-700 hover:bg-gray-600 text-white"
              disabled={lang === "fr"}
            >
              FR
            </Button>
            <Button
              onClick={() => setLang("en")}
              className="bg-gray-700 hover:bg-gray-600 text-white"
              disabled={lang === "en"}
            >
              EN
            </Button>
          </Button.Group>
        </nav>
        <main
          className="px-5 py-20 items-center flex flex-col flex-grow"
          style={{
            backgroundColor: "#f9f9f9",
          }}
        >
          <Outlet />
        </main>
        <TanStackRouterDevtools />
      </div>
    </LanguageProvider>
  );
}
