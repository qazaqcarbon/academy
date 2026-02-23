import "./globals.css";

export const metadata = {
    title: "Qazaq Carbon Academy | Открытая Платформа Сертификации",
    description: "Интерактивный справочник по углеродной сертификации VCM от Qazaq Carbon. Понятно и прозрачно о сложных стандартах.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="ru">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@400;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
