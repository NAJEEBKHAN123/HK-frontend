import { Outlet } from "react-router-dom";
import TopBar from "../../components/TopBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function RootLayout() {
  return (
    <>
      <TopBar />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}