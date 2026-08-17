"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole } from "@superapp/types";
import {
  Wifi,
  Zap,
  Clock,
  Copy,
  Check,
  Plus,
  CreditCard,
  QrCode,
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
  { id: "pkg-2", name: "Paket Harian Unlimited", duration: "24 Jam", speed: "15 Mbps", quota: "Unlimited Bandwidth", price: 3000, badge: "Paling Populer" },
  { id: "pkg-3", name: "Paket Mingguan Pelajar", duration: "7 Hari", speed: "20 Mbps", quota: "Unlimited Super Speed", price: 15000 },
  { id: "pkg-4", name: "Paket Bulanan Prioritas", duration: "30 Hari", speed: "30 Mbps", quota: "Unlimited Prioritas", price: 45000, badge: "Best Value" },
];

const INITIAL_PURCHASED: PurchasedVoucher[] = [
  {
    code: "SMK-1H-A9X2",
    profileName: "Paket Harian Unlimited (15 Mbps)",
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              9. ISP Voucher Hotspot
            </h1>
            <Badge variant="success">Modul 9</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Penjualan voucher Wi-Fi hotspot sekolah, integrasi MikroTik RouterOS TeFa TKJ, dan analitik pendapatan kas.
          </p>
        </div>

        {isOperator && (
          <Button
            variant="default"
            size="sm"
            className="bg-teal-600 hover:bg-teal-500 text-white font-semibold"
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
          <Card className="p-4 border-teal-500/20 bg-teal-500/5">
            <p className="text-xs font-medium text-teal-600 dark:text-teal-300 uppercase tracking-wider">Total Voucher Dibuat</p>
            <h4 className="text-2xl font-bold text-foreground mt-1">250 Unit</h4>
          </Card>
          <Card className="p-4 border-emerald-500/20 bg-emerald-500/5">
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-300 uppercase tracking-wider">Voucher Terjual</p>
            <h4 className="text-2xl font-bold text-emerald-500 dark:text-emerald-300 mt-1">182 Unit</h4>
          </Card>
          <Card className="p-4 border-sky-500/20 bg-sky-500/5">
            <p className="text-xs font-medium text-sky-600 dark:text-sky-300 uppercase tracking-wider">Stok Tersedia</p>
            <h4 className="text-2xl font-bold text-sky-500 dark:text-sky-300 mt-1">68 Unit</h4>
          </Card>
          <Card className="p-4 border-purple-500/20 bg-purple-500/5">
            <p className="text-xs font-medium text-purple-600 dark:text-purple-300 uppercase tracking-wider">Total Omset Kas</p>
            <h4 className="text-xl font-bold text-purple-500 dark:text-purple-300 mt-1">{formatCurrency(685000)}</h4>
          </Card>
        </div>
      )}

      {/* Active Voucher Code Card (For User) */}
      {purchasedList.length > 0 && (
        <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-r from-teal-900/90 via-slate-900 to-slate-950 p-6 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3 py-0.5 text-xs font-semibold text-teal-200 border border-teal-400/40 backdrop-blur-md">
                <Zap className="h-3.5 w-3.5 text-amber-300" />
                <span>Voucher Hotspot Anda Aktif</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                {purchasedList[0].profileName}
              </h2>
              <p className="text-xs text-slate-300">
                Berlaku hingga: <strong className="text-white">{purchasedList[0].expiresAt}</strong> · SSID Hotspot:{" "}
                <strong className="text-teal-300 font-bold">SMKN1GARUT-STUDENT-5G</strong>
              </p>
            </div>

            {/* Code Copy Box */}
            <div className="flex items-center gap-3 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-teal-500/30 shadow-inner">
              <div>
                <p className="text-[10px] uppercase font-semibold text-teal-300">Kode Login Hotspot:</p>
                <p className="text-xl font-mono font-bold tracking-widest text-amber-300">
                  {purchasedList[0].code}
                </p>
              </div>
              <button
                onClick={() => handleCopy(purchasedList[0].code)}
                className="p-2.5 rounded-xl bg-teal-500 text-slate-950 hover:bg-teal-400 transition-all active:scale-95 shadow-sm font-bold min-h-[40px] min-w-[40px] flex items-center justify-center"
                title="Salin Kode"
                aria-label="Salin Kode Voucher"
              >
                {copiedCode === purchasedList[0].code ? (
                  <Check className="h-4 w-4 stroke-[3]" />
                ) : (
                  <Copy className="h-4 w-4 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Plans Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          Pilih Paket Internet Wi-Fi Hotspot Sekolah (Teaching Factory TKJ)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PACKAGES.map((pkg) => (
            <Card
              key={pkg.id}
              className={`flex flex-col justify-between transition-all duration-200 hover:border-teal-500/40 ${
                pkg.badge ? "border-teal-500/40 bg-teal-500/5" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">{pkg.duration}</span>
                  {pkg.badge && <Badge variant="default">{pkg.badge}</Badge>}
                </div>

                <h3 className="text-base font-bold text-foreground mt-1">
                  {pkg.name}
                </h3>
                <p className="text-xl font-bold text-teal-500 dark:text-teal-300 mt-2">
                  {formatCurrency(pkg.price)}
                </p>

                <div className="mt-4 space-y-2 text-xs text-muted-foreground bg-muted/40 p-3 rounded-2xl border border-border">
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-teal-500" />
                    <span>Kecepatan: <strong className="text-foreground">{pkg.speed}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="h-3.5 w-3.5 text-teal-500" />
                    <span>Kuota: <strong className="text-foreground">{pkg.quota}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border">
                <Button
                  variant="default"
                  className="w-full text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white min-h-[38px]"
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
          <CardTitle>Riwayat Transaksi Voucher Saya</CardTitle>
          <CardDescription>Daftar kode voucher yang pernah diaktifkan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase font-semibold">
                  <th className="pb-3">Kode Voucher</th>
                  <th className="pb-3">Paket</th>
                  <th className="pb-3">Tanggal Beli</th>
                  <th className="pb-3">Harga</th>
                  <th className="pb-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground">
                {purchasedList.map((v, i) => (
                  <tr key={i} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-teal-500 dark:text-teal-300">{v.code}</td>
                    <td className="py-3 font-semibold text-foreground">{v.profileName}</td>
                    <td className="py-3 text-muted-foreground">{v.purchasedAt}</td>
                    <td className="py-3 font-bold text-foreground">{formatCurrency(v.price)}</td>
                    <td className="py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(v.code)}
                        className="text-xs h-7 py-0 font-semibold"
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
        title="Konfirmasi Pembelian Voucher Hotspot"
        description="Pilih metode pembayaran untuk aktivasi instan akun Wi-Fi sekolah."
        maxWidth="md"
      >
        {selectedPkg && (
          <div className="space-y-4 mt-2">
            <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{selectedPkg.name}</p>
                <p className="text-xs text-muted-foreground">Durasi: {selectedPkg.duration} · {selectedPkg.speed}</p>
              </div>
              <p className="text-lg font-bold text-teal-500 dark:text-teal-300">{formatCurrency(selectedPkg.price)}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pilih Metode Pembayaran
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPayMethod("SALDO")}
                  className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all ${
                    payMethod === "SALDO"
                      ? "border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-300 ring-1 ring-teal-500"
                      : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <CreditCard className="h-4 w-4 mb-1 text-teal-500" />
                  Saldo Siswa
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod("QRIS")}
                  className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all ${
                    payMethod === "QRIS"
                      ? "border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-300 ring-1 ring-teal-500"
                      : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <QrCode className="h-4 w-4 mb-1 text-teal-500" />
                  QRIS Instan
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod("CASH")}
                  className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all ${
                    payMethod === "CASH"
                      ? "border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-300 ring-1 ring-teal-500"
                      : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <Clock className="h-4 w-4 mb-1 text-teal-500" />
                  Kasir Lab ISP
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setSelectedPkg(null)}>
                Batal
              </Button>
              <Button type="button" variant="default" className="bg-teal-600 hover:bg-teal-500 text-white font-semibold" onClick={handleBuy}>
                Bayar & Terbitkan Kode
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Generate Batch (Operator) */}
      <Modal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        title="Generate Batch Voucher Baru (MikroTik Sync)"
        description="Buat kumpulan kode acak voucher hotspot untuk diekspor ke RouterOS."
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Profil Bandwidth / Paket
            </label>
            <select
              value={batchProfile}
              onChange={(e) => setBatchProfile(e.target.value)}
              className="w-full h-11 rounded-2xl border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            <Button type="submit" variant="default" className="bg-teal-600 hover:bg-teal-500 text-white font-semibold">
              Generate & Cetak Lembar Voucher
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
