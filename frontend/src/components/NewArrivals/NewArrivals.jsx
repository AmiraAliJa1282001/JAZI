import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Plus,
} from "lucide-react";

import { getNewProducts } from "../../services/websiteApi";
import { useCart } from "../../context/CartContext";

import "./NewArrivals.css";


function NewArrivals() {
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
     LOAD NEW PRODUCTS
     ========================= */

  useEffect(() => {
    getNewProducts()
      .then(setProducts)
      .catch((error) => {
        console.error(
          "New products API error:",
          error
        );
      });
  }, []);


  return (
    <section className="new-arrivals">
      <div className="new-arrivals-container">

        {/* =========================
            HEADER
            ========================= */}

        <div className="new-arrivals-header">

          <div>
            <span className="new-arrivals-eyebrow">
              NEW AT JAZI
            </span>

            <h2>
              New Arrivals
            </h2>
          </div>


          <Link
            to="/menu"
            className="new-arrivals-view"
          >
            <span>
              View All New Items
            </span>

            <ArrowRight
              className="new-arrivals-arrow"
              size={17}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </Link>

        </div>


        {/* =========================
            PRODUCTS
            ========================= */}

        <div className="new-arrivals-grid">

          {products
            .slice(0, 3)
            .map((product) => (

              <article
                className="new-arrival-card"
                key={product.id}
              >

                {/* PRODUCT IMAGE */}

                <div className="new-arrival-image">

                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  )}

                  <span className="new-arrival-badge">
                    NEW
                  </span>

                </div>


                {/* PRODUCT INFO */}

                <div className="new-arrival-info">

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    {product.description}
                  </p>


                  <div className="new-arrival-bottom">

                    <span className="new-arrival-price">
                      {Number(
                        product.price
                      ).toFixed(0)}{" "}
                      AED
                    </span>


                    {/* ADD BUTTON */}

                    <button
                      type="button"
                      className={`new-arrival-add ${
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


export default NewArrivals;