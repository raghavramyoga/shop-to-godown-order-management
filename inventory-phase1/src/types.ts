export type Product = {
  id: string
  sku: string
  name: string
  category: string
  unit: string
  unitPrice: number
  weightValue: number
  weightUnit: 'g' | 'kg'
}

export type CurrentUser = { username: string; fullName: string } | null
