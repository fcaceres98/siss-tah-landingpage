import Navbar03Page from "@/components/reservations/navbar-03/navbar-03";
import SearchFormPage from "@/components/reservations/search-form/search-form";
import Footer04Page from "@/components/footer-04/footer-04";

export default function Home() {
  return (
    <>
      <Navbar03Page />
      <div className="max-w-screen w-full flex flex-col p-4 bg-muted">
        <SearchFormPage />
      </div>
      <Footer04Page />
    </>
  );
}
