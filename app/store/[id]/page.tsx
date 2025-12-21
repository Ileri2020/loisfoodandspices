"use client";

import { Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Similar from "@/components/myComponents/subs/similar";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

interface Product {
  id: string;
  name: string;
  description: string;
  category: any;
  image: string[];
  price: number;
  originalPrice?: number;
  rating: number;
  inStock: boolean;
  features: string[];
  specs: Record<string, string>;
}

/* -------------------------------------------------------------------------- */

const CURRENCY = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/* -------------------------------------------------------------------------- */

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { items, addItem, updateQuantity, removeItem } = useCart();

  const [product, setProduct] = React.useState<Product | null>(null);
  const [rawProduct, setRawProduct] = React.useState<any>(null);
  const [allProducts, setAllProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isAdding, setIsAdding] = React.useState(false);

  /* ----------------------------- Fetch product ----------------------------- */

  React.useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/dbhandler?model=product&id=${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error("Fetch failed");

        setRawProduct(data);

        /** ✅ FIX: calculate stock correctly */
        const totalStock =
          Array.isArray(data.stock)
            ? data.stock.reduce(
                (sum: number, s: any) => sum + (s.addedQuantity ?? 0),
                0
              )
            : 0;

        const transformed: Product = {
          id: data.id,
          name: data.name,
          description: data.description || "",
          category: data.category,
          image: data.images || [],
          price: data.price,
          originalPrice: data.originalPrice || undefined,
          rating: data.reviews?.length
            ? data.reviews.reduce(
                (acc: number, r: any) => acc + r.rating,
                0
              ) / data.reviews.length
            : 0,
          inStock: totalStock > 0,
          features: [],
          specs: {},
        };

        setProduct(transformed);

        const all = await fetch(`/api/dbhandler?model=product`);
        setAllProducts(await all.json());

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  /* ----------------------------- Cart helpers ------------------------------ */

  const cartItem = React.useMemo(
    () => items.find((i) => i.id === id),
    [items, id]
  );

  const quantity = cartItem?.quantity ?? 0;

  const handleDecrease = () => {
    if (!product) return;
    if (quantity <= 1) return removeItem(product.id);
    updateQuantity(product.id, quantity - 1);
  };

  const handleIncrease = () => {
    if (!product) return;
    if (quantity === 0) return addItem(rawProduct, 1);
    updateQuantity(product.id, quantity + 1);
  };

  const handleAddToCart = async () => {
    if (!product || !product.inStock) return;
    setIsAdding(true);
    addItem(rawProduct, 1);
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setIsAdding(false), 400);
  };

  /* ----------------------------- UI States -------------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading product…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button onClick={() => router.push("/store")} className="mt-4">
          Back to Store
        </Button>
      </div>
    );
  }

  /* ----------------------------- Render ---------------------------------- */

  return (
    <div className="min-h-screen py-10">
      <div className="container grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          <img
            src={product.image[0]}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="mt-2 flex items-center gap-2">
            {range(5).map((i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < product.rating
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
            ))}
            <span className="text-sm text-muted-foreground">
              ({product.rating.toFixed(1)})
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold">
            {CURRENCY.format(product.price)}
          </p>

          <p className="mt-2 text-muted-foreground">
            {product.description}
          </p>

          {/* Stock */}
          <p
            className={`mt-4 font-medium ${
              product.inStock ? "text-green-600" : "text-red-500"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </p>

          {/* Controls */}
          <div className="mt-6 flex items-center gap-4">
            <Button size="icon" onClick={handleDecrease} disabled={quantity <= 0}>
              <Minus />
            </Button>

            <span className="w-10 text-center">{quantity}</span>

            <Button size="icon" onClick={handleIncrease}>
              <Plus />
            </Button>
          </div>

          <Button
            className="mt-6 w-full"
            disabled={!product.inStock || isAdding}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isAdding ? "Adding…" : "Add to Cart"}
          </Button>
        </div>
      </div>

      <Separator className="my-10" />

      <Similar similar={allProducts} />
    </div>
  );
}
