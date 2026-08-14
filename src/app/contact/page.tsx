import type { Metadata } from "next";
import ContactActions from "@/app/components/ContactActions";

export const metadata: Metadata = {
  title: "Contact & Support",
  description: "Contact PhoneStore support about products, orders and checkout.",
};

export default function ContactPage() {
  return (
    <section className="container-shell py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="section-kicker">Support</p>
        <h1 className="section-title mt-2">How can we help?</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          For product, order or checkout questions, use the private in-site support
          chat. Your conversation is linked to your signed-in account.
        </p>
      </div>
      <ContactActions />
    </section>
  );
}
