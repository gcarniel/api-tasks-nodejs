// ?name=gabriel&page=2
export function extractQueryParams(queryParams) {
  return queryParams
    .substring(1)
    .split('&')
    .reduce((queryParam, item) => {
      const [key, value] = item.split('=')

      queryParam[key] = value

      return queryParam
    }, {})
}
