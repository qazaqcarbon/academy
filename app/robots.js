export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/studio/"],
            },
        ],
        sitemap: "https://academy.qazaqcarbon.com/sitemap.xml",
    };
}
