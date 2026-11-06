
import "./AdminCharts.css";

function BestSellingItems({
  items = [],
  loading = false,
}) {
  const maxQuantity = Math.max(
    ...items.map((item) => Number(item.quantity_sold) || 0),
    1
  );

  return (
    <section className="admin-chart-card admin-bestsellers-card">
      <div className="admin-chart-header">
        <div>
          <span className="admin-chart-eyebrow">
            TOP PRODUCTS
          </span>
          <h2>Best Selling Items</h2>
          <p>Most ordered products by quantity</p>
        </div>
      </div>

      {loading ? (
        <div className="admin-chart-empty" role="status">
          Loading best sellers...
        </div>
      ) : items.length === 0 ? (
        <div className="admin-chart-empty">
          <strong>No sales yet</strong>
          <span>
            Best-selling products will appear here.
          </span>
        </div>
      ) : (
        <div className="admin-bestsellers-list">
          {items.map((item, index) => {
            const quantity =
              Number(item.quantity_sold) || 0;

            const percentage =
              (quantity / maxQuantity) * 100;

            return (
              <div
                className="admin-bestseller-item"
                key={`${item.product_id}-${item.name}`}
              >
                <div className="admin-bestseller-rank">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="admin-bestseller-info">
                  <div className="admin-bestseller-top">
                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {quantity} sold
                    </span>
                  </div>

                  <div className="admin-bestseller-track">
                    <div
                      className="admin-bestseller-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default BestSellingItems;
