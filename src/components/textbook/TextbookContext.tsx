import { createContext, useContext } from "react";

/** Каталог части, из которой рендерится markdown, — база для относительных ссылок. */
export const TextbookContext = createContext<{ partDir: string }>({ partDir: "" });

export const useTextbookContext = () => useContext(TextbookContext);
