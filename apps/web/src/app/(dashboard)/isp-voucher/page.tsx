"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole, VoucherStatus } from "@superapp/types";
import {
  Wifi,
  Zap,
  Clock,
  Copy,
  Check,
  Plus,
  ArrowRight,
  TrendingUp,
  Download,
  CreditCard,
  QrCode,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";

interface VoucherPackage {
  id: string;
  name: string;
  duration: string;
  speed: string;
  quota: string;
  price: number;
  badge?: string;
}

interface PurchasedVoucher {
  code: string;
  profileName: string;
  purchasedAt: string;
  expiresAt: string;
  price: number;
}

const PACKAGES: VoucherPackage[] = [
  { id: "pkg-1", name: "Paket Kilat 3 Jam", duration: "3 Jam", speed: "10 Mbps", quota: "2 GB Kuota", price: 1500 },
  { id: "pkg-2", name: "Paket Harian Unlimited", duration: "24 Jam", speed: "15 Mbps", quota: "Unlimited", price: 3000, badge: "Paling Populer" },
  { id: "pkg-3", name: "Paket Mingguan Pelajar", duration: "7 Hari", speed: "20 Mbps", quota: "Unlimited", price: 15000 },
  { id: "pkg-4", name: "Paket Bulanan Prioritas", duration: "30 Hari", speed: "30 Mbps", quota: "Unlimited High Priority", price: 45000, badge: "Best Value" },
];

const INITIAL_PURCHASED: PurchasedVoucher[] = [
  {
    code: "SMK-1H-A9X2",
    profileName: "1 Hari - Unlimited 15 Mbps",
    purchasedAt: "16 Agustus 2026, 07:10 WIB",
    expiresAt: "17 Agustus 2026, 07:10 WIB",
    price: 3000,
  },
];

export default function IspVoucherPage() {
  const { user } = useAuthStore();
  const isOperator = user?.role === UserRole.OPERATOR_ISP || user?.role === UserRole.ADMIN;

  const [purchasedList, setPurchasedList] = useState<PurchasedVoucher[]>(INITIAL_PURCHASED);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Buy Modal State
  const [selectedPkg, setSelectedPkg] = useState<VoucherPackage | null>(null);
  const [payMethod, setPayMethod] = useState<"SALDO" | "QRIS" | "CASH">("SALDO");

  // Generate Batch Modal State
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchCount, setBatchCount] = useState("20");
  const [batchProfile, setBatchProfile] = useState("1 Hari - Unlimited 15 Mbps");
  const [batchPrice, setBatchPrice] = useState("3000");

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleBuy = () => {
    if (!selectedPkg) return;

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "SMK-";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newVoucher: PurchasedVoucher = {
      code,
      profileName: selectedPkg.name,
      purchasedAt: "Hari ini, 16 Ags",
      expiresAt: "Besok, 17 Ags",
      price: selectedPkg.price,
    };

    setPurchasedList([newVoucher, ...purchasedList]);
    setSelectedPkg(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              9. ISP Voucher Hotspot
            </h1>
            <Badge variant="success">Modul 9</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Penjualan voucher internet hotspot sekolah & integrasi manajemen bandwidth Mikrotik/RADIUS.
          </p>
        </div>

        {isOperator && (
          <Button
            variant="default"
            size="sm"
            className="bg-teal-600 hover:bg-teal-700 shadow-teal-100"
            onClick={() => setIsBatchModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Generate Batch Voucher
          </Button>
        )}
      </div>

      {/* OPERATOR ANALYTICS BANNER */}
      {isOperator && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-teal-50/50 border-teal-200">
            <p className="text-xs font-semibold text-teal-800">Total Voucher Dibuat</p>
            <h4 className="text-2xl font-bold text-teal-950 mt-1">250 Unit</h4>
          </Card>
          <Card className="p-4 bg-emerald-50/50 border-emerald-200">
            <p className="text-xs font-semibold text-emerald-800">Voucher Terjual</p>
            <h4 className="text-2xl font-bold text-emerald-950 mt-1">182 Unit</h4>
          </Card>
          <Card className="p-4 bg-sky-50/50 border-sky-200">
            <p className="text-xs font-semibold text-sky-800">Stok Tersedia</p>
            <h4 className="text-2xl font-bold text-sky-950 mt-1">68 Unit</h4>
          </Card>
          <Card className="p-4 bg-purple-50/50 border-purple-200">
            <p className="text-xs font-semibold text-purple-800">Total Pendapatan</p>
            <h4 className="text-xl font-bold text-purple-950 mt-1">{formatCurrency(685000)}</h4>
          </Card>
        </div>
      )}

      {/* Active Voucher Code Card (For User) */}
      {purchasedList.length > 0 && (
        <div className="rounded-3xl border border-teal-200 bg-gradient-to-r from-teal-600 to-emerald-700 p-6 text-white shadow-lg shadow-teal-900/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold backdrop-blur-md">
                <Zap className="h-3.5 w-3.5 text-yellow-300" />
                <span>Voucher Hotspot Anda Aktif</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">
                {purchasedList[0].profileName}
              </h2>
              <p className="text-xs text-teal-100">
                Berlaku hingga: <strong>{purchasedList[0].expiresAt}</strong> · SSID: <strong>SMKN1GARUT-STUDENT-5G</strong>
              </p>
            </div>

            {/* Code Copy Box */}
            <div className="flex items-center gap-3 bg-slate-900/40 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              <div>
                <p className="text-[10px] uppercase font-bold text-teal-200">Kode Voucher Login:</p>
                <p className="text-xl font-mono font-extrabold tracking-wider text-yellow-300">
                  {purchasedList[0].code}
                </p>
              </div>
              <button
                onClick={() => handleCopy(purchasedList[0].code)}
                className="p-2.5 rounded-xl bg-white text-slate-900 hover:bg-teal-50 transition-all active:scale-95 shadow-sm"
                title="Salin Kode"
              >
                {copiedCode === purchasedList[0].code ? (
                  <Check className="h-4 w-4 text-emerald-600 font-bold" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Plans Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          Pilih Paket Internet Wi-Fi Hotspot Sekolah
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PACKAGES.map((pkg) => (
            <Card
              key={pkg.id}
              className={`flex flex-col justify-between transition-all duration-200 hover:border-teal-400 hover:shadow-md ${
                pkg.badge ? "border-teal-300 ring-1 ring-teal-300 bg-teal-50/20" : "border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-semibold text-slate-500">{pkg.duration}</span>
                  {pkg.badge && <Badge variant="default">{pkg.badge}</Badge>}
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {pkg.name}
                </h3>
                <p className="text-xl font-extrabold text-teal-700 mt-2">
                  {formatCurrency(pkg.price)}
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-teal-600" />
                    <span>Kecepatan: <strong>{pkg.speed}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="h-3.5 w-3.5 text-teal-600" />
                    <span>Kuota: <strong>{pkg.quota}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <Button
                  variant="gradient"
                  className="w-full text-xs from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                  onClick={() => setSelectedPkg(pkg)}
                >
                  Beli Voucher Sekarang
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Purchase History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pembelian Voucher Saya</CardTitle>
          <CardDescription>Daftar transaksi kode voucher yang pernah dibeli</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                  <th className="pb-3">Kode Voucher</th>
                  <th className="pb-3">Paket</th>
                  <th className="pb-3">Tanggal Beli</th>
                  <th className="pb-3">Harga</th>
                  <th className="pb-3 text-right">Salin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {purchasedList.map((v, i) => (
                  <tr key={i} className="hover:bg-slate-50/80">
                    <td className="py-3 font-mono font-bold text-teal-800">{v.code}</td>
                    <td className="py-3 font-semibold text-slate-900">{v.profileName}</td>
                    <td className="py-3 text-slate-500">{v.purchasedAt}</td>
                    <td className="py-3 font-bold text-slate-900">{formatCurrency(v.price)}</td>
                    <td className="py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(v.code)}
                        className="text-xs h-7 py-0"
                      >
                        {copiedCode === v.code ? "Tersalin" : "Salin Kode"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Buy Voucher */}
      <Modal
        isOpen={!!selectedPkg}
        onClose={() => setSelectedPkg(null)}
        title="Konfirmasi Pembelian Voucher"
        description="Pilih metode pembayaran untuk aktivasi kode hotspot instan."
        maxWidth="md"
      >
        {selectedPkg && (
          <div className="space-y-4 mt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">{selectedPkg.name}</p>
                <p className="text-xs text-slate-500">Durasi: {selectedPkg.duration} · {selectedPkg.speed}</p>
              </div>
              <p className="text-lg font-extrabold text-teal-700">{formatCurrency(selectedPkg.price)}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Pilih Metode Pembayaran
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPayMethod("SALDO")}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    payMethod === "SALDO"
                      ? "border-teal-500 bg-teal-50 text-teal-900 ring-1 ring-teal-500"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className="h-4 w-4 mb-1 text-teal-600" />
                  Saldo Siswa
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod("QRIS")}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    payMethod === "QRIS"
                      ? "border-teal-500 bg-teal-50 text-teal-900 ring-1 ring-teal-500"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <QrCode className="h-4 w-4 mb-1 text-teal-600" />
                  QRIS Instan
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod("CASH")}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    payMethod === "CASH"
                      ? "border-teal-500 bg-teal-50 text-teal-900 ring-1 ring-teal-500"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Clock className="h-4 w-4 mb-1 text-teal-600" />
                  Kasir Lab ISP
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setSelectedPkg(null)}>
                Batal
              </Button>
              <Button type="button" variant="gradient" onClick={handleBuy}>
                Bayar & Ambil Kode Voucher
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Generate Batch (Operator) */}
      <Modal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        title="Generate Batch Voucher Baru (Mikrotik)"
        description="Buat kumpulan kode acak voucher hotspot sesuai profil bandwidth."
        maxWidth="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsBatchModalOpen(false);
          }}
          className="space-y-4 mt-2"
        >
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Jumlah Voucher"
              type="number"
              value={batchCount}
              onChange={(e) => setBatchCount(e.target.value)}
              required
            />
            <Input
              label="Harga Satuan (Rp)"
              type="number"
              value={batchPrice}
              onChange={(e) => setBatchPrice(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Profil Bandwidth / Paket
            </label>
            <select
              value={batchProfile}
              onChange={(e) => setBatchProfile(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
            >
              <option value="1 Hari - Unlimited 15 Mbps">1 Hari - Unlimited 15 Mbps</option>
              <option value="3 Jam - Kuota 2 GB">3 Jam - Kuota 2 GB</option>
              <option value="7 Hari - Unlimited 20 Mbps">7 Hari - Unlimited 20 Mbps</option>
              <option value="1 Bulan - Pelajar Prioritas">1 Bulan - Pelajar Prioritas</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsBatchModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="gradient">
              Generate & Ekspor ke Mikrotik
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
