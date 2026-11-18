function parsePrice(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null
  }

  if (value === null || value === undefined || value === "") {
    return null
  }

  const normalizedValue = String(value)
    .trim()
    .replace(/[^\d,.-]/g, "")

  if (!normalizedValue) return null

  const numberValue = normalizedValue.includes(",")
    ? normalizedValue.replace(/\./g, "").replace(",", ".")
    : normalizedValue
  const parsedPrice = Number(numberValue)

  return Number.isFinite(parsedPrice) ? parsedPrice : null
}

export function getBookPricing(book) {
  const originalPrice = parsePrice(book?.price ?? book?.preco)
  const effectivePrice = parsePrice(book?.effectivePrice)
  const promotionPrice = parsePrice(book?.promotionPrice)
  const hasPromotion =
    book?.promotionActive === true &&
    originalPrice !== null &&
    effectivePrice !== null &&
    effectivePrice < originalPrice &&
    (promotionPrice === null || promotionPrice < originalPrice)

  const price = hasPromotion ? effectivePrice : originalPrice

  return {
    originalPrice,
    effectivePrice,
    price,
    hasPromotion,
    discountPercentage: hasPromotion
      ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100)
      : null,
  }
}

export function formatBookPrice(value) {
  if (value === null || value === undefined) {
    return "Consulte o preço"
  }

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
