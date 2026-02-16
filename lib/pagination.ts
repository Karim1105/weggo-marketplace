export function parsePagination(
  searchParams: URLSearchParams,
  defaults: { page?: number; limit?: number; maxLimit?: number } = {}
) {
  const defaultPage = defaults.page ?? 1
  const defaultLimit = defaults.limit ?? 20
  const maxLimit = defaults.maxLimit ?? 100

  const rawPage = parseInt(searchParams.get('page') || String(defaultPage), 10)
  const rawLimit = parseInt(searchParams.get('limit') || String(defaultLimit), 10)

  const page = Math.max(1, Number.isNaN(rawPage) ? defaultPage : rawPage)
  const limit = Math.min(Math.max(1, Number.isNaN(rawLimit) ? defaultLimit : rawLimit), maxLimit)

  return { page, limit, skip: (page - 1) * limit }
}