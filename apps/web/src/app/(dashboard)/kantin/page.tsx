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
  ShoppingBag,
  Check,
  Percent,
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
  isSpecial?: boolean;
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
    isSpecial: true,
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
    isSpecial: true,
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
    name: "Jus Alpukat Kocok Susu Coklat",
    standName: "Stand 03 - Aneka Jus Segar",
    price: 9000,
    category: CanteenCategory.MINUMAN,
    description: "Alpukat mentega asli dikocok dengan coklat dan susu kental",
    isAvailable: true,
    stock: 12,
  },
  {
    id: "m-7",
    name: "Pastry Croissant Coklat TeFa Boga",
    standName: "Stand 04 - Dapur TeFa Kuliner",
    price: 12000,
    category: CanteenCategory.DESSERT,
    description: "Roti croissant buatan siswa Tata Boga SMKN 1 Garut dengan mentega premium",
    isAvailable: true,
    stock: 18,
    isSpecial: true,
  },
];

export default function KantinPage() {
  const { user } = useAuthStore();
  const isOperator = user?.role === UserRole.OPERATOR_KANTIN || user?.role === UserRole.ADMIN;

  const [menus, setMenus] = useState<MenuItem[]>(INITIAL_MENUS);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

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
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.standName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleStock = (menuId: string) => {
    setMenus((prev) =>
      prev.map((m) =>
        m.id === menuId ? { ...m, isAvailable: !m.isAvailable } : m
      )
    );
  };

  const handleOrder = (menu: MenuItem) => {
    setCartCount(cartCount + 1);
    setCartTotal(cartTotal + menu.price);
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
            Katalog menu digital multi-stand, sajian produk Dapur TeFa Tata Boga, dan info stok real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {cartCount > 0 && (
            <div className="rounded-2xl bg-amber-500 text-slate-950 font-bold px-3.5 py-1.5 text-xs flex items-center gap-2 shadow-sm">
              <ShoppingBag className="h-4 w-4" />
              <span>{cartCount} Item · {formatCurrency(cartTotal)}</span>
            </div>
          )}

          {isOperator && (
            <Button
              variant="default"
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 font-bold shadow-amber-200"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Tambah Menu Baru
            </Button>
          )}
        </div>
      </div>

      {/* Today's Featured Specials Banner */}
      <div className="rounded-3xl border border-amber-300/80 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">Menu Spesial Rekomendasi Hari Ini</h3>
                <Badge variant="warning" className="text-[10px] bg-amber-200 text-amber-900">
                  Chef's Pick
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Pastry Croissant TeFa Tata Boga & Nasi Ayam Geprek Sambal Korek Stand Barokah.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white/90 border border-amber-200 px-3.5 py-1.5 rounded-xl">
            <Store className="h-4 w-4 text-amber-600" />
            <span>4 Stand Buka · 07:00 - 15:00 WIB</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { key: "ALL", label: "Semua Menu" },
            { key: CanteenCategory.MAKANAN_BERAT, label: "Makanan Berat" },
            { key: CanteenCategory.SNACK, label: "Snack & Cemilan" },
            { key: CanteenCategory.MINUMAN, label: "Minuman Segar" },
            { key: CanteenCategory.DESSERT, label: "Pastry & Dessert" },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? "bg-amber-600 text-white shadow-sm shadow-amber-300"
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
            placeholder="Cari menu makanan / stand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMenus.map((menu) => (
          <Card
            key={menu.id}
            className={`relative overflow-hidden transition-all duration-200 flex flex-col justify-between ${
              !menu.isAvailable ? "opacity-75 bg-slate-50 border-slate-200" : "hover:border-amber-400 hover:shadow-md"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-2">
                <Badge variant={menu.isAvailable ? "default" : "destructive"}>
                  {menu.isAvailable ? "Tersedia" : "Habis Hari Ini"}
                </Badge>
                <span className="text-[11px] font-bold text-slate-400">
                  {menu.standName}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                {menu.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {menu.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Harga</span>
                <span className="text-base font-black text-amber-800">
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
                      ? "text-rose-600 hover:bg-rose-50 border-rose-200 text-xs font-bold"
                      : "bg-emerald-600 hover:bg-emerald-700 text-xs font-bold"
                  }
                >
                  {menu.isAvailable ? "Tandai Habis" : "Set Tersedia"}
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  disabled={!menu.isAvailable}
                  onClick={() => handleOrder(menu)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
                >
                  {menu.isAvailable ? "+ Pesan Menu" : "Stok Habis"}
                </Button>
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
        description="Lengkapi informasi menu makanan / minuman untuk stand kantin sekolah."
        maxWidth="md"
      >
        <form onSubmit={handleCreateMenu} className="space-y-4 mt-2">
          <Input
            label="Nama Menu Makanan / Minuman"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Contoh: Nasi Liwet Ayam Bakar Komplit"
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
              label="Estimasi Stok Harian"
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
              className="w-full h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
            >
              <option value={CanteenCategory.MAKANAN_BERAT}>Makanan Berat</option>
              <option value={CanteenCategory.SNACK}>Snack & Cemilan</option>
              <option value={CanteenCategory.MINUMAN}>Minuman Segar</option>
              <option value={CanteenCategory.DESSERT}>Dessert / Pastry</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Deskripsi Singkat Komposisi
            </label>
            <textarea
              className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 min-h-[75px]"
              placeholder="Jelaskan lauk, sambal pelengkap, atau keistimewaan rasa..."
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
