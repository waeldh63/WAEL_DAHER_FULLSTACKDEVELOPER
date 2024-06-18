"use client";
import styles from "./page.module.css";
import CreatingPosts from "./pages/CreatingPosts";
import { useEffect } from "react";
import { DataProvider } from "./context/DataContext";
export default function Home() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return (
    <DataProvider>
      <main className={styles.main}>
        <CreatingPosts />
      </main>{" "}
    </DataProvider>
  );
}
