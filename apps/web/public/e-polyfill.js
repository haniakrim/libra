// Polyfill for next-themes 0.4.6 / Next.js production minification issue where an
// undefined helper `e` is referenced in an inline theme script. Defining a no-op
// global before any Next script runs prevents the harmless ReferenceError.
if (typeof e === 'undefined') {
  var e = function () {}
}
