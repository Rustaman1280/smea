"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole, ItemCondition, BorrowStatus } from "@superapp/types";
import {
  Boxes,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Wrench,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Laptop,
  Projector,
  FileCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

interface InventoryAsset {
  id: string;
  code: string;
  name: string;
  category: string;
  location: string;
  total: number;
  available: number;
  condition: ItemCondition;
}

interface BorrowItem {
  id: string;
  itemName: string;
  itemCode: string;
  borrowerName: string;
  borrowerRole: string;
  quantity: number;
  expectedDate: string;
  status: BorrowStatus;
  purpose: string;
}

const INITIAL_ITEMS: InventoryAsset[] = [
  { id: "i-1", code: "LAB-RPL-001", name: "Laptop ASUS TUF Gaming A15 (RTX 4060)", category: "Alat Lab RPL", location: "Lab Komputer 1 (Lemari A)", total: 20, available: 18, condition: ItemCondition.BAIK },
  { id: "i-2", code: "PROY-EPS-002", name: "Proyektor Epson EB-X500 HDMI", category: "Media Pembelajaran", location: "Ruang Sarpras Utama", total: 10, available: 8, condition: ItemCondition.BAIK },
  { id: "i-3", code: "ROUT-MK-003", name: "Router MikroTik RB750Gr3 Gigabit", category: "Alat Lab TKJ", location: "Lab Jaringan TKJ", total: 15, available: 15, condition: ItemCondition.BAIK },
  { id: "i-4", code: "TOOL-CRIMP-004", name: "Crimping Tool RJ45 Pro'sKit", category: "Alat Lab TKJ", location: "Lab Jaringan TKJ", total: 30, available: 24, condition: ItemCondition.BAIK },
  { id: "i-5", code: "ARDU-KIT-005", name: "Kit Praktik IoT ESP32 & Sensor Pack", category: "Alat Lab RPL", location: "Lab Hardware IoT", total: 25, available: 20, condition: ItemCondition.BAIK },
];

const INITIAL_BORROWS: BorrowItem[] = [
  {
    id: "b-1",
    itemName: "Laptop ASUS TUF Gaming A15 (RTX 4060)",
    itemCode: "LAB-RPL-001",
    borrowerName: "Ahmad Fauzi",
    borrowerRole: "Siswa (XII RPL 1)",
    quantity: 1,
    expectedDate: "19 Agustus 2026",
    status: BorrowStatus.BORROWED,
    purpose: "Pengerjaan modul AI dan rendering game di lab",
  },
  {
    id: "b-2",
    itemName: "Proyektor Epson EB-X500 HDMI",
    itemCode: "PROY-EPS-002",
    borrowerName: "Budi Santoso, S.Kom",
    borrowerRole: "Guru Mapel",
    quantity: 1,
    expectedDate: "16 Agustus 2026",
    status: BorrowStatus.PENDING,
    purpose: "Presentasi materi arsitektur microservices di kelas XII RPL 2",
  },
];

export default function InventarisPage() {
  const { user } = useAuthStore();
  const isSarpras = user?.role === UserRole.PETUGAS_SARPRAS || user?.role === UserRole.ADMIN;

  const [activeTab, setActiveTab] = useState<"ITEMS" | "BORROWS">("ITEMS");
  const [items, setItems] = useState<InventoryAsset[]>(INITIAL_ITEMS);
  const [borrows, setBorrows] = useState<BorrowItem[]>(INITIAL_BORROWS);

  // Borrow Modal State
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(INITIAL_ITEMS[0].id);
  const [borrowQty, setBorrowQty] = useState("1");
  const [borrowDate, setBorrowDate] = useState("2026-08-19");
  const [borrowPurpose, setBorrowPurpose] = useState("");

  const handleCreateBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    const item = items.find((i) => i.id === selectedItemId);
    if (!item || !borrowPurpose) return;

    const newBorrow: BorrowItem = {
      id: `b-${Date.now()}`,
      itemName: item.name,
      itemCode: item.code,
      borrowerName: user?.name || "Pengguna",
      borrowerRole: user?.role || "SISWA",
      quantity: parseInt(borrowQty) || 1,
      expectedDate: borrowDate,
      status: BorrowStatus.PENDING,
      purpose: borrowPurpose,
    };

    setBorrows([newBorrow, ...borrows]);
    setIsBorrowModalOpen(false);
    setBorrowPurpose("");
  };

  const handleUpdateBorrowStatus = (id: string, newStatus: BorrowStatus) => {
    setBorrows((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              8. Inventaris Sarpras
            </h1>
            <Badge variant="warning">Modul 8</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Katalog barang aset sekolah, alur checkout peminjaman sarana lab, dan histori maintenance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 shadow-orange-100"
            onClick={() => setIsBorrowModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Ajukan Pinjam Alat
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab("ITEMS")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "ITEMS"
              ? "bg-orange-600 text-white shadow-sm shadow-orange-200"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Katalog Aset & Alat ({items.length} Barang)
        </button>
        <button
          onClick={() => setActiveTab("BORROWS")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "BORROWS"
              ? "bg-orange-600 text-white shadow-sm shadow-orange-200"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Daftar Peminjaman ({borrows.length} Data)
        </button>
      </div>

      {/* TAB 1: ASSET ITEMS */}
      {activeTab === "ITEMS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card
              key={item.id}
              className="border-slate-200 hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-2">
                  <span className="font-mono text-xs font-bold text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {item.code}
                  </span>
                  <Badge variant="success">{item.condition}</Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kategori: {item.category} · Lokasi: {item.location}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Ketersediaan
                  </span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {item.available} / {item.total} Unit
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedItemId(item.id);
                    setIsBorrowModalOpen(true);
                  }}
                  disabled={item.available <= 0}
                >
                  {item.available > 0 ? "Pinjam Alat" : "Stok Kosong"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 2: BORROWING RECORDS */}
      {activeTab === "BORROWS" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Riwayat & Pengajuan Peminjaman Sarpras</CardTitle>
                <CardDescription>
                  Daftar transaksi checkout barang oleh siswa dan bapak/ibu guru
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                    <th className="pb-3">Barang</th>
                    <th className="pb-3">Peminjam</th>
                    <th className="pb-3">Jumlah</th>
                    <th className="pb-3">Target Kembali</th>
                    <th className="pb-3">Status</th>
                    {isSarpras && <th className="pb-3 text-right">Approval Sarpras</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {borrows.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80">
                      <td className="py-3">
                        <p className="font-bold text-slate-900">{b.itemName}</p>
                        <p className="text-[10px] text-slate-400">{b.itemCode} · "{b.purpose}"</p>
                      </td>
                      <td className="py-3">
                        <p className="font-semibold text-slate-800">{b.borrowerName}</p>
                        <p className="text-[10px] text-slate-500">{b.borrowerRole}</p>
                      </td>
                      <td className="py-3 font-bold text-slate-900">{b.quantity} Unit</td>
                      <td className="py-3 text-slate-600">{b.expectedDate}</td>
                      <td className="py-3">
                        <Badge
                          variant={
                            b.status === BorrowStatus.BORROWED
                              ? "warning"
                              : b.status === BorrowStatus.APPROVED
                              ? "info"
                              : b.status === BorrowStatus.RETURNED
                              ? "success"
                              : "secondary"
                          }
                        >
                          {b.status}
                        </Badge>
                      </td>
                      {isSarpras && (
                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            {b.status === BorrowStatus.PENDING && (
                              <Button
                                variant="default"
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-xs py-1 h-7"
                                onClick={() => handleUpdateBorrowStatus(b.id, BorrowStatus.BORROWED)}
                              >
                                Setujui
                              </Button>
                            )}
                            {b.status === BorrowStatus.BORROWED && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs py-1 h-7 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                onClick={() => handleUpdateBorrowStatus(b.id, BorrowStatus.RETURNED)}
                              >
                                <RotateCcw className="h-3 w-3" />
                                Kembalikan
                              </Button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal Pinjam Barang */}
      <Modal
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
        title="Formulir Peminjaman Sarpras"
        description="Ajukan permohonan pinjam alat praktikum / media pembelajaran."
        maxWidth="md"
      >
        <form onSubmit={handleCreateBorrow} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Pilih Barang Inventaris
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
            >
              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name} ({it.code}) - Sisa: {it.available} Unit
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Jumlah Unit"
              type="number"
              value={borrowQty}
              onChange={(e) => setBorrowQty(e.target.value)}
              min="1"
              required
            />
            <Input
              label="Target Tanggal Kembali"
              type="date"
              value={borrowDate}
              onChange={(e) => setBorrowDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Tujuan Peminjaman & Lokasi Pemakaian
            </label>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 min-h-[80px]"
              placeholder="Contoh: Praktik jaringan di lab perpustakaan..."
              value={borrowPurpose}
              onChange={(e) => setBorrowPurpose(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsBorrowModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="gradient">
              Kirimkan Pengajuan Pinjam
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
