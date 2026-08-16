"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole, CanteenCategory } from "@superapp/types";
import {
  UtensilsCrossed,
  Search,
  Plus,
  Flame,
  CheckCircle2,
  XCircle,
  Sparkles,
  Store,
  Clock,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";

interface MenuItem {
  id: string;
  name: string;
  standName: string;
  price: number;
  category: CanteenCategory;
  description: string;
  isAvailable: boolean;
  stock: number;
}

const INITIAL_MENUS: MenuItem[] = [
  {
    id: "m-1",
    name: "Nasi Ayam Geprek Sambal Korek",
    standName: "Stand 01 - Barokah Ibu Eni",
    price: 13000,
    category: CanteenCategory.MAKANAN_BERAT,
    description: "Ayam krispi renyah dengan ulekan cabai rawit pedas mantap + lalapan segar",
    isAvailable: true,
    stock: 35,
  },
  {
    id: "m-2",
    name: "Mie Goreng Spesial Telur Kornet",
    standName: "Stand 01 - Barokah Ibu Eni",
    price: 10000,
    category: CanteenCategory.MAKANAN_BERAT,
    description: "Mie goreng gurih dengan topping telur ceplok setengah matang dan sosis",
    isAvailable: true,
    stock: 20,
  },
  {
    id: "m-3",
    name: "Es Teh Manis Segar Jumbo",
    standName: "Stand 01 - Barokah Ibu Eni",
    price: 3500,
    category: CanteenCategory.MINUMAN,
    description: "Teh melati wangi dingin porsi jumbo penyegar dahaga",
    isAvailable: true,
    stock: 80,
  },
  {
    id: "m-4",
    name: "Pisang Nugget Coklat Keju",
    standName: "Stand 01 - Barokah Ibu Eni",
    price: 8000,
    category: CanteenCategory.SNACK,
    description: "Nugget pisang renyah bertabur lumeran coklat glaze dan parutan keju kraft",
    isAvailable: true,
    stock: 15,
  },
  {
    id: "m-5",
    name: "Karedok Basreng Pedas Daun Jeruk",
    standName: "Stand 02 - Jajanan Garutan",
    price: 7000,
    category: CanteenCategory.SNACK,
    description: "Basreng renyah dicampur bumbu kencur pedas harum daun jeruk",
    isAvailable: false,
    stock: 0,
  },
  {
    id: "m-6",
    name: "Jus Alpukat Kocok Susu Kental Manis",
    standName: "Stand 03 - Aneka Jus Segar",
    price: 9000,
    category: CanteenCategory.MINUMAN,
    description: "Alpukat mentega asli dikocok dengan coklat dan susu kental",
    isAvailable: true,
    stock: 12,
  },
];

export default function KantinPage() {
  const { user } = useAuthStore();
  const isOperator = user?.role === UserRole.OPERATOR_KANTIN || user?.role === UserRole.ADMIN;

  const [menus, setMenus] = useState<MenuItem[]>(INITIAL_MENUS);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [nameInput, setNameInput] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [categoryInput, setCategoryInput] = useState<CanteenCategory>(CanteenCategory.MAKANAN_BERAT);
  const [descInput, setDescInput] = useState("");
  const [stockInput, setStockInput] = useState("30");

  const filteredMenus = menus.filter((m) => {
    const matchesCategory =
      selectedCategory === "ALL" || m.category === selectedCategory;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleStock = (menuId: string) => {
    setMenus((prev) =>
      prev.map((m) =>
        m.id === menuId ? { ...m, isAvailable: !m.isAvailable } : m
      )
    );
  };

  const handleCreateMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput || !priceInput) return;

    const newMenu: MenuItem = {
      id: `m-${Date.now()}`,
      name: nameInput,
      standName: "Stand 01 - Barokah Ibu Eni",
      price: parseFloat(priceInput) || 10000,
      category: categoryInput,
      description: descInput,
      isAvailable: true,
      stock: parseInt(stockInput) || 30,
    };

    setMenus([newMenu, ...menus]);
    setIsModalOpen(false);
    setNameInput("");
    setPriceInput("");
    setDescInput("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              4. Showcase Kantin Sekolah
            </h1>
            <Badge variant="warning">Modul 4</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Katalog menu digital per stand kantin & update ketersediaan stok habis secara real-time.
          </p>
        </div>

        {isOperator && (
          <Button
            variant="default"
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 shadow-amber-100"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Tambah Menu Baru
          </Button>
        )}
      </div>

      {/* Stands Info Banner */}
      <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Kantin Sehat SMKN 1 Garut</h3>
            <p className="text-xs text-slate-500">
              3 Stand Buka Hari Ini · Buka Pukul 07:00 - 15:00 WIB
            </p>
          </div>
        </div>

        {isOperator && (
          <Badge variant="success" className="w-fit">
            Mode Operator: Stand 01 Aktif
          </Badge>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { key: "ALL", label: "Semua Menu" },
            { key: CanteenCategory.MAKANAN_BERAT, label: "Makanan Berat" },
            { key: CanteenCategory.SNACK, label: "Snack & Cemilan" },
            { key: CanteenCategory.MINUMAN, label: "Minuman" },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? "bg-amber-600 text-white shadow-sm shadow-amber-200"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari makanan / minuman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMenus.map((menu) => (
          <Card
            key={menu.id}
            className={`relative overflow-hidden transition-all duration-200 flex flex-col justify-between ${
              !menu.isAvailable ? "opacity-75 bg-slate-50 border-slate-200" : "hover:border-amber-300 hover:shadow-md"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-2">
                <Badge variant={menu.isAvailable ? "default" : "destructive"}>
                  {menu.isAvailable ? "Tersedia" : "Habis Hari Ini"}
                </Badge>
                <span className="text-[11px] font-medium text-slate-400">
                  {menu.standName}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-1">
                {menu.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {menu.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Harga</span>
                <span className="text-base font-extrabold text-amber-700">
                  {formatCurrency(menu.price)}
                </span>
              </div>

              {isOperator ? (
                <Button
                  variant={menu.isAvailable ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleToggleStock(menu.id)}
                  className={
                    menu.isAvailable
                      ? "text-rose-600 hover:bg-rose-50 border-rose-200 text-xs"
                      : "bg-emerald-600 hover:bg-emerald-700 text-xs"
                  }
                >
                  {menu.isAvailable ? "Set Habis" : "Set Tersedia"}
                </Button>
              ) : (
                <span className="text-xs font-semibold text-slate-400">
                  {menu.isAvailable ? `Sisa: ${menu.stock} Porsi` : "Stok Habis"}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Add Menu */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Menu Kantin Baru"
        description="Lengkapi informasi menu untuk ditampilkan di katalog digital siswa & guru."
        maxWidth="md"
      >
        <form onSubmit={handleCreateMenu} className="space-y-4 mt-2">
          <Input
            label="Nama Menu Makanan / Minuman"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Contoh: Nasi Liwet Ayam Bakar"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Harga (Rp)"
              type="number"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              placeholder="12000"
              required
            />
            <Input
              label="Estimasi Stok"
              type="number"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              placeholder="30"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Kategori Menu
            </label>
            <select
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value as CanteenCategory)}
              className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
            >
              <option value={CanteenCategory.MAKANAN_BERAT}>Makanan Berat</option>
              <option value={CanteenCategory.SNACK}>Snack & Cemilan</option>
              <option value={CanteenCategory.MINUMAN}>Minuman Segar</option>
              <option value={CanteenCategory.DESSERT}>Dessert / Manis</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Deskripsi Singkat & Komposisi
            </label>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 min-h-[80px]"
              placeholder="Jelaskan cita rasa dan lauk pelengkap..."
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="gradient">
              Simpan & Publikasikan Menu
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
