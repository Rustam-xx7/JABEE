'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import LoadingScreen from '../components/LoadingScreen';
import Character1ScrollCanvas from '../components/Character1ScrollCanvas';
import BikeScrollCanvas from '../components/BikeScrollCanvas';

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [navMode, setNavMode] = useState('dark');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);

      if (scrollTop > 40) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }

      // Check current visible section mode
      const sections = document.querySelectorAll('section[data-nav-mode], footer[data-nav-mode]');
      const navOffset = 70;
      let currentMode = 'dark';
      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= navOffset && rect.bottom >= navOffset) {
          currentMode = sec.getAttribute('data-nav-mode') || 'dark';
        }
      });
      setNavMode(currentMode);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Intersection Observer for scroll animations
    const revealItems = document.querySelectorAll('.reveal-on-scroll, .reveal-from-left, .reveal-from-right');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealItems.forEach((el) => observer.observe(el));

    // Fallback trigger for elements already in viewport
    const timer = setTimeout(() => {
      revealItems.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add('active');
        }
      });
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F6F5F2] text-[#111111]">
      {/* 5-SECOND INTRO LOGO ANIMATION LOADING SCREEN */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* TOP SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 w-full h-[3px] z-50 pointer-events-none" id="scroll-progress-container">
        <div
          className="h-full bg-jabee-orange transition-all duration-75 ease-out shadow-[0_0_8px_#FF6B1A]"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* FIXED FLOATING NAVBAR */}
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 py-4 px-6 md:px-12 flex items-center justify-between ${
          navScrolled
            ? navMode === 'light'
              ? 'bg-[#0B0D12]/90 backdrop-blur-md border-b border-white/10'
              : 'bg-white/90 backdrop-blur-md border-b border-neutral-200/70 shadow-sm'
            : 'bg-transparent'
        }`}
        id="main-nav"
      >
        <a className="flex items-center gap-3 group" href="#">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-jabee-orange flex items-center justify-center text-white font-black text-lg tracking-tighter shadow-md group-hover:scale-105 transition-transform">
              J
            </div>
            <span
              className={`text-2xl font-black tracking-wider transition-colors duration-300 font-display ${
                navMode === 'light' ? 'text-white' : 'text-jabee-black'
              }`}
            >
              JABEE<span className="text-jabee-orange">.</span>
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a
            className={`text-sm font-medium transition-colors hover:text-jabee-orange ${
              navMode === 'light' ? 'text-neutral-200' : 'text-[#333333]'
            }`}
            href="#story"
          >
            Story
          </a>
          <a
            className={`text-sm font-medium transition-colors hover:text-jabee-orange ${
              navMode === 'light' ? 'text-neutral-200' : 'text-[#333333]'
            }`}
            href="#bike-reveal"
          >
            The Revelation
          </a>
          <a
            className={`text-sm font-medium transition-colors hover:text-jabee-orange ${
              navMode === 'light' ? 'text-neutral-200' : 'text-[#333333]'
            }`}
            href="#features"
          >
            Features
          </a>
          <a
            className={`text-sm font-medium transition-colors hover:text-jabee-orange ${
              navMode === 'light' ? 'text-neutral-200' : 'text-[#333333]'
            }`}
            href="#team"
          >
            Team
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <a
            className="bg-jabee-orange hover:bg-jabee-orangeDark text-white px-5 py-2.5 rounded-full text-xs md:text-sm font-bold tracking-wide transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md shadow-jabee-orange/30 flex items-center gap-2"
            href="#download-section"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a2.43 2.43 0 0 1-.22-.387C3.13 21.282 3 20.468 3 19.349V4.651c0-1.119.13-1.933.39-2.45.064-.132.138-.262.22-.387zm1.48-.909l11.472 6.574-2.88 2.88L5.09.905zm0 22.19l8.59-8.59 2.88 2.88-11.47 6.57c.002 0 0-.86 0-.86zm12.39-7.098l3.14-1.8c.84-.48.84-1.26 0-1.74l-3.14-1.8-2.52 2.67 2.52 2.67z" />
            </svg>
            <span>Download App</span>
          </a>
        </div>
      </header>

      {/* ========================================== */}
      {/* STORY SCENE 1: Character 1 (Light Studio)  */}
      {/* ========================================== */}
      <section
        className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-16 md:pt-28 md:pb-20 px-4 sm:px-6 md:px-16 lg:px-24 bg-[#F6F5F2] overflow-hidden"
        data-nav-mode="dark"
        id="story"
      >
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-20">
          {/* Left text card (order-2 on mobile, order-1 on desktop) */}
          <div className="lg:col-span-6 flex flex-col justify-center relative z-30 reveal-from-left order-2 lg:order-1">
            <div className="bg-white/95 p-5 sm:p-8 md:p-12 rounded-3xl border border-neutral-200/80 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3 md:mb-6">
                <div className="w-[3px] h-5 md:h-6 bg-jabee-orange rounded-full"></div>
                <span className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-[#666666]">
                  WEEKDAY MORNING
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-jabee-black tracking-tight leading-[1.12] mb-3 md:mb-6 font-display">
                Every weekday, the same road to work.
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-[#555555] font-normal leading-relaxed mb-4 md:mb-8">
                Meet an everyday office professional. Bag on his shoulder, a long day ahead, and a ride to book.
              </p>
              <div className="flex items-center gap-4 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#888888] pt-3 md:pt-4 border-t border-[#EAE6DF]">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 08:30 AM Routine
                </span>
                <span>•</span>
                <span>Daily Office Rush</span>
              </div>
            </div>
          </div>

          {/* Right: Character 1 scroll animation (order-1 on mobile, order-2 on desktop) */}
          <div className="lg:col-span-6 flex justify-center items-center py-2 md:py-6 relative z-10 order-1 lg:order-2">
            <Character1ScrollCanvas isLoading={isLoading} triggerId="story" />
          </div>
        </div>

        {/* Seamless bottom boundary gradient */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#CFCBC6] pointer-events-none z-10"></div>
      </section>

      {/* ============================================================== */}
      {/* STORY SCENE 2: Character 2 (Warm Grey Wall, Sunlit Greenery)   */}
      {/* ============================================================== */}
      <section
        className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-20 md:pt-28 md:pb-24 px-4 sm:px-6 md:px-16 lg:px-24 bg-[#CFCBC6] overflow-hidden"
        data-nav-mode="dark"
      >
        <div className="absolute inset-0 z-0">
          <img
            alt="Every morning commute waiting"
            className="w-full h-full object-cover  sm:object-[10%_left]"
            src="/character2bg.png"
            onError={(e) => {
              e.currentTarget.src =
                "https://lh3.googleusercontent.com/aida-public/AB6AXuC07UkhszDLPv8owlLbIrpfgYvhVdeVFKgvi_IYnE0otKmR7_E2pBjZFci9mmCvBFVew0d56iLnr6GboZSNhH85CXlPOAWQ75pncE55R1eovYZElx7PnrUPPpe7JfgCilqWxgNJWd8pAtVS3oxk4UNv8lzTCISPKPDP7IAvw4Cn8Pc5nI5UuJqXb9dbuSLhmhUAKgJGxj9ze0rjN4s8Q_XRV4jc-HYqW24-FicK8_b2otCORKt1P-JkH-eaA1h-ddyG6A";
            }}
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-[#CFCBC6] to-transparent pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-b from-transparent to-[#0B0D12] pointer-events-none z-10"></div>

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-20">
          <div className="lg:col-span-6 flex flex-col items-start justify-center order-1 lg:order-1">
            <div className="bg-white/90 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-soft border border-white/80 inline-flex items-center gap-2 text-xs font-semibold text-[#333333] animate-float-2 mb-2 lg:mb-0">
              <span>📍 Home → Tech Park (9.4 km)</span>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center reveal-from-right order-2 lg:order-2">
            <div className="bg-white/90 p-5 sm:p-8 md:p-12 rounded-3xl border border-white/70 shadow-2xl">
              <div className="flex items-center gap-3.5 mb-3 md:mb-6">
                <div className="w-[3px] h-5 md:h-6 bg-jabee-orange rounded-full"></div>
                <span className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-[#55524C]">
                  SAME JOURNEY. EVERY DAY.
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-jabee-black tracking-tight leading-[1.12] mb-3 md:mb-6 font-display">
                Every morning, he books the same ride.
              </h2>
              <p className="text-sm sm:text-lg md:text-xl text-[#3A3835] font-normal leading-relaxed mb-4 md:mb-8">
                Same pickup. Same drop. Same time. Yet he opens the app and does it all over again, five days a week.
              </p>
              <div className="grid grid-cols-5 gap-2 max-w-xs pt-2">
                <div className="h-2 rounded-full bg-jabee-orange"></div>
                <div className="h-2 rounded-full bg-jabee-orange"></div>
                <div className="h-2 rounded-full bg-jabee-orange"></div>
                <div className="h-2 rounded-full bg-jabee-orange"></div>
                <div className="h-2 rounded-full bg-jabee-orange"></div>
              </div>
              <span className="text-[11px] uppercase tracking-wider text-[#66635D] font-bold mt-2.5 block">
                5 days every week • Zero consistency
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* STORY SCENE 3: Character 3 (Dark, Stressed, Spotlight)         */}
      {/* ============================================================== */}
      <section
        className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-20 md:pt-28 md:pb-24 px-4 sm:px-6 md:px-16 lg:px-24 bg-[#0B0D12] text-white overflow-hidden"
        data-nav-mode="light"
      >
        <div className="absolute inset-0 z-0">
          <img
            alt="Stressed commuter in spotlight"
            className="w-full h-full object-cover object-[center_top] sm:object-center"
            src="/character3bg.png"
            onError={(e) => {
              e.currentTarget.src =
                "https://lh3.googleusercontent.com/aida-public/AB6AXuB3vVgDcc4i1Q5Idk6GnZG85NorufbvBi2zbHIR7YiHFQftwMvZHRQWEJhHSaAn9bU41wVa6oT8ZmnK3zsFH9XqZQhIiWQTUrrBrRJtuWGemjY-EF2sy-_iGZWxgZS4_8zmepeBgtfJAn7nQkJyJqonweFaCt_uiD3jBY82VZ_EJ-anuEQ2x8GZ5ZLmJpLNYvBovYnkiFfCa0Y1FNMKpk0UP3lCXI1LR7rZITMOglah_HHVzPWoDzlLxoA6Mui4ljFdaA";
            }}
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-[#0B0D12] to-transparent pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-b from-transparent to-[#EAE6DF] pointer-events-none z-10"></div>

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-20">
          <div className="lg:col-span-6 flex flex-col justify-center reveal-from-left order-2 lg:order-1">
            <div className="bg-[#0B0D12]/85 p-5 sm:p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-3.5 mb-3 md:mb-6">
                <div className="w-[3px] h-5 md:h-6 bg-jabee-orange rounded-full shadow-[0_0_12px_#FF6B1A]"></div>
                <span className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-[#FF9E54]">
                  THEN THE STRESS BEGINS
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-3 md:mb-6 font-display">
                Prices jump.<br />
                Captains cancel.<br />
                <span className="text-neutral-400">Time runs out.</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-[#CCCCCC] font-normal leading-relaxed mb-4 md:mb-8">
                Sometimes the fare changes. Sometimes no captain accepts. Rides get cancelled again and again, and
                every cancellation costs minutes he doesn't have. The day starts with stress and a bad mood.
              </p>
              <div className="bg-black/60 border border-white/15 rounded-2xl p-3 sm:p-4 max-w-md">
                <div className="flex items-center justify-between text-xs text-red-400 font-semibold mb-1.5 sm:mb-2">
                  <span className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></path>
                    </svg>
                    High demand in your area
                  </span>
                  <span className="bg-red-500/25 text-red-300 px-2 py-0.5 rounded text-[10px] font-bold">
                    +68% Surge
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-neutral-300">Searching for nearby captains (3m 42s elapsed)...</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative flex flex-col items-center justify-center gap-3 py-4 lg:py-8 reveal-from-right order-1 lg:order-2">
            <div className="bg-[#181A20]/95 border border-amber-500/50 text-amber-300 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-float-1">
              <span className="text-amber-400 font-bold">↑</span>
              <span>Fare increased to $28.50</span>
            </div>
            <div className="bg-[#181A20]/95 border border-blue-500/40 text-blue-200 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-float-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              <span>Searching for captain...</span>
            </div>
            <div className="bg-[#241315]/95 border border-red-500/50 text-red-300 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-float-3">
              <span className="text-red-400 font-bold">✕</span>
              <span>Ride cancelled by captain</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* STORY SCENE 4: Character 4 (Bright Office & Modern Relief)    */}
      {/* ============================================================== */}
      <section
        className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-20 md:pt-28 md:pb-28 px-4 sm:px-6 md:px-16 lg:px-24 bg-[#EAE6DF] overflow-hidden"
        data-nav-mode="dark"
      >
        <div className="absolute inset-0 z-0">
          <img
            alt="Calm commuter holding mug at office desk"
            className="w-full h-full object-cover object-[center_top] sm:object-center"
            src="/character4bg.png"
            onError={(e) => {
              e.currentTarget.src =
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDG1BBm2s-HzuRdip7Wp5i_NceuKXrxMSzCrPcxgPZwbQFS3yyvk1KZ_NgFgrhWHavodrX7dUtbNmNWksvag6Yw2NQ7vxTm8zwXleonPAV2tpD4LXXT04td_p8c_bfgkz0oHwv_92JD3S4CfmJzDsXGMaXIVRGwsRjqy9-Z-7d78uipyqt2tEqYjg9D89UqJjMw-5TH61HnD_5tcQVsl2kbszjhnrRzXmW1-mECiR2vuJJTN491ncZeIzxE8H310Rh1cQ";
            }}
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-[#EAE6DF] to-transparent pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-b from-transparent to-white pointer-events-none z-10"></div>

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-20">
          <div className="lg:col-span-6 flex items-end justify-start order-1 lg:order-1 mb-2 lg:mb-0">
            <div className="bg-white/95 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-soft border border-emerald-500/20 flex items-center gap-3 animate-float-1">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <div>
                <div className="text-xs font-bold text-jabee-black">Captain Rajesh arrived</div>
                <div className="text-[10px] text-neutral-500">Same friendly smile • 8:28 AM</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center reveal-from-right order-2 lg:order-2">
            <div className="bg-white/92 p-5 sm:p-8 md:p-12 rounded-3xl border border-white/80 shadow-2xl">
              <div className="flex items-center gap-3.5 mb-3 md:mb-6">
                <div className="w-[3px] h-5 md:h-6 bg-jabee-orange rounded-full"></div>
                <span className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-jabee-orange">
                  WHAT IF?
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-jabee-black tracking-tight leading-[1.12] mb-3 md:mb-6 font-display">
                What if he never had to book again?
              </h2>
              <p className="text-sm sm:text-lg md:text-xl text-[#444444] font-normal leading-relaxed mb-4 md:mb-8">
                A fixed captain. Ready at the same perfect time. The same fair price. Every single day. No headache.
                No stress. Just a good start to the day.
              </p>
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="flex items-center gap-2 bg-neutral-50/80 p-2.5 sm:p-3 rounded-xl border border-neutral-200">
                  <span className="w-2 h-2 rounded-full bg-jabee-orange"></span>
                  <span className="text-[11px] sm:text-xs font-bold text-jabee-black">Fixed Daily Captain</span>
                </div>
                <div className="flex items-center gap-2 bg-neutral-50/80 p-2.5 sm:p-3 rounded-xl border border-neutral-200">
                  <span className="w-2 h-2 rounded-full bg-jabee-orange"></span>
                  <span className="text-[11px] sm:text-xs font-bold text-jabee-black">Zero Morning Surge</span>
                </div>
                <div className="flex items-center gap-2 bg-neutral-50/80 p-2.5 sm:p-3 rounded-xl border border-neutral-200">
                  <span className="w-2 h-2 rounded-full bg-jabee-orange"></span>
                  <span className="text-[11px] sm:text-xs font-bold text-jabee-black">Automated Dispatch</span>
                </div>
                <div className="flex items-center gap-2 bg-neutral-50/80 p-2.5 sm:p-3 rounded-xl border border-neutral-200">
                  <span className="w-2 h-2 rounded-full bg-jabee-orange"></span>
                  <span className="text-[11px] sm:text-xs font-bold text-jabee-black">Punctual Peace of Mind</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* BIKE REVEAL SECTION: Transformation with Full Width Parts       */}
      {/* ============================================================== */}
      <section className="py-20 px-4 sm:px-6 md:px-16 lg:px-24 bg-white text-jabee-black min-h-screen flex flex-col justify-center" data-nav-mode="dark" id="bike-reveal-container">
        <div className="max-w-7xl mx-auto w-full">
          {/* Section Intro */}
          <div className="text-center max-w-3xl mx-auto mb-10 reveal-on-scroll">
            <span className="text-xs font-extrabold uppercase tracking-[0.3em] text-jabee-orange block mb-3">
              THE TRANSFORMATION
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-jabee-black tracking-tight font-display mb-4">
              Building effortless commutes brick by brick.
            </h2>
            <p className="text-base md:text-lg text-neutral-500">
              The same daily struggle turned into an engineered, reliable rhythm for the modern professional.
            </p>
          </div>

          {/* Full-width bike frame scroll animation */}
          <div className="w-full max-w-5xl mx-auto mb-12">
            <div className="bg-white rounded-3xl p-2 sm:p-4 border border-neutral-100 shadow-card">
              <BikeScrollCanvas isLoading={isLoading} />
            </div>
          </div>

          {/* 3 Transformation Stage Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20 reveal-on-scroll">
            <div className="bg-[#FAFAFA] p-7 rounded-2xl border border-neutral-200/80 hover:border-jabee-orange transition-colors">
              <div className="flex items-start gap-3.5 mb-2">
                <div className="w-[3px] h-6 bg-jabee-orange rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <span className="text-xs md:text-sm font-extrabold uppercase tracking-[0.2em] text-jabee-black block font-display">
                    SAME PIECES. DIFFERENT POSSIBILITIES.
                  </span>
                  <p className="text-sm text-neutral-500 mt-2 font-normal leading-relaxed">
                    Every commuter has the same hours, roads, and transit needs. We rethink how those pieces connect.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#FAFAFA] p-7 rounded-2xl border border-neutral-200/80 hover:border-jabee-orange transition-colors">
              <div className="flex items-start gap-3.5 mb-2">
                <div className="w-[3px] h-6 bg-jabee-orange rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <span className="text-xs md:text-sm font-extrabold uppercase tracking-[0.2em] text-jabee-black block font-display">
                    A ROAD TAKES SHAPE.
                  </span>
                  <p className="text-sm text-neutral-500 mt-2 font-normal leading-relaxed">
                    Routes align. Predictable pickup corridors replace frantic app refreshes every single morning.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#FAFAFA] p-7 rounded-2xl border border-neutral-200/80 hover:border-jabee-orange transition-colors">
              <div className="flex items-start gap-3.5 mb-2">
                <div className="w-[3px] h-6 bg-jabee-orange rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <span className="text-xs md:text-sm font-extrabold uppercase tracking-[0.2em] text-jabee-black block font-display">
                    MOVEMENT FINDS FORM.
                  </span>
                  <p className="text-sm text-neutral-500 mt-2 font-normal leading-relaxed">
                    The JABEE bike arrives at your doorstep on time. Sleek, dedicated, and ready when you are.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Reveal on pure white */}
          <div className="max-w-4xl mx-auto text-center border-t border-neutral-100 pt-16 reveal-on-scroll">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-jabee-black tracking-tighter mb-4 font-display">
              JABEE<span className="text-jabee-orange">.</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900 tracking-tight max-w-2xl mx-auto mb-6 font-display">
              Office professionals' favourite ride booking app.
            </p>
            <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-10">
              Our founder lived this problem every morning. So he built JABEE for everyone who makes the same commute.
              The JABEE team makes it stress-free for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4" id="download-section">
              <a
                className="inline-flex items-center gap-3.5 bg-jabee-orange hover:bg-jabee-orangeDark text-white px-8 py-4 rounded-full text-base font-bold tracking-wide shadow-glow-orange hover:scale-105 active:scale-95 transition-all duration-200"
                href="#download"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a2.43 2.43 0 0 1-.22-.387C3.13 21.282 3 20.468 3 19.349V4.651c0-1.119.13-1.933.39-2.45.064-.132.138-.262.22-.387zm1.48-.909l11.472 6.574-2.88 2.88L5.09.905zm0 22.19l8.59-8.59 2.88 2.88-11.47 6.57c.002 0 0-.86 0-.86zm12.39-7.098l3.14-1.8c.84-.48.84-1.26 0-1.74l-3.14-1.8-2.52 2.67 2.52 2.67z" />
                </svg>
                <div className="text-left leading-tight">
                  <div className="text-[10px] uppercase font-semibold text-white/80 tracking-wider">Available on</div>
                  <div className="text-lg font-black tracking-tight">Get it on Google Play</div>
                </div>
              </a>
              <div className="text-xs font-semibold text-neutral-400">⭐ 4.9/5 from 12,000+ daily riders</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MEET THE JABEE TEAM: White Cards, 4 Groups                     */}
      {/* ============================================================== */}
      <section className="py-24 px-6 md:px-16 lg:px-24 bg-[#FAFAFA] border-t border-neutral-100" data-nav-mode="dark" id="team">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-[3px] h-5 bg-jabee-orange rounded-full"></div>
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-neutral-500">
                BEHIND THE HELMET
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-jabee-black tracking-tight font-display mb-4">
              The people behind JABEE
            </h2>
            <p className="text-neutral-500 text-base md:text-lg">
              A dedicated crew in Burdwan, West Bengal obsessed with bringing calm, joy, and punctuality to your everyday
              commute.
            </p>
          </div>

          {/* 4 Team Groups */}
          <div className="space-y-16">
            {/* Group 1: Founders */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-jabee-orange"></span>
                <h3 className="text-sm md:text-base font-bold text-jabee-black tracking-wider uppercase font-display">
                  Founders
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="group bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-card hover:shadow-xl hover:border-jabee-orange transition-all duration-300">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-neutral-100 flex items-center justify-center relative overflow-hidden group-hover:bg-orange-50 transition-colors">
                    <svg
                      className="w-12 h-12 text-neutral-400 group-hover:text-jabee-orange transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v2a1 1 0 0 1-1 1h-1v5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-5H5a1 1 0 0 1-1-1v-2a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v1h4V6a2 2 0 0 0-2-2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h4 className="text-base font-bold text-jabee-black group-hover:text-jabee-orange transition-colors">
                      [Founder Name]
                    </h4>
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mt-1">
                      Founder &amp; CEO
                    </p>
                    <p className="text-xs text-neutral-500 mt-2">Daily commuter turned mobility architect.</p>
                  </div>
                </div>

                <div className="group bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-card hover:shadow-xl hover:border-jabee-orange transition-all duration-300">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-neutral-100 flex items-center justify-center relative overflow-hidden group-hover:bg-orange-50 transition-colors">
                    <svg
                      className="w-12 h-12 text-neutral-400 group-hover:text-jabee-orange transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v2a1 1 0 0 1-1 1h-1v5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-5H5a1 1 0 0 1-1-1v-2a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v1h4V6a2 2 0 0 0-2-2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h4 className="text-base font-bold text-jabee-black group-hover:text-jabee-orange transition-colors">
                      [Co-Founder Name]
                    </h4>
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mt-1">
                      Co-Founder &amp; COO
                    </p>
                    <p className="text-xs text-neutral-500 mt-2">Scaling captain networks with empathy.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Group 2: Tech Team */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-jabee-orange"></span>
                <h3 className="text-sm md:text-base font-bold text-jabee-black tracking-wider uppercase font-display">
                  Tech Team
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: '[Tech Lead Name]', role: 'Head of Engineering', desc: 'Route optimization & reliable dispatch.' },
                  { name: '[Mobile Architect]', role: 'Lead Android Developer', desc: 'Zero-lag rider tracking experience.' },
                  { name: '[Product Designer]', role: 'Lead Product Designer', desc: 'Crafting clutter-free ride journeys.' },
                  { name: '[Backend Specialist]', role: 'Infrastructure Lead', desc: '99.99% uptime for morning commutes.' },
                ].map((member, i) => (
                  <div
                    key={i}
                    className="group bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-card hover:shadow-xl hover:border-jabee-orange transition-all duration-300"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-neutral-100 flex items-center justify-center relative overflow-hidden group-hover:bg-orange-50 transition-colors">
                      <svg
                        className="w-12 h-12 text-neutral-400 group-hover:text-jabee-orange transition-colors"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v2a1 1 0 0 1-1 1h-1v5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-5H5a1 1 0 0 1-1-1v-2a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h4 className="text-base font-bold text-jabee-black group-hover:text-jabee-orange transition-colors">
                        {member.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mt-1">
                        {member.role}
                      </p>
                      <p className="text-xs text-neutral-500 mt-2">{member.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Group 3: Marketing Team */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-jabee-orange"></span>
                <h3 className="text-sm md:text-base font-bold text-jabee-black tracking-wider uppercase font-display">
                  Marketing Team
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: '[Growth Lead]', role: 'Head of Growth', desc: 'Connecting office parks with fleets.' },
                  { name: '[Brand Strategist]', role: 'Brand Communications', desc: 'Championing stress-free morning stories.' },
                  { name: '[Corporate Partnerships]', role: 'B2B Mobility Lead', desc: 'Direct office subscription perks.' },
                ].map((member, i) => (
                  <div
                    key={i}
                    className="group bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-card hover:shadow-xl hover:border-jabee-orange transition-all duration-300"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-neutral-100 flex items-center justify-center relative overflow-hidden group-hover:bg-orange-50 transition-colors">
                      <svg
                        className="w-12 h-12 text-neutral-400 group-hover:text-jabee-orange transition-colors"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v2a1 1 0 0 1-1 1h-1v5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-5H5a1 1 0 0 1-1-1v-2a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h4 className="text-base font-bold text-jabee-black group-hover:text-jabee-orange transition-colors">
                        {member.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mt-1">
                        {member.role}
                      </p>
                      <p className="text-xs text-neutral-500 mt-2">{member.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Group 4: Social Media Team */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-jabee-orange"></span>
                <h3 className="text-sm md:text-base font-bold text-jabee-black tracking-wider uppercase font-display">
                  Social Media Team
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: '[Community Manager]', role: 'Community & Support', desc: 'Listening to commuter stories 24/7.' },
                  { name: '[Content Creator]', role: 'Video & Visual Content', desc: 'Sharing the #MorningPeace vibe.' },
                  { name: '[Campaign Specialist]', role: 'Social Engagement', desc: 'Celebrating top punctuality captains.' },
                ].map((member, i) => (
                  <div
                    key={i}
                    className="group bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-card hover:shadow-xl hover:border-jabee-orange transition-all duration-300"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-neutral-100 flex items-center justify-center relative overflow-hidden group-hover:bg-orange-50 transition-colors">
                      <svg
                        className="w-12 h-12 text-neutral-400 group-hover:text-jabee-orange transition-colors"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v2a1 1 0 0 1-1 1h-1v5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-5H5a1 1 0 0 1-1-1v-2a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h4 className="text-base font-bold text-jabee-black group-hover:text-jabee-orange transition-colors">
                        {member.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mt-1">
                        {member.role}
                      </p>
                      <p className="text-xs text-neutral-500 mt-2">{member.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* APP FEATURES: 3x3 Card Grid                                    */}
      {/* ============================================================== */}
      <section className="py-28 px-6 md:px-16 lg:px-24 bg-white" data-nav-mode="dark" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 reveal-on-scroll">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-[3px] h-5 bg-jabee-orange rounded-full"></div>
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-jabee-orange">
                CORE CAPABILITIES
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-jabee-black tracking-tight font-display mb-4">
              Engineered for the corporate commute.
            </h2>
            <p className="text-neutral-500 text-base md:text-lg">
              Nine key pillars that transform everyday office travel from an erratic gamble into a dependable luxury.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white p-8 rounded-3xl border border-neutral-100 hover:border-jabee-orange shadow-card hover:shadow-soft transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-jabee-orange flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-jabee-orange group-hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-jabee-black mb-2 font-display">Fixed daily ride</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Book once, ride every weekday without ever opening the app to hail again.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white p-8 rounded-3xl border border-neutral-100 hover:border-jabee-orange shadow-card hover:shadow-soft transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-jabee-orange flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-jabee-orange group-hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-jabee-black mb-2 font-display">Same captain, same time</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Meet the same trusted professional rider outside your gate at your exact scheduled minute.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white p-8 rounded-3xl border border-neutral-100 hover:border-jabee-orange shadow-card hover:shadow-soft transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-jabee-orange flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-jabee-orange group-hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-jabee-black mb-2 font-display">Same fair price, no surge</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Rain, festival, or peak hour — your monthly commute fare remains locked and strictly fair.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white p-8 rounded-3xl border border-neutral-100 hover:border-jabee-orange shadow-card hover:shadow-soft transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-jabee-orange flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-jabee-orange group-hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-jabee-black mb-2 font-display">Scheduled pickups &amp; alerts</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Gentle automated alerts 10 minutes prior so you can finish your coffee without rushing.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-white p-8 rounded-3xl border border-neutral-100 hover:border-jabee-orange shadow-card hover:shadow-soft transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-jabee-orange flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-jabee-orange group-hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-jabee-black mb-2 font-display">Live ride tracking</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                High precision real-time GPS telemetry showing your dedicated bike approaching.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-white p-8 rounded-3xl border border-neutral-100 hover:border-jabee-orange shadow-card hover:shadow-soft transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-jabee-orange flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-jabee-orange group-hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-jabee-black mb-2 font-display">Verified captains</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Every partner undergoes rigorous criminal background checks, defensive ride testing, and ratings review.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="group bg-white p-8 rounded-3xl border border-neutral-100 hover:border-jabee-orange shadow-card hover:shadow-soft transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-jabee-orange flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-jabee-orange group-hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-jabee-black mb-2 font-display">In-app captain chat</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Instant one-tap direct messaging with masked phone numbers for absolute rider privacy.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="group bg-white p-8 rounded-3xl border border-neutral-100 hover:border-jabee-orange shadow-card hover:shadow-soft transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-jabee-orange flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-jabee-orange group-hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-jabee-black mb-2 font-display">UPI, Cash &amp; Card payments</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Automate autopay via UPI or corporate cards, or opt for seamless cash reconciliation.
              </p>
            </div>

            {/* Feature 9 */}
            <div className="group bg-white p-8 rounded-3xl border border-neutral-100 hover:border-jabee-orange shadow-card hover:shadow-soft transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-jabee-orange flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-jabee-orange group-hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-jabee-black mb-2 font-display">Ride history &amp; trip sharing</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                One-click monthly expense statements and shareable live links for family tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FOOTER                                                         */}
      {/* ============================================================== */}
      <footer
        className="bg-jabee-black text-white pt-20 pb-12 px-6 md:px-16 lg:px-24 border-t border-neutral-800"
        data-nav-mode="light"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-neutral-800">
            {/* Brand Info */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black tracking-wider text-white font-display">
                  JABEE<span className="text-jabee-orange">.</span>
                </span>
              </div>
              <p className="text-base text-neutral-300 font-medium max-w-sm">
                Office professionals' favourite ride booking app.
              </p>
              <p className="text-xs text-neutral-500 max-w-sm leading-relaxed pt-2">
                Eliminating morning commute friction with predictable daily motorcycle captains for office goers.
              </p>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3 space-y-3">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-jabee-orange">Quick Links</div>
              <ul className="space-y-2.5 text-sm text-neutral-400">
                <li>
                  <a className="hover:text-white transition-colors" href="#story">
                    Story
                  </a>
                </li>
                <li>
                  <a className="hover:text-white transition-colors" href="#bike-reveal">
                    The Revelation
                  </a>
                </li>
                <li>
                  <a className="hover:text-white transition-colors" href="#features">
                    Features
                  </a>
                </li>
                <li>
                  <a className="hover:text-white transition-colors" href="#team">
                    Team
                  </a>
                </li>
              </ul>
            </div>

            {/* App Download & Contact */}
            <div className="lg:col-span-4 space-y-4">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-jabee-orange">Get the App</div>
              <a
                className="inline-flex items-center gap-3 bg-neutral-900 border border-neutral-700 hover:border-jabee-orange px-5 py-3 rounded-2xl text-white transition-all duration-200 group"
                href="#download-section"
              >
                <svg className="w-6 h-6 fill-jabee-orange group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a2.43 2.43 0 0 1-.22-.387C3.13 21.282 3 20.468 3 19.349V4.651c0-1.119.13-1.933.39-2.45.064-.132.138-.262.22-.387zm1.48-.909l11.472 6.574-2.88 2.88L5.09.905zm0 22.19l8.59-8.59 2.88 2.88-11.47 6.57c.002 0 0-.86 0-.86zm12.39-7.098l3.14-1.8c.84-.48.84-1.26 0-1.74l-3.14-1.8-2.52 2.67 2.52 2.67z" />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] uppercase font-semibold text-neutral-400">Download for Android</div>
                  <div className="text-sm font-bold tracking-tight">Google Play</div>
                </div>
              </a>

              <div className="pt-2 text-sm text-neutral-400">
                <span className="text-xs text-neutral-500 block">Contact Us</span>
                <a className="hover:text-jabee-orange transition-colors font-medium" href="mailto:support@jabee.in">
                  support@jabee.in
                </a>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-4 pt-2">
                <a
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 hover:border-jabee-orange hover:text-jabee-orange text-neutral-400 flex items-center justify-center transition-colors"
                  href="#"
                  title="Instagram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 hover:border-jabee-orange hover:text-jabee-orange text-neutral-400 flex items-center justify-center transition-colors"
                  href="#"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 hover:border-jabee-orange hover:text-jabee-orange text-neutral-400 flex items-center justify-center transition-colors"
                  href="#"
                  title="X"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
            <div>© 2026 JABEE, Burdwan, West Bengal. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <a className="hover:text-neutral-400 transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="hover:text-neutral-400 transition-colors" href="#">
                Terms of Service
              </a>
              <a className="hover:text-neutral-400 transition-colors" href="#">
                Captain Code of Conduct
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
