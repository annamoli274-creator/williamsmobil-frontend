"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";

import { Dictionary } from "@/lib/types";

interface ContactClientProps {
  dict: Dictionary;
}

const ContactClient = ({ dict }: ContactClientProps) => {
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");

    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    const url = BACKEND_URL
      ? `${BACKEND_URL}/api/contact`
      : "/api/contacts";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Contact request failed:", res.status, errorText);
        throw new Error(errorText || "Erreur lors de l'envoi");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi. Vérifie que le backend est accessible et que les variables d'environnement sont configurées.");
      setStatus("idle");
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {dict.contact.title}{" "}
            <span className="text-gradient">
              {dict.contact.title.split(" ").pop()}
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            {dict.contact.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info Side */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold mb-8">
                {dict.contact.coordinates_title}
              </h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">
                      {dict.contact.email_label}
                    </p>
                    <p className="text-lg font-medium">
                      <a
                        href={`mailto:${dict.contact.email_value}?subject=${encodeURIComponent("Demande depuis le site")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {dict.contact.email_value}
                      </a>
                    </p>
                    <p className="mt-2">
                      <a
                        href={`mailto:${dict.contact.email_value}?subject=${encodeURIComponent("Demande depuis le site")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full border border-primary px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10 transition"
                      >
                        Envoyer un email
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">
                      {dict.contact.phone_label}
                    </p>
                    <p className="text-lg font-medium">
                      {dict.contact.phone_value}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">
                      {dict.contact.address_label}
                    </p>
                    <p className="text-lg font-medium">
                      {dict.contact.address_value}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 premium-gradient rounded-3xl text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Send className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {dict.contact.quote_title}
              </h3>
              <p className="mb-8 text-slate-100 leading-relaxed">
                {dict.contact.quote_description}
              </p>
              <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-neutral-200 transition-colors">
                {dict.contact.quote_button}
              </button>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-zinc-50 rounded-[2rem] p-10 border border-zinc-200 shadow-2xl">
            {status === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 py-10">
                <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
                <h3 className="text-3xl font-bold mb-4">
                  {dict.contact.success_title}
                </h3>
                <p className="text-slate-500 mb-8">
                  {dict.contact.success_description}
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-primary font-bold hover:underline"
                >
                  {dict.contact.send_another}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                      {dict.contact.full_name_label}
                    </label>
                    <input
                      required
                      name="name"
                      type="text"
                      className="w-full bg-white border border-zinc-300 rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary outline-none transition-all text-zinc-900"
                      placeholder={dict.contact.full_name_placeholder}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                      {dict.contact.email_field_label}
                    </label>
                    <input
                      required
                      name="email"
                      type="email"
                      className="w-full bg-white border border-zinc-300 rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary outline-none transition-all text-zinc-900"
                      placeholder={dict.contact.email_field_placeholder}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                      Phone
                    </label>
                    <div className="flex gap-2">
                      <select className="w-1/4 bg-white border border-zinc-300 rounded-xl px-3 py-2 focus:ring-1 focus:ring-primary outline-none transition-all text-zinc-900">
                        <option value="+34">+34</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+33">+33</option>
                        <option value="+49">+49</option>
                      </select>
                      <input
                        type="tel"
                        className="flex-1 bg-white border border-zinc-300 rounded-xl px-3 py-2 focus:ring-1 focus:ring-primary outline-none transition-all text-zinc-900"
                        placeholder="610 70 69 19"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    {dict.contact.subject_label}
                  </label>
                  <select
                    name="subject"
                    className="w-full bg-white border border-zinc-300 rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary outline-none transition-all appearance-none text-zinc-900"
                  >
                    <option>{dict.contact.subject_option1}</option>
                    <option>{dict.contact.subject_option2}</option>
                    <option>{dict.contact.subject_option3}</option>
                    <option>{dict.contact.subject_option4}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    {dict.contact.message_label}
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary outline-none transition-all resize-none text-zinc-900"
                    placeholder={dict.contact.message_placeholder}
                  ></textarea>
                </div>
                <button
                  disabled={status === "sending"}
                  className="w-full premium-gradient text-white py-5 rounded-2xl font-bold text-xl hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />{" "}
                      {dict.contact.submit_button}...
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" /> {dict.contact.submit_button}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactClient;
