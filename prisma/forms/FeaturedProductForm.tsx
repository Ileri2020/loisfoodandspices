import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price?: number;
  description?: string;
}

interface FeaturedProduct {
  id: string;
  productId: string;
  product: Product;
}

const MAX_FEATURED_PRODUCTS = 16;

export default function FeaturedProductForm() {
  const [featuredProduct, setFeaturedProduct] = useState<FeaturedProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
  });

  const [editId, setEditId] = useState<string | null>(null);

  /* ===============================
     Fetching
  ================================ */
  useEffect(() => {
    refreshAll();
  }, []);

  const refreshAll = async () => {
    await Promise.all([fetchFeaturedProduct(), fetchProducts()]);
  };

  const fetchFeaturedProduct = async () => {
    try {
      const res = await axios.get("/api/dbhandler?model=featuredProduct");
      setFeaturedProduct(res.data);
    } catch (err) {
      console.error("Failed to fetch featured products", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/dbhandler?model=product");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  /* ===============================
     Derived State
  ================================ */
  const featuredIds = useMemo(
    () => new Set(featuredProduct.map((f) => f.productId)),
    [featuredProduct]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const isLimitReached =
    featuredProduct.length >= MAX_FEATURED_PRODUCTS && !editId;

  /* ===============================
     Actions
  ================================ */

  // 🔥 OPTION 1: Direct POST when "Feature" is clicked
  const handleFeatureClick = async (item: Product) => {
    if (featuredIds.has(item.id)) return;

    if (featuredProduct.length >= MAX_FEATURED_PRODUCTS) {
      alert(`You can only feature up to ${MAX_FEATURED_PRODUCTS} products.`);
      return;
    }

    try {
      await axios.post("/api/dbhandler?model=featuredProduct", {
        productId: item.id,
      });

      await refreshAll();
    } catch (err) {
      console.error("Failed to feature product:", err);
    }
  };

  // Used only for EDIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editId || !formData.productId) return;

    try {
      await axios.put(
        `/api/dbhandler?model=featuredProduct&id=${editId}`,
        { productId: formData.productId }
      );

      resetForm();
      refreshAll();
    } catch (err) {
      console.error("Failed to update featured product:", err);
    }
  };

  const handleEdit = (item: FeaturedProduct) => {
    setFormData({
      productId: item.productId,
      productName: item.product?.name || "",
    });
    setEditId(item.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/dbhandler?model=featuredProduct&id=${id}`);
      refreshAll();
    } catch (err) {
      console.error("Failed to delete featured product", err);
    }
  };

  const resetForm = () => {
    setFormData({ productId: "", productName: "" });
    setEditId(null);
  };

  /* ===============================
     Render
  ================================ */
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">
        Manage Home Page Featured Products
      </h2>

      {/* ===============================
          FORM (EDIT ONLY)
      ================================ */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-md gap-2 p-3 border-2 border-secondary-foreground rounded-md"
      >
        <h3 className="font-semibold">
          Select Product to Feature ({featuredProduct.length}/{MAX_FEATURED_PRODUCTS})
        </h3>

        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Product List */}
        <ul className="mb-2 max-h-64 overflow-y-auto">
          {filteredProducts.map((item, index) => {
            const isFeatured = featuredIds.has(item.id);

            return (
              <li
                key={item.id}
                className="flex flex-col gap-1 my-2 bg-secondary rounded-md p-2"
              >
                <div className="flex justify-between w-full">
                  <span>
                    {index + 1}. {item.name}
                  </span>
                  <span>Price: {item.price ?? <em>No price</em>}</span>
                </div>

                <Button
                  type="button"
                  onClick={() => handleFeatureClick(item)}
                  disabled={isFeatured || isLimitReached}
                  variant={isFeatured ? "ghost" : "default"}
                >
                  {isFeatured
                    ? "Already Featured"
                    : isLimitReached
                    ? "Limit Reached"
                    : "Feature"}
                </Button>
              </li>
            );
          })}
        </ul>

        {editId && (
          <>
            <Input value={formData.productName} disabled />
            <Input value={formData.productId} disabled />

            <Button type="submit">Update</Button>
            <Button type="button" onClick={resetForm} variant="ghost">
              Cancel
            </Button>
          </>
        )}
      </form>

      {/* ===============================
          FEATURED LIST
      ================================ */}
      <h3 className="mt-4 font-semibold">Added Featured Products</h3>

      <ul>
        {featuredProduct.map((item, index) => (
          <li
            key={item.id}
            className="flex flex-col gap-1 my-2 bg-secondary rounded-md p-2"
          >
            <div className="flex justify-between w-full">
              <span>
                {index + 1}. {item.product?.name ?? "Unnamed Product"}
              </span>
              <span>
                Price: {item.product?.price ?? <em>No price</em>}
              </span>
            </div>

            <div className="flex gap-2 mt-1">
              <Button type="button" onClick={() => handleEdit(item)}>
                Edit
              </Button>
              <Button
                type="button"
                onClick={() => handleDelete(item.id)}
                variant="ghost"
                className="border-2 border-accent"
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
