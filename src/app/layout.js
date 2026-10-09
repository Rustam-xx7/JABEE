import './globals.css';

export const metadata = {
  title: "JABEE — Office Professionals' Favourite Ride Booking App",
  description: "Predictable daily motorcycle captains for office goers. Zero morning surge, same captain every weekday.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#F6F5F2] text-[#111111] font-sans antialiased overflow-x-hidden selection:bg-jabee-orange selection:text-white">
        {children}
      </body>
    </html>
  );
}
