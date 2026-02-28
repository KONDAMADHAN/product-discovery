from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
import time
import re

app = FastAPI()

# -----------------------------
# CORS Configuration
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development (restrict in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Logging Middleware
# -----------------------------
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    process_time = time.time() - start_time

    print(
        f"{request.method} {request.url.path} "
        f"completed in {process_time:.4f} seconds"
    )

    return response


# -----------------------------
# Mock Product Catalog
# -----------------------------
products = [
    {
        "id": "P001",
        "name": "Gaming Laptop",
        "category": "Electronics",
        "price": 1200,
        "description": "High performance laptop for gaming"
    },
    {
        "id": "P002",
        "name": "Budget Laptop",
        "category": "Electronics",
        "price": 500,
        "description": "Affordable laptop for students"
    },
    {
        "id": "P003",
        "name": "Wireless Headphones",
        "category": "Accessories",
        "price": 150,
        "description": "Noise cancelling headphones"
    }
]


# -----------------------------
# GET: All Products
# -----------------------------
@app.get("/api/products")
def get_products():
    return products


# -----------------------------
# GET: Filter Products
# -----------------------------
@app.get("/api/filter")
def filter_products(category: str = None, max_price: int = None):
    filtered = products

    if category:
        filtered = [
            p for p in filtered
            if p["category"].lower() == category.lower()
        ]

    if max_price:
        filtered = [
            p for p in filtered
            if p["price"] <= max_price
        ]

    return filtered


# -----------------------------
# Query Model
# -----------------------------
class Query(BaseModel):
    query: str


# -----------------------------
# POST: Ask (Ranking Logic)
# -----------------------------
@app.post("/api/ask")
async def ask_products(q: Query):

    query_text = q.query.lower()
    words = query_text.split()

    matched_products = []

    # Extract numeric price (e.g., "under 1000")
    price_limit = None
    numbers = re.findall(r"\d+", query_text)
    if numbers:
        price_limit = int(numbers[0])

    for product in products:
        score = 0

        product_name = product["name"].lower()
        product_category = product["category"].lower()
        product_description = product["description"].lower()

        # Token-based matching
        for word in words:
            if word in product_name:
                score += 3
            if word in product_category:
                score += 2
            if word in product_description:
                score += 1

        # Cheap / budget boost
        if "cheap" in query_text or "budget" in query_text:
            if product["price"] <= 600:
                score += 3

        # Price filtering logic
        if price_limit:
            if product["price"] <= price_limit:
                score += 2
            else:
                score -= 2  # penalize expensive items

        if score > 0:
            matched_products.append({
                "product": product,
                "score": score
            })

    # Sort by score (descending)
    matched_products.sort(key=lambda x: x["score"], reverse=True)

    # Edge case: If nothing matched
    if not matched_products:
        matched_products = [
            {"product": p, "score": 0}
            for p in products
        ]

    return {
        "results": [
            {
                "id": item["product"]["id"],
                "score": item["score"]
            }
            for item in matched_products
        ],
        "summary": f"Found {len(matched_products)} relevant products ranked by match score."
    }