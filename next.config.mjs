/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // HSTS — tells browsers to always use HTTPS (SEO trust signal)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },

  // Redirects from legacy Express.js URLs to new URLs
  async redirects() {
    return [
      { source: '/xmltojson', destination: '/xml-to-json', permanent: true },
      { source: '/jsontoxml', destination: '/json-to-xml', permanent: true },
      { source: '/yamltojson', destination: '/yaml-to-json', permanent: true },
      { source: '/jsontoyaml', destination: '/json-to-yaml', permanent: true },
      { source: '/htmltojade', destination: '/html-to-pug', permanent: true },
      { source: '/pugtohtml', destination: '/pug-to-html', permanent: true },
      { source: '/jsontoion', destination: '/json-to-ion', permanent: true },
      {
        source: '/jsontojsonschema',
        destination: '/json-to-schema',
        permanent: true,
      },
      { source: '/texttojson', destination: '/text-to-json', permanent: true },
      { source: '/formatjson', destination: '/format-json', permanent: true },
      { source: '/formatxml', destination: '/format-xml', permanent: true },
      { source: '/formathtml', destination: '/format-html', permanent: true },
      { source: '/formatcss', destination: '/format-css', permanent: true },
      {
        source: '/formatjavascript',
        destination: '/format-javascript',
        permanent: true,
      },
      { source: '/jwt', destination: '/jwt-decoder', permanent: true },
      { source: '/home', destination: '/', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
    ];
  },
};

export default nextConfig;
