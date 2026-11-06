import {
  CheckCircle2,
  PackageX,
  RefreshCw,
  Search,
  UtensilsCrossed,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import EmployeeSidebar from "../../components/EmployeeSidebar/EmployeeSidebar";

import {
  getEmployeeProducts,
  updateEmployeeProductAvailability,
} from "../../services/websiteApi";
import { useEmployee } from "../../context/EmployeeContext";
import "./EmployeeMenu.css";


function EmployeeMenu() {
  const navigate = useNavigate();
  const { employee, employeeLoading, loggingOut,logoutEmployee,} = useEmployee();

  const [products, setProducts] = useState([]);
  

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);


  const [updatingProduct, setUpdatingProduct] =
    useState(null);

  const [error, setError] = useState("");


  /* =====================================
     AUTH
  ===================================== */

async function handleLogout() {
  try {
    setError("");

    await logoutEmployee();

    navigate("/employee/login", {
      replace: true,
    });
  } catch (error) {
    console.error(
      "Employee logout failed:",
      error
    );

    setError(
      error?.detail || "Unable to sign out."
    );
  }
}


  /* =====================================
     PRODUCTS
  ===================================== */

  async function loadProducts(
    showRefresh = false
  ) {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      }

      const data =
        await getEmployeeProducts();

      setProducts(data);
    } catch (error) {
      console.error(
        "Failed to load employee products:",
        error
      );

      if (
        error?.detail ===
          "Authentication credentials were not provided." ||
        error?.detail ===
          "Employee access is required."
      ) {
        navigate(
          "/employee/login",
          { replace: true }
        );

        return;
      }

      setError(
        error?.detail ||
          "Unable to load menu."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }


useEffect(() => {
  if (employeeLoading) return;

  if (!employee) {
    navigate("/employee/login", {
      replace: true,
    });

    return;
  }

  loadProducts();
}, [employeeLoading, employee]);


  /* =====================================
     AVAILABILITY
  ===================================== */

  async function handleAvailability(
    product
  ) {
    if (
      !product ||
      updatingProduct
    ) {
      return;
    }

    const newAvailability =
      !product.is_available;

    try {
      setUpdatingProduct(product.id);
      setError("");

      const updatedProduct =
        await updateEmployeeProductAvailability(
          product.id,
          newAvailability
        );

      setProducts(
        (currentProducts) =>
          currentProducts.map(
            (currentProduct) =>
              currentProduct.id ===
              updatedProduct.id
                ? updatedProduct
                : currentProduct
          )
      );
    } catch (error) {
      console.error(
        "Failed to update product:",
        error
      );

      if (
        error?.detail ===
          "Authentication credentials were not provided." ||
        error?.detail ===
          "Employee access is required."
      ) {
        navigate(
          "/employee/login",
          { replace: true }
        );

        return;
      }

      setError(
        error?.detail ||
          "Unable to update product availability."
      );
    } finally {
      setUpdatingProduct(null);
    }
  }


  /* =====================================
     COUNTS
  ===================================== */

  const counts = useMemo(() => {
    return {
      total: products.length,

      available: products.filter(
        (product) =>
          product.is_available
      ).length,

      soldOut: products.filter(
        (product) =>
          !product.is_available
      ).length,
    };
  }, [products]);


  /* =====================================
     CATEGORIES
  ===================================== */

  const categories = useMemo(() => {
    const names = products
      .map(
        (product) =>
          product.category_name
      )
      .filter(Boolean);

    return [
      "all",
      ...new Set(names),
    ];
  }, [products]);


  /* =====================================
     FILTER PRODUCTS
  ===================================== */

  const visibleProducts =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return products.filter(
        (product) => {
          const productName =
            String(
              product.name || ""
            ).toLowerCase();

          const categoryName =
            String(
              product.category_name || ""
            ).toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            productName.includes(
              normalizedSearch
            ) ||
            categoryName.includes(
              normalizedSearch
            );

          const matchesCategory =
            activeCategory === "all" ||
            product.category_name ===
              activeCategory;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [
      products,
      search,
      activeCategory,
    ]);


  /* =====================================
     RENDER
  ===================================== */

  return (
    <main className="employee-page">

      <EmployeeSidebar
        employee={employee}
        activePage="menu"
        loggingOut={loggingOut}
        onLogout={handleLogout}
      />


      <section className="employee-content">

        {/* HEADER */}

        <header className="employee-header">

          <div>
            <span className="employee-eyebrow">
              MENU MANAGEMENT
            </span>

            <h1>Menu</h1>

            <p>
              Manage product availability
              for your customer menu.
            </p>
          </div>


          <button
            className="employee-refresh"
            type="button"
            onClick={() =>
              loadProducts(true)
            }
            disabled={refreshing}
          >
            <RefreshCw
              size={15}
              className={
                refreshing
                  ? "spinning"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </header>


        {/* STATS */}

        <section className="employee-menu-stats">

          <article className="employee-menu-stat total">
            <div>
              <UtensilsCrossed size={19} />
            </div>

            <span>
              <strong>
                {counts.total}
              </strong>

              <small>
                Total Products
              </small>
            </span>
          </article>


          <article className="employee-menu-stat available">
            <div>
              <CheckCircle2 size={19} />
            </div>

            <span>
              <strong>
                {counts.available}
              </strong>

              <small>
                Available
              </small>
            </span>
          </article>


          <article className="employee-menu-stat sold-out">
            <div>
              <PackageX size={19} />
            </div>

            <span>
              <strong>
                {counts.soldOut}
              </strong>

              <small>
                Sold Out
              </small>
            </span>
          </article>

        </section>


        {/* TOOLBAR */}

        <section className="employee-menu-toolbar">

          <div className="employee-menu-categories">

            {categories.map(
              (category) => (
                <button
                  type="button"
                  key={category}
                  className={
                    activeCategory ===
                    category
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveCategory(
                      category
                    )
                  }
                >
                  {category === "all"
                    ? "All"
                    : category}
                </button>
              )
            )}

          </div>


          <label className="employee-search">

            <Search
              size={16}
              strokeWidth={1.8}
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search menu..."
            />

          </label>

        </section>


        {/* ERROR */}

        {error && (
          <div className="employee-error">
            {error}
          </div>
        )}


        {/* PRODUCTS */}

        {loading ? (
          <div className="employee-state">
            Loading menu...
          </div>
        ) : visibleProducts.length ===
          0 ? (
          <div className="employee-state">
            <strong>
              No products found
            </strong>

            <span>
              Try another category
              or search term.
            </span>
          </div>
        ) : (
          <section className="employee-menu-grid">

            {visibleProducts.map(
              (product) => {

                const isUpdating =
                  updatingProduct ===
                  product.id;

                const image =
                  product.image_url ||
                  product.image;

                return (
                  <article
                    className={`employee-product-card ${
                      product.is_available
                        ? "available"
                        : "sold-out"
                    }`}
                    key={product.id}
                  >

                    {/* IMAGE */}

                    <div className="employee-product-image">

                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                        />
                      ) : (
                        <div className="employee-product-placeholder">
                          <UtensilsCrossed
                            size={28}
                          />
                        </div>
                      )}


                      <span
                        className={`employee-product-status ${
                          product.is_available
                            ? "available"
                            : "sold-out"
                        }`}
                      >
                        <i />

                        {product.is_available
                          ? "Available"
                          : "Sold Out"}
                      </span>

                    </div>


                    {/* CONTENT */}

                    <div className="employee-product-content">

                      <span className="employee-product-category">
                        {product.category_name ||
                          "Menu"}
                      </span>


                      <h2>
                        {product.name}
                      </h2>


                      <div className="employee-product-bottom">

                        <strong className="employee-product-price">
                          {Number(
                            product.price
                          ).toFixed(0)}

                          <small>
                            AED
                          </small>
                        </strong>


                        {/* AVAILABILITY SWITCH */}

                        <label
                          className={`employee-availability-control ${
                            product.is_available
                              ? "available"
                              : "sold-out"
                          }`}
                        >

                          <span>
                            {isUpdating
                              ? "Updating..."
                              : product.is_available
                              ? "Available"
                              : "Sold Out"}
                          </span>


                          <input
                            type="checkbox"
                            checked={
                              product.is_available
                            }
                            disabled={
                              isUpdating
                            }
                            onChange={() =>
                              handleAvailability(
                                product
                              )
                            }
                          />


                          <span className="employee-availability-switch">
                            <i />
                          </span>

                        </label>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </section>
        )}

      </section>

    </main>
  );
}


export default EmployeeMenu;