"use client";
import { site } from "@/data/site";
export function ContactForm() {
    function handleSubmit(event) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const name = String(form.get("name") ?? "");
        const email = String(form.get("email") ?? "");
        const message = String(form.get("message") ?? "");
        const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
        const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
        window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    }
    return (<form className="contact-form" onSubmit={handleSubmit}>
      <label>Your name<input name="name" autoComplete="name" required placeholder="What should I call you?"/></label>
      <label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com"/></label>
      <label>A little about the project<textarea name="message" required placeholder="What are you thinking about making?"/></label>
      <button className="button button--primary" type="submit">Open email draft <span aria-hidden="true">↗</span></button>
      <p className="contact-note">This form opens your email app with your message ready to send. No details are stored on this site.</p>
    </form>);
}
