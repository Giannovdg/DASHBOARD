import { useContext } from "react";
import { SupabaseAuthContext } from "../contexts/SupabaseAuthContext";

export const useSupabaseAuth = () => useContext(SupabaseAuthContext); 