// app/layout.js

export const metadata = {
    title: 'My AI App',
    description: 'Next.js + Supabase + OpenAI starter',
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
          {/* You can add a header/nav here if you like */}
          {children}
        </body>
      </html>
    );
  }
  