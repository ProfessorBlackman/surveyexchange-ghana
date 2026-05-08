import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Coins, CreditCard, ChevronRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';

const PACKAGES = [
  { id: 10, amount: 10, price: 'GH₵ 5.00', description: 'Quick boost for your survey' },
  { id: 25, amount: 25, price: 'GH₵ 10.00', description: 'Most popular among students', popular: true },
  { id: 50, amount: 50, price: 'GH₵ 18.00', description: 'Perfect for thesis research' },
  { id: 100, amount: 100, price: 'GH₵ 30.00', description: 'Professional research scale' },
];

export default function Credits() {
  const { user, updateCredits } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedPackage, setSelectedPackage] = useState<typeof PACKAGES[0] | null>(null);
  const [step, setStep] = useState<'selection' | 'processing' | 'success'>('selection');

  const purchaseMutation = useMutation({
    mutationFn: async (amount: number) => {
      const res = await api.post('/credits/purchase', { package: amount });
      return res.data;
    },
    onSuccess: (data) => {
      updateCredits(data.newBalance);
      queryClient.invalidateQueries({ queryKey: ['credit-history'] });
      setStep('success');
      toast.success(`+${data.creditsAdded} credits added to your account!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Purchase failed. Please try again.');
      setStep('selection');
    }
  });

  const handlePurchase = () => {
    if (!selectedPackage) return;
    setStep('processing');
    
    // Simulate payment processing delay as requested in instructions
    setTimeout(() => {
      purchaseMutation.mutate(selectedPackage.amount);
    }, 2500);
  };

  if (step === 'success') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-12 shadow-xl shadow-stone-200 border border-stone-200"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black text-stone-900 mb-2">Transaction Complete</h2>
          <p className="text-stone-500 mb-8 font-medium">Your research balance has been updated successfully.</p>
          
          <div className="bg-stone-50 rounded-2xl p-6 mb-8 border border-stone-100">
             <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Added</span>
                <span className="text-xl font-mono font-bold text-emerald-700">+{selectedPackage?.amount} CR</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">New Balance</span>
                <span className="text-xl font-mono font-bold text-stone-900">{user?.creditBalance} CR</span>
             </div>
          </div>

          <button
            onClick={() => setStep('selection')}
            className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-stone-800 transition-all"
          >
            Finished
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl mt-8 font-black text-stone-900 tracking-tight mb-2 underline decoration-emerald-500/30 underline-offset-8">Get Credits</h1>
        <p className="text-stone-500 text-sm font-medium">Fuel your research with additional response targets and feature boosts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {step === 'processing' ? (
            <div className="bg-white rounded-3xl p-20 text-center border border-stone-200 shadow-sm flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-6" />
              <h2 className="text-2xl font-bold text-stone-900 mb-2">Processing Payment</h2>
              <p className="text-stone-400 text-sm italic">Connecting to Ghana Interbank Payment and Settlement Systems...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={cn(
                    "group relative p-8 rounded-3xl border transition-all text-left",
                    selectedPackage?.id === pkg.id 
                      ? "border-emerald-600 bg-emerald-50/20 ring-4 ring-emerald-50 shadow-lg" 
                      : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-md"
                  )}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 right-8 px-3 py-1 bg-emerald-800 text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-md">
                      <Sparkles className="w-3 h-3 text-emerald-300" />
                      Recommended
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black transition-colors",
                      selectedPackage?.id === pkg.id ? "bg-emerald-100 text-emerald-700" : "bg-stone-50 text-stone-400 group-hover:bg-stone-100"
                    )}>
                      {pkg.amount}
                    </div>
                    <span className="text-xl font-mono font-bold text-stone-900">{pkg.price}</span>
                  </div>

                  <h3 className="font-bold text-stone-900 mb-1">
                    {pkg.amount} Credits
                  </h3>
                  <p className="text-xs text-stone-400 font-medium leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className={cn(
                    "mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors",
                    selectedPackage?.id === pkg.id ? "text-emerald-700" : "text-stone-400 group-hover:text-stone-600"
                  )}>
                    Select Package
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm sticky top-24">
            <h2 className="text-xl font-black text-stone-900 mb-6 uppercase tracking-tight">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-stone-500 text-sm font-medium">Selected Credits</span>
                <span className="text-stone-900 font-bold">{selectedPackage?.amount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 text-sm font-medium">Package Price</span>
                <span className="text-stone-900 font-bold">{selectedPackage?.price || '—'}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                <span className="text-stone-900 font-black uppercase text-xs tracking-widest">Total Pay</span>
                <span className="text-2xl font-black text-emerald-800">{selectedPackage?.price || 'GH₵ 0.00'}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                <CreditCard className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-[10px] text-amber-700 font-medium leading-relaxed uppercase tracking-tight">
                  Payments are simulated for research demonstration. No real money will be charged.
                </p>
              </div>

              <button
                disabled={!selectedPackage || step === 'processing'}
                onClick={handlePurchase}
                className="w-full py-4 bg-emerald-800 disabled:opacity-50 disabled:bg-stone-300 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-900/20 hover:bg-emerald-900 transition-all flex items-center justify-center gap-2"
              >
                {step === 'processing' ? 'Connecting...' : 'Secure Checkout'}
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 opacity-30 grayscale">
               <span className="text-[10px] font-black uppercase tracking-widest">MOMO</span>
               <span className="text-[10px] font-black uppercase tracking-widest">VISA</span>
               <span className="text-[10px] font-black uppercase tracking-widest">AMEX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
