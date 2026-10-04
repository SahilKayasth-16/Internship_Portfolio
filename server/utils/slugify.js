/**
 * Converts a text string into a URL-friendly lowercase slug.
 * Trims whitespace, converts characters to lowercase, replaces non-alphanumeric
 * sequences with hyphens, and removes leading/trailing hyphens.
 *
 * @param {string} text - Input string to convert to a slug
 * @returns {string} Clean, hyphen-delimited slug string or empty string
 */
function slugify(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

module.exports = slugify;

