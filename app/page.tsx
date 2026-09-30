import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Work from "./components/Work";
import ProcessContactReveal from "./components/ProcessContactReveal";
import ContactForm from "./components/ContactForm";
import CvViewer from "./components/CvViewer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Work />
        <ProcessContactReveal />
      </main>
      <ContactForm />
      <CvViewer />
    </>
  );
}
