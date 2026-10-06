import axios from "axios";
import { useEffect, useState } from "react";
import PaymentButton from "./PaymentButton";

function ProductCard() {
  const [products, setProducts] = useState([]);
  const formatPrice = (amount, currency) => {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency || "INR",
        maximumFractionDigits: 2,
      }).format(amount / 100);
    } catch {
      return `${amount.toLocaleString("en-IN")}`;
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/products/get-item")
      .then((response) => {
        console.log("Products fetched successfully:", response.data.products);
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div className="products-container">
      {products.map((products) => (
        <div className="product-card" key={products._id}>
          <img src={products.image} alt={products.title} />

          <div className="product-info">
            <h2>{products.title}</h2>

            <p className="description">{products.description}</p>

            <div className="price">
              {formatPrice(
                products.price?.amount ?? 0,
                products.price?.currency,
              )}
            </div>

            <PaymentButton />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductCard;
