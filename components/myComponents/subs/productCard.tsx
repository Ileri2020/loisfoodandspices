"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import * as React from "react";

type ProductCardProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onError"
> & {
  orientation?: "vertical" | "horizontal"; // ✅ added (no implementation)
  onAddToCart?: (product: any) => void;
  onAddToWishlist?: (productId: string) => void;
  // product: {
  //   category: any;
  //   id: string;
  //   images: any;
  //   inStock?: boolean;
  //   name: string;
  //   price: number; // treated as discounted price
  //   rating?: number;
  // };
  product: any;
  variant?: "compact" | "default";
};

export function ProductCard({
  className,
  orientation = "vertical",
  onAddToCart,
  onAddToWishlist,
  product,
  variant = "default",
  ...props
}: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);
  const [isInWishlist, setIsInWishlist] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      setIsAddingToCart(true);
      setTimeout(() => {
        onAddToCart(product);
        setIsAddingToCart(false);
      }, 600);
    }
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToWishlist) {
      setIsInWishlist(!isInWishlist);
      onAddToWishlist(product.id);
    }
  };

  /**
   * Pricing logic
   * product.price = discounted price
   * originalPrice = +30%
   */
  const DISCOUNT_PERCENT = 30;
  const discountedPrice = product.price;
  const originalPrice = Math.round(
    discountedPrice / (1 - DISCOUNT_PERCENT / 100)
  );

  const renderStars = () => {
    const rating = product.rating ?? 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={`star-${product.id}-${i}`}
            className={cn(
              "h-4 w-4",
              i < fullStars
                ? "fill-yellow-400 text-yellow-400"
                : i === fullStars && hasHalfStar
                ? "fill-yellow-400/50 text-yellow-400"
                : "stroke-muted/40 text-muted"
            )}
          />
        ))}
        {rating > 0 && (
          <span className="ml-1 text-xs text-muted-foreground">
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={cn("group", className)} {...props}>
      <Link href={`/store/${product.id}`}>
        <Card
           className={cn(
              `
                relative w-full overflow-clip rounded-lg py-0 transition-all
                duration-200 ease-in-out
                shadow-md m-1 flex md:flex-col
              `,
              orientation === "horizontal" ? "flex-row" : "flex-col",
              isHovered && "ring-1 ring-primary/20"
            )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className={cn(
              "relative aspect-square overflow-hidden rounded-t-lg flex justify-center items-center bg-muted md:w-full",
              orientation === "horizontal" ? "w-[40%]" : "w-full"
            )}
          >
            {product.images && (
              <img
                alt={product.name}
                className={cn(
                  "object-cover w-full transition-transform duration-300 ease-in-out",
                  isHovered && "scale-105"
                )}
                src={product.images[0]}
              />
            )}

            {/* Category badge */}
            <Badge
              className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm"
              variant="outline"
            >
              {product.category.name}
            </Badge>

            {/* Discount badge */}
            <Badge
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground"
            >
              {DISCOUNT_PERCENT}% OFF
            </Badge>

            {/* Wishlist */}
            <Button
              className={cn(
                `
                  absolute right-2 bottom-2 z-10 rounded-full bg-background/80
                  backdrop-blur-sm transition-opacity duration-300
                `,
                !isHovered && !isInWishlist && "opacity-0"
              )}
              onClick={handleAddToWishlist}
              size="icon"
              type="button"
              variant="outline"
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  isInWishlist
                    ? "fill-destructive text-destructive"
                    : "text-muted-foreground"
                )}
              />
            </Button>
          </div>

          <div className="w-full flex-1">
            <CardContent className="p-4 pt-4">
              <h3 className="line-clamp-2 text-base font-semibold group-hover:text-primary">
                {product.name}
              </h3>

              {variant === "default" && (
                <>
                  <div className="mt-1.5">{renderStars()}</div>

                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="font-medium text-foreground">
                      ₦{discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ₦{originalPrice.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </CardContent>

            {variant === "default" && (
              <CardFooter className="p-4 pt-0">
                <Button
                  className={cn(
                    "w-full gap-2 transition-all",
                    isAddingToCart && "opacity-70"
                  )}
                  disabled={isAddingToCart}
                  onClick={handleAddToCart}
                >
                  {isAddingToCart ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  ) : (
                    <ShoppingCart className="h-4 w-4" />
                  )}
                  Add to Cart
                </Button>
              </CardFooter>
            )}

            {variant === "compact" && (
              <CardFooter className="p-4 pt-0">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground">
                      ₦{discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ₦{originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    className="h-8 w-8 rounded-full"
                    disabled={isAddingToCart}
                    onClick={handleAddToCart}
                    size="icon"
                    variant="ghost"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            )}

            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <Badge className="px-3 py-1 text-sm" variant="destructive">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
        </Card>
      </Link>
    </div>
  );
}
