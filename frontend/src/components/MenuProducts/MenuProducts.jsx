import { useMemo, useState } from "react";
import {
  Check,
  Plus,
} from "lucide-react";

import { useCart } from "../../context/CartContext";

import "./MenuProducts.css";


function MenuProducts({
  categories,
  activeCategory,
  search,
}) {
  const [visibleCount, setVisibleCount] =
    useState(6);

  const [addedProductId, setAddedProductId] =
    useState(null);

  const { addToCart } = useCart();


  /* =========================
     ADD TO CART
     ========================= */

  function handleAddToCart(product) {
    addToCart(product);

    setAddedProductId(product.id);

    setTimeout(() => {
      setAddedProductId((currentId) =>
        currentId === product.id
          ? null
          : currentId
      );
    }, 900);
  }


  /* =========================
     FILTER PRODUCTS
     ========================= */

  const filteredProducts = useMemo(() => {
    let products = [];

    if (activeCategory === "all") {
      products = categories.flatMap(
        (category) =>
          category.products.map((product) => ({
            ...product,
            categoryName: category.name,
          }))
      );
    } else {
      const category = categories.find(
        (item) =>
          item.id === activeCategory
      );

      if (category) {
        products = category.products.map(
          (product) => ({
            ...product,
            categoryName: category.name,
          })
        );
      }
    }


    const searchValue =
      search.trim().toLowerCase();


    if (searchValue) {
      products = products.filter(
        (product) => {
          const name =
            product.name?.toLowerCase() || "";

          const nameAr =
            product.name_ar?.toLowerCase() || "";

          const description =
            product.description?.toLowerCase() ||
            "";

          return (
            name.includes(searchValue) ||
            nameAr.includes(searchValue) ||
            description.includes(searchValue)
          );
        }
      );
    }


    return products;
  }, [
    categories,
    activeCategory,
    search,
  ]);


  /* =========================
     VISIBLE PRODUCTS
     ========================= */

  const visibleProducts =
    filteredProducts.slice(0, visibleCount);

  const hasMore =
    visibleCount < filteredProducts.length;


  /* =========================
     SECTION TITLE
     ========================= */

  const currentCategory =
    activeCategory === "all"
      ? null
      : categories.find(
          (category) =>
            category.id === activeCategory
        );

  const sectionTitle = search.trim()
    ? "Search Results"
    : currentCategory?.name || "Our Menu";


  return (
    <section className="menu-products">

      <div className="menu-products-container">

        {/* =========================
            HEADER
            ========================= */}

        <div className="menu-products-header">

          <div>

            <span className="menu-products-eyebrow">
              {search.trim()
                ? "DISCOVER YOUR FAVOURITES"
                : "CRAFTED AT JAZI"}
            </span>


            <h2>
              {sectionTitle}
            </h2>


            <div
              className="menu-products-decoration"
              aria-hidden="true"
            >
              <span />
              <i />
              <span />
            </div>

          </div>


          {!search.trim() && (
            <p>
              Premium ingredients, bold flavours,
              <br />
              and an unforgettable experience.
            </p>
          )}

        </div>


        {/* =========================
            PRODUCTS
            ========================= */}

        {visibleProducts.length > 0 ? (
          <>

            <div className="menu-products-grid">

              {visibleProducts.map((product) => (
                <article
                  key={product.id}
                  className={`menu-product-card ${
                    !product.is_available
                      ? "unavailable"
                      : ""
                  }`}
                >

                  {/* =========================
                      IMAGE
                      ========================= */}

                  <div className="menu-product-image">

                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                    ) : (
                      <div className="menu-product-no-image">
                        JAZI
                      </div>
                    )}


                    {/* CATEGORY */}

                    <span className="menu-product-category">
                      {product.categoryName}
                    </span>


                    {/* BADGES */}

                    {product.is_best_seller && (
                      <span className="menu-product-badge">
                        BEST SELLER
                      </span>
                    )}


                    {!product.is_best_seller &&
                      product.is_new && (
                        <span className="menu-product-badge">
                          NEW
                        </span>
                      )}


                    {/* SOLD OUT */}

                    {!product.is_available && (
                      <div className="menu-product-soldout">
                        SOLD OUT
                      </div>
                    )}

                  </div>


                  {/* =========================
                      CONTENT
                      ========================= */}

                  <div className="menu-product-content">

                    <h3>
                      {product.name}
                    </h3>


                    {product.description && (
                      <p>
                        {product.description}
                      </p>
                    )}


                    <div className="menu-product-bottom">

                      <span className="menu-product-price">
                        {Number(
                          product.price
                        ).toFixed(0)}

                        <small>
                          AED
                        </small>
                      </span>


                      {/* ADD TO CART */}

                      <button
                        type="button"
                        className={`menu-product-add ${
                          addedProductId ===
                          product.id
                            ? "added"
                            : ""
                        }`}
                        disabled={
                          !product.is_available
                        }
                        onClick={() =>
                          handleAddToCart(product)
                        }
                        aria-label={
                          addedProductId ===
                          product.id
                            ? `${product.name} added to order`
                            : `Add ${product.name} to order`
                        }
                      >

                        {addedProductId ===
                        product.id ? (
                          <Check
                            size={18}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        ) : (
                          <Plus
                            size={19}
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                        )}

                      </button>

                    </div>

                  </div>

                </article>
              ))}

            </div>


            {/* =========================
                LOAD MORE
                ========================= */}

            {hasMore && (
              <div className="menu-load-more-wrapper">

                <button
                  type="button"
                  className="menu-load-more"
                  onClick={() =>
                    setVisibleCount(
                      (count) => count + 6
                    )
                  }
                >
                  LOAD MORE
                </button>

              </div>
            )}

          </>
        ) : (

          /* =========================
             EMPTY RESULTS
             ========================= */

          <div className="menu-empty">

            <span>
              JAZI
            </span>

            <h3>
              No dishes found
            </h3>

            <p>
              Try another dish name or choose a
              different category.
            </p>

          </div>

        )}

      </div>

    </section>
  );
}


export default MenuProducts;