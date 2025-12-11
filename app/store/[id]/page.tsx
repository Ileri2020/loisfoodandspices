"use client";

import { Minus, Plus, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Similar from "@/components/myComponents/subs/similar";

/* -------------------------------------------------------------------------- */
/*                               Type declarations                            */
/* -------------------------------------------------------------------------- */

interface Product {
  category: string;
  description: string;
  features: string[];
  id: string;
  image: string[];
  inStock: boolean;
  name: string;
  originalPrice?: number;
  price: number;
  rating: number;
  specs: Record<string, string>;
}

/* -------------------------------------------------------------------------- */
/*                        Helpers (shared, memo-safe)                         */
/* -------------------------------------------------------------------------- */

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

const range = (length: number) => Array.from({ length }, (_, i) => i);

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { items, addItem, updateQuantity, removeItem } = useCart();

  const [product, setProduct] = React.useState<Product | null>(null);
  const [allProduct, setAllProduct] = React.useState<Product[] | null>([]);
  const [rawproduct, setrawProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isAdding, setIsAdding] = React.useState(false);

  /* ----------------------------- Fetch product ---------------------------- */
  React.useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/dbhandler?model=product&id=${id}`);
        const data = await res.json();

        if (!res.ok) {
          console.error("Failed to fetch product:", data.error);
          return;
        }

        setrawProduct(data);

        const transformed: Product = {
          id: data.id,
          name: data.name,
          category: data.category?.name || data.category || "",
          description: data.description || "",
          image: data.images || [],
          price: data.price,
          originalPrice: data.originalPrice || undefined,
          rating: data.reviews?.length
            ? data.reviews.reduce(
                (acc: number, r: any) => acc + r.rating,
                0
              ) / data.reviews.length
            : 0,
          inStock: data.stock?.quantity > 0,
          features: data.features || [],
          specs: data.specs || {},
        };

        setProduct(transformed);

        const allProduct = await fetch(`/api/dbhandler?model=product`);
        const productsdata = await allProduct.json();

        if (!allProduct.ok) {
          console.error("Failed to fetch product:", data.error);
          return;
        }

        console.log("all products", productsdata);

        setAllProduct(productsdata);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    }

    fetchProduct();
  }, [id]);

  /* ---------------------------- Derived cart item ---------------------------- */

  const cartItem = React.useMemo(
    () => items.find((i) => i.id === id),
    [items, id]
  );

  const quantity = cartItem?.quantity ?? 0;

  const discountPercentage = React.useMemo(() => {
    if (!product?.originalPrice) return 0;
    return Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
  }, [product]);

  /* ----------------------------- Handlers --------------------------------- */

  // AUTO-ADD / AUTO-REMOVE LOGIC APPLIED HERE
  const handleDecrease = () => {
    if (!product) return;

    if (quantity <= 1) {
      removeItem(product.id); // auto-remove when reaching 0
      return;
    }

    updateQuantity(product.id, quantity - 1);
  };

  const handleIncrease = () => {
    if (!product) return;

    if (quantity === 0) {
      addItem(rawproduct, 1); // auto-add when increasing from 0
      return;
    }

    updateQuantity(product.id, quantity + 1);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAdding(true);
    addItem(rawproduct, 1); // KEEPING RAWPRODUCT EXACTLY AS YOU WANT
    toast.success(`${product.name} added to cart`);
    await new Promise((r) => setTimeout(r, 400));
    setIsAdding(false);
  };

  /* -------------------------- Loading / Not Found ------------------------ */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 py-10">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold">Product Not Found</h1>
            <p className="mt-4">
              The product you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button className="mt-6" onClick={() => router.push("/products")}>
              Back to Products
            </Button>
          </div>
        </main>
      </div>
    );
  }

  /* ------------------------------ Markup --------------------------------- */

  return (
    <div className="flex min-h-screen flex-col w-screen overflow-clip">
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6">
          {/* Back link */}
          <Button
            aria-label="Back to products"
            className="mb-6"
            onClick={() => router.push("/store")}
            variant="ghost"
          >
            ← Back to Store
          </Button>

          {/* Main grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Product image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted max-w-md flex justify-center items-center">
              <img
                alt={product.name}
                className="object-cover"
                src={product.image[0]}
              />
              {discountPercentage > 0 && (
                <div className="absolute top-2 left-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                  -{discountPercentage}%
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex flex-col">
              {/* Title & rating */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="mt-2 flex items-center gap-2">
                  <div
                    aria-label={`Rating ${product.rating} out of 5`}
                    className="flex items-center"
                  >
                    {range(5).map((i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? "fill-primary text-primary"
                            : i < product.rating
                            ? "fill-primary/50 text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.rating.toFixed(1)})
                  </span>
                </div>
              </div>

              {/* Category & prices */}
              <div className="mb-6">
                <p className="text-lg font-medium text-muted-foreground">
                  {product.category}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-3xl font-bold">
                    {CURRENCY_FORMATTER.format(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      {CURRENCY_FORMATTER.format(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="mb-6 text-muted-foreground">{product.description}</p>

              {/* Stock */}
              <div aria-live="polite" className="mb-6">
                {product.inStock ? (
                  <p className="text-sm font-medium text-green-600">In Stock</p>
                ) : (
                  <p className="text-sm font-medium text-red-500">
                    Out of Stock
                  </p>
                )}
              </div>

              {/* Quantity selector & Add to cart */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center">
                  <Button
                    aria-label="Decrease quantity"
                    disabled={quantity <= 0}
                    onClick={handleDecrease}
                    size="icon"
                    variant="outline"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="w-12 text-center select-none">
                    {quantity}
                  </span>

                  <Button
                    aria-label="Increase quantity"
                    onClick={handleIncrease}
                    size="icon"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  className="flex-1"
                  disabled={!product.inStock || isAdding}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isAdding ? "Adding…" : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Features & Specs */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <section>
              <h2 className="mb-4 text-2xl font-bold">Features</h2>
              <ul className="space-y-2">
                {product.features.map((feature) => (
                  <li
                    className="flex items-start"
                    key={slugify(feature)}
                  >
                    <span className="mt-1 mr-2 h-2 w-2 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold">Specifications</h2>
              <div className="space-y-2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    className="flex justify-between border-b pb-2 text-sm"
                    key={key}
                  >
                    <span className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </section>
            <div>
              <div><Similar similar={allProduct} /></div>
            </div>
          </div>
        </div>
        
      </main>
    </div>
  );
}
