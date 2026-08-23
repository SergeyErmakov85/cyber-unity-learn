import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  type?: string;
  jsonLd?: object | object[];
  image?: string;
  keywords?: string;
  /**
   * Закрыть страницу от индексации. Нужно для служебных страниц и 404:
   * SPA отдаёт их с кодом 200, поэтому без noindex они попадают в выдачу
   * как soft-404. При noindex canonical не выставляем.
   */
  noindex?: boolean;
}

const BASE_URL = "https://rl-cuber-unity-code.com";

const SEOHead = ({
  title,
  description,
  path = "/",
  type = "website",
  jsonLd,
  image,
  keywords,
  noindex = false,
}: SEOHeadProps) => {
  const url = `${BASE_URL}${path}`;
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${BASE_URL}${image}`
    : `${BASE_URL}/og-image.png`;

  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <link rel="canonical" href={url} />
      )}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:site_name" content="CyberUnityCode" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
