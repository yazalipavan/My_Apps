export const createEndPoint = (baseUrl, queryParams) => {
  const url = new URL(baseUrl);
  for (const key in queryParams) {
    if (queryParams.hasOwnProperty(key))
      url.searchParams.append(key, queryParams[key]);
  }
  return url.toString();
};
