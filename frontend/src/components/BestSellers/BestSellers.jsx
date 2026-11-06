import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Plus,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import { getBestSellers } from "../../services/websiteApi";

import "./BestSellers.css";


function BestSellers() {
  const [products, setProducts] = useState([]);
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
     LOAD BEST SELLERS
     ========================= */

  useEffect(() => {
    getBestSellers()
      .then(setProducts)
      .catch((error) => {
        console.error(
          "Best sellers API error:",
          error
        );
      });
  }, []);


  return (
    <section className="best-sellers">
      <div className="best-sellers-container">

        {/* =========================
            HEADER
            ========================= */}

        <div className="best-sellers-header">

          <div>
            <span className="best-sellers-eyebrow">
              MOST LOVED AT JAZI
            </span>

            <h2>
              Best Sellers
            </h2>
          </div>


          <Link
            to="/menu"
            className="best-sellers-view"
          >
            <span>
              View Full Menu
            </span>

            <ArrowRight
              className="view-arrow"
              size={17}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </Link>

        </div>


        {/* =========================
            PRODUCTS
            ========================= */}

        <div className="best-sellers-grid">

          {products
            .slice(0, 3)
            .map((product) => (

              <article
                className="best-seller-card"
                key={product.id}
              >

                {/* PRODUCT IMAGE */}

                <div className="best-seller-image">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  )}
                </div>


                {/* PRODUCT INFO */}

                <div className="best-seller-info">

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    {product.description}
                  </p>


                  <div className="best-seller-bottom">

                    <span className="best-seller-price">
                      {Number(
                        product.price
                      ).toFixed(0)}{" "}
                      AED
                    </span>


                    {/* ADD BUTTON */}

                    <button
                      type="button"
                      className={`best-seller-add ${
                        addedProductId ===
                        product.id
                          ? "added"
                          : ""
                      }`}
                      onClick={() =>
                        handleAddToCart(product)
                      }
                      disabled={
                        !product.is_available
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
                          size={17}
                          strokeWidth={2}
                          aria-hidden="true"
                        />

                      ) : (

                        <Plus
                          size={17}
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

      </div>
    </section>
  );
}


export default BestSellers;