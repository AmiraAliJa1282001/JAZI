import {
  Search,
  X,
} from "lucide-react";

import "./MenuFilters.css";


function MenuFilters({
  categories,
  activeCategory,
  setActiveCategory,
  search,
  setSearch,
}) {
  return (
    <section className="menu-filters">

      <div className="menu-filters-container">

        {/* =========================
            CATEGORIES
            ========================= */}

        <div className="menu-category-list">

          <button
            type="button"
            className={
              activeCategory === "all"
                ? "menu-category active"
                : "menu-category"
            }
            onClick={() =>
              setActiveCategory("all")
            }
          >
            ALL
          </button>


          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={
                activeCategory === category.id
                  ? "menu-category active"
                  : "menu-category"
              }
              onClick={() =>
                setActiveCategory(category.id)
              }
            >
              {category.name}
            </button>
          ))}

        </div>


        {/* =========================
            SEARCH
            ========================= */}

        <div className="menu-search">

          <Search
            className="menu-search-icon"
            size={19}
            strokeWidth={1.7}
            aria-hidden="true"
          />


          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search for a dish..."
            aria-label="Search menu"
          />


          {search && (
            <button
              type="button"
              className="menu-search-clear"
              onClick={() =>
                setSearch("")
              }
              aria-label="Clear search"
            >
              <X
                size={17}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>
          )}

        </div>

      </div>

    </section>
  );
}


export default MenuFilters;