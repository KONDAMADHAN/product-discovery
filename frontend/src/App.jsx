import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const [filterCategory, setFilterCategory] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 2;

  // Load products initially
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // 🔍 Filter Function
  const handleFilter = async () => {
    if (!filterCategory && !filterPrice) return;

    let url = "http://127.0.0.1:8000/api/filter?";

    if (filterCategory) {
      url += `category=${filterCategory}&`;
    }

    if (filterPrice) {
      url += `max_price=${filterPrice}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setFilteredProducts(data);
    setCurrentPage(1); // Reset pagination
  };

  // 🧹 Clear Filter
  const handleClearFilter = () => {
    setFilterCategory("");
    setFilterPrice("");
    setFilteredProducts([]);
    setCurrentPage(1);
  };

  // 🤖 Ask Function
  const handleAsk = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResults(data.results || []);
      setSummary(data.summary || "");
    } catch (error) {
      console.error("Error asking products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Determine products to show
  const displayProducts =
    filteredProducts.length > 0 ? filteredProducts : products;

  // 📄 Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = displayProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(displayProducts.length / productsPerPage);

  return (
    <div className="app-container">
      <h1>Product Discovery with AI</h1>

      {/* FILTER SECTION */}
      <h2 className="section-title">Filter Products</h2>
      <div className="input-group">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Accessories">Accessories</option>
        </select>

        <input
          type="number"
          placeholder="Max Price"
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
        />

        <button
          onClick={handleFilter}
          disabled={!filterCategory && !filterPrice}
        >
          Filter
        </button>

        <button
          onClick={handleClearFilter}
          style={{ backgroundColor: "#6b7280" }}
        >
          Clear
        </button>
      </div>

      {filteredProducts.length > 0 && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          Showing {filteredProducts.length} filtered products
        </p>
      )}

      {/* PRODUCT LIST */}
      <h2 className="section-title">All Products</h2>

      {currentProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}

      {/* Pagination Buttons */}
      <div style={{ marginTop: "15px", marginBottom: "25px" }}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            style={{
              marginRight: "5px",
              backgroundColor:
                currentPage === index + 1 ? "#1e40af" : "#2563eb",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* ASK SECTION */}
      <h2 className="section-title">Ask About Products</h2>
      <div className="input-group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about products..."
        />
        <button onClick={handleAsk}>Ask</button>
      </div>

      <h3 className="section-title">Recommended Products:</h3>

      {loading && <p>Loading recommendations...</p>}

      {!loading &&
        results.map((item) => {
          const product = products.find((p) => p.id === item.id);
          return product ? (
            <div key={item.id}>
              <ProductCard product={product} />
              <div
                style={{
                  backgroundColor: "#eef2ff",
                  padding: "6px",
                  borderRadius: "6px",
                  marginBottom: "10px",
                  fontWeight: "bold",
                }}
              >
                Match Score: {item.score}
              </div>
            </div>
          ) : null;
        })}

      {!loading && summary && <p>{summary}</p>}
    </div>
  );
}

export default App;