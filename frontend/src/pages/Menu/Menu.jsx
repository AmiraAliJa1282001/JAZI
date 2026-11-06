import { useEffect, useMemo, useState } from "react";

import MenuHero from "../../components/MenuHero/MenuHero";
import MenuFilters from "../../components/MenuFilters/MenuFilters";
import MenuProducts from "../../components/MenuProducts/MenuProducts";

function Menu() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/menu/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }

        return response.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Menu API error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  }, [categories]);

  return (
    <main>
      <MenuHero />

      <MenuFilters
        categories={categoryOptions}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        search={search}
        setSearch={setSearch}
      />

      {!loading && (
        <MenuProducts
          categories={categories}
          activeCategory={activeCategory}
          search={search}
        />
      )}

      {loading && (
        <div className="menu-loading">
          Loading menu...
        </div>
      )}

      
    </main>
  );
}

export default Menu;