import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet><title>Page not found — VocaHire</title></Helmet>
      <section className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <p className="mt-4 text-muted-foreground">We couldn't find that page.</p>
        <Button className="mt-6 rounded-full bg-gradient-brand text-primary-foreground font-semibold" onClick={() => navigate("/")}>
          Back to home
        </Button>
      </section>
    </>
  );
}
