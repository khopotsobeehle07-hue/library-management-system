import { useContext } from "react";
import AuthStateContext from "../context/AuthStateContext";

export function useAuth() {
  return useContext(AuthStateContext);
}