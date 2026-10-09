import { useContext } from "react";
import BooksStateContext from "../context/BooksStateContext";

export function useBooks() {
  return useContext(BooksStateContext);
}