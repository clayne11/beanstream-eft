export const getUrl = ({
  baseUrl,
  pathname,
  query = {},
}) => {
  const baseUrlWithSlash = baseUrl.charAt(baseUrl.length - 1) === '/' ?
    baseUrl :
    `${baseUrl}/`;

  const pathnameNoLeadingSlash = pathname && pathname.charAt(0) === '/' ?
    pathname.substring(1) :
    pathname;

  const queryString = Object.entries(query).reduce((result, [key, value], index) => {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(value);
    const keyValue = `${encodedKey}=${encodedValue}`;
    return index > 0 ?
      `${result}&${keyValue}` :
      `?${keyValue}`;
  }, '');

  let url = baseUrlWithSlash;
  if (pathnameNoLeadingSlash) {
    url += pathnameNoLeadingSlash;
  }
  if (queryString) {
    url += queryString;
  }
  return url;
};
