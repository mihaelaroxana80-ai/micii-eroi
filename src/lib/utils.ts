// Romanian price format: 109.88 -> "109,88 lei"
export function formatPrice(price: number): string {
  return price.toFixed(2).replace(".", ",") + " lei";
}
