import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Play, CheckCircle2, MessageSquare, Star, Users, Target, Zap } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50 overflow-x-hidden">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50 h-16 flex items-center shrink-0 shadow-sm">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-700 flex items-center justify-center text-white font-bold rounded-sm">S</div>
            <span className="text-xl font-extrabold tracking-tight text-emerald-900 uppercase">
              Survey <span className="font-light text-stone-400">Exchange</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-stone-900 transition-colors">Sign In</Link>
            <Link to="/register" className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-emerald-900/10">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-24 md:py-32 flex flex-col items-center text-center">
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-8"
          >
            <span className="flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            The #1 Academic Research Network
          </motion.div> */}
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-stone-900 tracking-tight leading-tight max-w-4xl mb-6"
          >
            Accelerate your research with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800 underline decoration-emerald-200 decoration-8 underline-offset-[12px]">peer-to-peer</span> data collection.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-stone-500 font-medium max-w-2xl mb-10"
          >
            Join thousands of Ghanaian scholars exchanging survey responses. Complete surveys to earn credits, then spend credits to gather high-quality data for your own studies.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-emerald-800 text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2 text-sm"
            >
              Start Collecting Data
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-stone-700 border border-stone-200 font-bold uppercase tracking-widest rounded-2xl hover:bg-stone-50 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Play className="w-4 h-4" />
              See How It Works
            </Link>
          </motion.div>
        </section>

        {/* Functionality Section */}
        <section className="bg-white py-24 border-y border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-4">A simple, effective credit economy</h2>
              <p className="text-stone-500 text-lg">No payments required. Our platform runs entirely on mutual academic support.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: <Target className="w-6 h-6" />, 
                  title: '1. Create Your Survey', 
                  desc: 'Design beautiful, dynamic questionnaires using our powerful native builder. Support for multiple choices, ratings, and qualitative answers.' 
                },
                { 
                  icon: <Zap className="w-6 h-6" />, 
                  title: '2. Earn Credits', 
                  desc: 'Browse the feed and participate in other students’ research. Every survey you complete earns you credits instantly.' 
                },
                { 
                  icon: <Users className="w-6 h-6" />, 
                  title: '3. Collect Responses', 
                  desc: 'Publish your survey to the network! Use your earned credits to boost visibility and hit your target sample size in record time.' 
                }
              ].map((step, i) => (
                <div key={i} className="bg-stone-50 rounded-3xl p-8 border border-stone-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 transition-all group">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-700 mb-6 border border-stone-200 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3">{step.title}</h3>
                  <p className="text-stone-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-5xl font-black text-stone-900 leading-tight">
                Stop begging in WhatsApp groups.
              </h2>
              <p className="text-xl text-stone-500">
                Data collection shouldn't be the hardest part of your thesis. SurveyExchange ensures high-quality, anonymous data from verified peers.
              </p>
              <ul className="space-y-4">
                {[
                  'Targeted demographics across diverse fields of study',
                  'Real-time automated chart analytics and response mapping',
                  'Verified academic user authentication',
                  'Fair algorithms ensure your survey gets seen'
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-stone-700 font-bold">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full bg-white rounded-3xl border border-stone-200 p-8 shadow-xl">
               <div className="space-y-6">
                 {/* Fake UI component purely for decoration showing platform aesthetic */}
                 <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                   <h4 className="font-bold text-stone-900">Live Analytics Feed</h4>
                   <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Active</span>
                 </div>
                 {[76, 45, 92].map((val, idx) => (
                   <div key={idx} className="space-y-2">
                     <div className="flex justify-between text-xs font-bold text-stone-500">
                       <span>Response Batch #{idx + 1}</span>
                       <span>{val}%</span>
                     </div>
                     <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }} 
                         whileInView={{ width: `${val}%` }} 
                         transition={{ duration: 1, delay: idx * 0.2 }}
                         className="h-full bg-emerald-500 rounded-full" 
                       />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-emerald-950 py-24 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Trusted by scholars</h2>
              <div className="flex justify-center gap-1 text-amber-400">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Sarah K.", role: "Masters Student", quote: "I collected 200 responses for my thesis in just 3 days without spamming any group chats." },
                { name: "Dr. Mensah", role: "Researcher", quote: "The built-in analytics dashboard saved me weeks of manual data tabulation. Absolutely fantastic platform." },
                { name: "Kwame A.", role: "Undergrad", quote: "The credit system is genius. It keeps everyone engaged and ensures high-quality, thoughtful responses." }
              ].map((review, i) => (
                <div key={i} className="bg-emerald-900/50 rounded-3xl p-8 border border-emerald-800">
                  <MessageSquare className="w-8 h-8 text-emerald-500 mb-6 opacity-50" />
                  <p className="text-lg font-medium leading-relaxed mb-6">"{review.quote}"</p>
                  <div>
                    <p className="font-bold text-emerald-100">{review.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{review.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer is handled by App.tsx globally for unauthenticated? No, let's just make it cohesive */}
      <footer className="bg-stone-900 text-stone-500 py-12 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-stone-800 flex items-center justify-center text-white font-bold rounded-sm text-[10px]">S</div>
            <span className="font-extrabold tracking-tight uppercase text-stone-300">Survey Exchange</span>
          </div>
          <p className="uppercase tracking-widest font-black text-[9px]">&copy; 2026 Academic Research Limited. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
