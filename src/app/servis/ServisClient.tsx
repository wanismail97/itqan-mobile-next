// ─── Servis Client — Service grid + modal ─────────────────────────────────
"use client";

import { useState } from "react";
import type { ServisFields } from "@/types/airtable";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyButtons from "@/components/layout/StickyButtons";
import { useCart } from "@/lib/cart-context";

interface Props {
  services: ServisFields[];
}

type ServiceForm = Record<string, string>;

export default function ServisClient({ services }: Props) {
  const { addItem } = useCart();
  const [selectedService, setSelectedService] = useState<ServisFields | null>(null);
  const [form, setForm] = useState<ServiceForm>({});

  const openModal = (service: ServisFields) => {
    setSelectedService(service);
    setForm({});
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const getFormFields = (serviceName: string): { key: string; label: string; placeholder: string }[] => {
    const lower = serviceName.toLowerCase();
    if (lower.includes("elektrik")) {
      return [
        { key: "accountNumber", label: "No Akaun", placeholder: "0101010101" },
        { key: "amount", label: "Jumlah Bayaran (RM)", placeholder: "100" },
      ];
    }
    if (lower.includes("air")) {
      return [
        { key: "accountNumber", label: "No Akaun", placeholder: "0101010101" },
        { key: "amount", label: "Jumlah Bayaran (RM)", placeholder: "50" },
      ];
    }
    if (lower.includes("pendaftaran") || lower.includes("registration")) {
      return [
        { key: "customerName", label: "Nama", placeholder: "Ahmad bin Abdullah" },
        { key: "phoneNumber", label: "No Telefon", placeholder: "0123456789" },
      ];
    }
    if (lower.includes("penggantian") || lower.includes("replacement")) {
      return [
        { key: "customerName", label: "Nama", placeholder: "Ahmad bin Abdullah" },
        { key: "phoneNumber", label: "No Telefon", placeholder: "0123456789" },
      ];
    }
    // Default fallback
    return [
      { key: "customerName", label: "Nama", placeholder: "Nama anda" },
      { key: "phoneNumber", label: "No Telefon", placeholder: "0123456789" },
    ];
  };

  const handleAddToCart = () => {
    if (!selectedService) return;

    const fields = getFormFields(selectedService["Nama Servis"]);
    const requiredFields = fields.map((f) => f.key);

    // Validate required fields
    for (const key of requiredFields) {
      if (!form[key]?.trim()) {
        alert(`Sila isi ${fields.find((f) => f.key === key)?.label}`);
        return;
      }
    }

    const serviceName = selectedService["Nama Servis"];
    const accountNumber = form.accountNumber;
    const amount = form.amount ? parseInt(form.amount, 10) : undefined;
    const customerName = form.customerName;
    const phoneNumber = form.phoneNumber;

    // Generate a unique ID for deduplication
    const idParts = ["service", serviceName, accountNumber || phoneNumber || customerName || ""];
    const id = idParts.join(":");

    addItem({
      type: "service",
      id,
      serviceName,
      accountNumber,
      customerName,
      phoneNumber,
      amount,
      quantity: 1,
    });

    closeModal();
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8fafc] pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Servis
          </h1>
          <p className="text-gray-500 mb-8">
            Bayar bil, daftar SIM dan banyak lagi.
          </p>

          {services.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Tiada Servis
              </h3>
              <p className="text-gray-500">
                Servis akan ditambah kemudian.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {services.map((service, index) => (
                <div
                  key={`${service["Nama Servis"]}-${index}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-primary mb-1">
                    {service["Nama Servis"]}
                  </h3>
                  {service.Deskripsi && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {service.Deskripsi}
                    </p>
                  )}
                  <button
                    onClick={() => openModal(service)}
                    className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition"
                  >
                    Tempah Sekarang
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ─── Modal ────────────────────────────────────────────────────── */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-primary">
                {selectedService["Nama Servis"]}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                aria-label="Tutup"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              {getFormFields(selectedService["Nama Servis"]).map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={field.key === "amount" ? "number" : "text"}
                    value={form[field.key] || ""}
                    onChange={(e) => updateForm(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
              ))}

              <button
                onClick={handleAddToCart}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Tambah ke Bakul
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <StickyButtons />
    </>
  );
}
