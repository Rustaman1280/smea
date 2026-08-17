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
  Store,
  ShoppingBag,
  Check,
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
  const [justOrderedId, setJustOrderedId] = useState<string | null>(null);

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
    setCartCount((prev) => prev + 1);
    setCartTotal((prev) => prev + menu.price);
    setJustOrderedId(menu.id);
    setTimeout(() => setJustOrderedId(null), 1200);
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              4. E-Kantin
            </h1>
            <Badge variant="warning">Modul 4</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Katalog menu digital multi-stand, sajian produk Dapur TeFa Tata Boga, dan info stok real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {cartCount > 0 && (
            <div className="rounded-2xl bg-amber-500 text-slate-950 font-bold px-3.5 py-2 text-xs flex items-center gap-2 shadow-sm animate-in zoom-in-95">
              <ShoppingBag className="h-4 w-4" />
              <span>{cartCount} Item · {formatCurrency(cartTotal)}</span>
            </div>
          )}

          {isOperator && (
            <Button
              variant="default"
              size="sm"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Tambah Menu Baru
            </Button>
          )}
        </div>
      </div>

      {/* Today's Featured Specials Banner — High Contrast & Dark Surface */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-bold flex items-center justify-center shadow-md">
              <Flame className="h-6 w-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">Menu Spesial Rekomendasi Hari Ini</h3>
                <Badge variant="warning" className="text-[10px]">
                  Chef's Pick
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Pastry Croissant TeFa Tata Boga & Nasi Ayam Geprek Sambal Korek Stand Barokah.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-500/25 px-3.5 py-2 rounded-xl">
            <Store className="h-4 w-4 text-amber-500" />
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
              className={`px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat.key
                ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari menu makanan / stand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-input bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMenus.map((menu) => (
          <Card
            key={menu.id}
            className={`relative overflow-hidden transition-all duration-200 flex flex-col justify-between ${
              !menu.isAvailable ? "opacity-60 bg-muted/20 border-border" : "hover:border-amber-500/40"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-2">
                <Badge variant={menu.isAvailable ? "default" : "destructive"}>
                  {menu.isAvailable ? "Tersedia" : "Habis Hari Ini"}
                </Badge>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {menu.standName}
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground mt-1">
                {menu.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {menu.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-medium text-muted-foreground block">Harga</span>
                <span className="text-base font-bold text-amber-500 dark:text-amber-300">
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
                      ? "text-rose-400 hover:bg-rose-500/10 border-rose-500/30 text-xs font-semibold"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                  }
                >
                  {menu.isAvailable ? "Tandai Habis" : "Set Tersedia"}
                </Button>
              ) : (
                /* Order Button — High Contrast in Default, Hover, and Pressed States */
                <Button
                  variant="default"
                  size="sm"
                  disabled={!menu.isAvailable}
                  onClick={() => handleOrder(menu)}
                  className={`text-xs font-bold transition-all ${
                    justOrderedId === menu.id
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 hover:shadow-[0_4px_14px_rgba(245,158,11,0.35)]"
                  }`}
                >
                  {justOrderedId === menu.id ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Ditambahkan!
                    </>
                  ) : menu.isAvailable ? (
                    "+ Pesan Menu"
                  ) : (
                    "Stok Habis"
                  )}
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
              label="Harga Menu (Rp)"
              type="number"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              placeholder="Contoh: 12000"
              required
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Kategori Menu
              </label>
              <select
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value as CanteenCategory)}
                className="w-full h-11 rounded-2xl border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value={CanteenCategory.MAKANAN_BERAT}>Makanan Berat</option>
                <option value={CanteenCategory.SNACK}>Snack & Cemilan</option>
                <option value={CanteenCategory.MINUMAN}>Minuman Segar</option>
                <option value={CanteenCategory.DESSERT}>Pastry & Dessert</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Deskripsi Menu / Topping
            </label>
            <textarea
              className="w-full rounded-2xl border border-input bg-card p-3.5 text-sm text-foreground min-h-[85px] focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Jelaskan porsi, rasa, dan isi hidangan..."
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="default" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
              Simpan Menu Baru
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
