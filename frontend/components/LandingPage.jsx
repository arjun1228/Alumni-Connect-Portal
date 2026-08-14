import React, { useState, useEffect } from 'react';
import { School, Moon, Sun, MessageSquare, Briefcase, Calendar, Sparkles, ArrowRight, GraduationCap, Users } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { Logo } from './Logo';
import { fetchPublicStats } from '../services/api';

export const LandingPage = ({ onGetStarted, theme, toggleTheme }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [stats, setStats] = useState({
    studentsCount: 0,
    alumniCount: 0,
    jobsCount: 0,
    eventsCount: 0
  });

  // Fetch live stats from database
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchPublicStats();
        setStats({
          studentsCount: data.studentsCount || 0,
          alumniCount: data.alumniCount || 0,
          jobsCount: data.jobsCount || 0,
          eventsCount: data.eventsCount || 0
        });
      } catch (err) {
        console.error('Failed to load public stats from database:', err);
      }
    };
    loadStats();
  }, []);

  // Auto-run slide animation (video format preview)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 theme-transition flex flex-col">
      {/* Sticky Premium Navbar */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-900 theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo className="w-9 h-9" />
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">AlumniConnect</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer text-slate-600 dark:text-slate-350"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-500 animate-in spin-in-12" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600 animate-in spin-in-12" />
              )}
            </button>

            <button
              onClick={onGetStarted}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 btn-primary-premium text-white text-sm font-semibold rounded-xl cursor-pointer shadow-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-24">
          {/* Glowing blur effects for background */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center text-left">
              {/* Left Column - Copy & Actions */}
              <div className="lg:col-span-5 space-y-6">
                <ScrollReveal animationClass="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 glass-badge text-indigo-705 dark:text-indigo-400 rounded-full text-xs font-semibold uppercase tracking-wider">
                    <GraduationCap className="w-3.5 h-3.5" /> University Network
                  </span>
                </ScrollReveal>

                <ScrollReveal animationClass="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                  <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                    Bridge the Gap Between <br />
                    <span className="bg-linear-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent hero-gradient-hover cursor-pointer">Campus and Career</span>
                  </h1>
                </ScrollReveal>

                <ScrollReveal animationClass="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    Connect students with alumni mentors, discover exclusive job openings, register for networking events, and power up your professional journey with our AI Career Mentor.
                  </p>
                </ScrollReveal>

                <ScrollReveal animationClass="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <button
                      onClick={onGetStarted}
                      className="w-full sm:w-auto px-8 py-4 btn-primary-premium text-white font-bold rounded-2xl cursor-pointer flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Get Started Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={scrollToFeatures}
                      className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold rounded-2xl border border-slate-200 dark:border-slate-800 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Explore Features
                    </button>
                  </div>
                </ScrollReveal>
              </div>

              {/* Right Column - Premium Interactive Showcase Video Format Mockup */}
              <div className="lg:col-span-7">
                <ScrollReveal animationClass="animate-in fade-in zoom-in duration-1000 delay-200">
                  <div className="relative group rounded-3xl p-2 bg-linear-to-tr from-slate-200/50 to-white/50 dark:from-slate-900/50 dark:to-slate-800/50 border border-slate-200/60 dark:border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
                    {/* Glowing highlight ring */}
                    <div className="absolute -inset-px bg-linear-to-r from-indigo-500 to-emerald-500 rounded-3xl opacity-20 group-hover:opacity-30 transition duration-500 blur-xs"></div>
                    
                    {/* Browser Chrome Header Mockup */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-800/50 rounded-t-2xl">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-400"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                        <span className="w-3 h-3 rounded-full bg-green-400"></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Live System Demo</span>
                      </div>
                      <div className="w-6 h-3.5"></div>
                    </div>

                    {/* Screenshot Frame - Aspect 16:9 with Slides */}
                    <div className="relative overflow-hidden rounded-b-2xl aspect-video bg-slate-950 flex flex-col justify-between p-6">
                      
                      {/* Interactive slide renderer */}
                      {activeSlide === 0 && (
                        <div className="flex-1 flex flex-col justify-between text-left select-none animate-in fade-in duration-300">
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded text-[10px] font-bold uppercase">Student view</span>
                              <span className="text-[11px] text-slate-400 font-semibold">Applying for Jobs</span>
                            </div>
                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold text-sm text-slate-100">Frontend Developer</h3>
                                  <p className="text-[11px] text-slate-400">Stripe • Remote • Full-time</p>
                                </div>
                                <span className="text-[10px] text-indigo-400 font-bold bg-indigo-950/40 border border-indigo-900/50 px-2 py-0.5 rounded">Referral Active</span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">Looking for a React developer to join our core growth team. Referral available from alumni Sarah.</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-2">
                            <div className="text-[10px] text-slate-500">1. Click "Apply Now" with profile</div>
                            <div className="relative">
                              {/* Simulated Cursor */}
                              <div className="absolute -top-1 -left-2 w-4 h-4 text-sm pointer-events-none animate-bounce z-20">🖱️</div>
                              <button className="px-4 py-2 bg-indigo-650 text-white text-xs font-bold rounded-lg border border-indigo-500/50 hover:bg-indigo-700 transition-colors">
                                Apply Now 🚀
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeSlide === 1 && (
                        <div className="flex-1 flex flex-col justify-between text-left select-none animate-in fade-in duration-300">
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded text-[10px] font-bold uppercase">Student view</span>
                              <span className="text-[11px] text-slate-400 font-semibold">Register for Events</span>
                            </div>
                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold text-sm text-slate-100">Alumni Career Panel & Mixer</h3>
                                  <p className="text-[11px] text-slate-455">Tomorrow • 6:00 PM • Campus Center</p>
                                </div>
                                <span className="text-[10px] text-indigo-400 font-bold bg-indigo-950/40 border border-indigo-900/50 px-2 py-0.5 rounded">Mixer</span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">Meet verified graduates working at top companies. Ask questions and build professional relations.</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-2">
                            <div className="text-[10px] text-slate-500">2. Confirm registration details</div>
                            <div className="relative">
                              <div className="absolute -top-1 -left-2 w-4 h-4 text-sm pointer-events-none animate-bounce z-20">🖱️</div>
                              <button className="px-4 py-2 bg-emerald-650 text-white text-xs font-bold rounded-lg border border-emerald-500/50 hover:bg-emerald-700 transition-colors">
                                RSVP Registered ✅
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeSlide === 2 && (
                        <div className="flex-1 flex flex-col justify-between text-left select-none animate-in fade-in duration-300">
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded text-[10px] font-bold uppercase">Student view</span>
                              <span className="text-[11px] text-slate-400 font-semibold">Message Verified Alumni</span>
                            </div>
                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 h-30 overflow-y-auto scrollbar-hide">
                              <div className="text-xs text-slate-400 bg-slate-950/40 p-2 rounded-lg mb-2">
                                <span className="font-bold text-indigo-400">Student:</span> "Hi Sarah! I saw your PM post. I'd love to learn about your journey."
                              </div>
                              <div className="text-xs text-slate-400 bg-slate-950/40 p-2 rounded-lg animate-pulse">
                                <span className="font-bold text-emerald-400">Sarah PM (Alumni):</span> "Hi there! Happy to help. Let's schedule a chat."
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-2">
                            <div className="text-[10px] text-slate-505">3. Live Chat with Mentor</div>
                            <button className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg border border-slate-700 hover:bg-slate-700">
                              Send Message ✉️
                            </button>
                          </div>
                        </div>
                      )}

                      {activeSlide === 3 && (
                        <div className="flex-1 flex flex-col justify-between text-left select-none animate-in fade-in duration-300">
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold uppercase">Alumni view</span>
                              <span className="text-[11px] text-slate-400 font-semibold">Post Opportunities & Events</span>
                            </div>
                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <label className="text-slate-500 text-[10px]">Position Title</label>
                                  <div className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-300">UX Architect</div>
                                </div>
                                <div>
                                  <label className="text-slate-500 text-[10px]">Company Name</label>
                                  <div className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-300">Stripe</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-2">
                            <div className="text-[10px] text-slate-505">4. Alumni creating job listings</div>
                            <div className="relative">
                              <div className="absolute -top-1 -left-2 w-4 h-4 text-sm pointer-events-none animate-bounce z-20">🖱️</div>
                              <button className="px-4 py-2 bg-indigo-650 text-white text-xs font-bold rounded-lg border border-indigo-500/50 hover:bg-indigo-700">
                                Publish Listing 🚀
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Slide Indicator Bar */}
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-900">
                        <div className="flex gap-2">
                          {[0, 1, 2, 3].map((idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveSlide(idx)}
                              className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer ${activeSlide === idx ? 'bg-indigo-500' : 'bg-slate-800 hover:bg-slate-700'}`}
                              aria-label={`Showcase slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-500">Auto-cycling preview</span>
                      </div>

                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>


        {/* Feature Highlights Grid */}
        <section id="features-section" className="py-20 bg-white dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-900 theme-transition relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <ScrollReveal>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Designed for Modern Student & Alumni Interaction
                </h2>
              </ScrollReveal>
              <ScrollReveal animationClass="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
                <p className="mt-4 text-slate-500 dark:text-slate-400">
                  Four powerful modules integrated into a single cohesive campus platform.
                </p>
              </ScrollReveal>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <ScrollReveal className="h-full" style={{ animationDelay: '100ms' }}>
                <div className="group h-full glass-card p-6 rounded-2xl">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 relative inline-block pb-1">
                    Community Feed
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                    Share milestones, seek advice, and engage in campus discussions with structured, categorized posts.
                  </p>
                </div>
              </ScrollReveal>

              {/* Feature 2 */}
              <ScrollReveal className="h-full" style={{ animationDelay: '200ms' }}>
                <div className="group h-full glass-card p-6 rounded-2xl">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 relative inline-block pb-1">
                    Jobs & Internships
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                    Access targeted job openings posted directly by university alumni. Apply instantly to start your career.
                  </p>
                </div>
              </ScrollReveal>

              {/* Feature 3 */}
              <ScrollReveal className="h-full" style={{ animationDelay: '300ms' }}>
                <div className="group h-full glass-card p-6 rounded-2xl">
                  <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 relative inline-block pb-1">
                    Events & Workshops
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 dark:bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                    RSVP to panels, webinars, and mixer events. Keep up with campus happenings in real time.
                  </p>
                </div>
              </ScrollReveal>

              {/* Feature 4 */}
              <ScrollReveal className="h-full" style={{ animationDelay: '400ms' }}>
                <div className="group h-full glass-card p-6 rounded-2xl">
                  <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 relative inline-block pb-1">
                    AI Career Mentor
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 dark:bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                    Get custom advice on your resume, practice for standard interview sessions, and analyze skill discrepancies.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Social Proof/Stats Section */}
        <section className="py-16 bg-slate-100 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-900 theme-transition">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: stats.studentsCount > 0 ? `${stats.studentsCount}` : "500+", label: "Active Students", desc: "Building careers" },
                { number: stats.alumniCount > 0 ? `${stats.alumniCount}` : "200+", label: "Alumni Mentors", desc: "Providing guidance" },
                { number: stats.jobsCount > 0 ? `${stats.jobsCount}` : "150+", label: "Jobs Posted", desc: "Exclusive opportunities" },
                { number: stats.eventsCount > 0 ? `${stats.eventsCount}` : "50+", label: "Events Hosted", desc: "Networking & growth" },
              ].map((stat, i) => (
                <ScrollReveal key={i} style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="p-6 rounded-2xl glass-card relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-r from-indigo-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <p className="text-4xl sm:text-5xl font-black bg-linear-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">{stat.number}</p>
                    <p className="text-slate-905 dark:text-white font-bold mt-2 text-sm sm:text-base">{stat.label}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{stat.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Project Information Section */}
        <section className="py-20 bg-slate-50 dark:bg-slate-950 theme-transition">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <ScrollReveal>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  About AlumniConnect
                </h2>
              </ScrollReveal>
              <ScrollReveal animationClass="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
                <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                  A premium portal designed specifically for students, alumni, and administrators to ensure secure and highly relevant professional interactions.
                </p>
              </ScrollReveal>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* About Card 1 */}
              <ScrollReveal style={{ animationDelay: '0ms' }}>
                <div className="p-8 pt-10 accent-card accent-card-indigo group">
                  <span className="accent-card-number text-indigo-900 dark:text-indigo-200">01</span>
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/30 accent-icon">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1-on-1 Mentorship</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Connect directly with verified alumni currently working at top tech firms. Get advice on career progression, tech stacks, and request internal job referrals.
                  </p>
                  <button onClick={onGetStarted} className="mt-5 flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:underline cursor-pointer group/cta">
                    <span>Start connecting</span>
                    <span className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
                  </button>
                </div>
              </ScrollReveal>

              {/* About Card 2 */}
              <ScrollReveal style={{ animationDelay: '120ms' }}>
                <div className="p-8 pt-10 accent-card accent-card-emerald group">
                  <span className="accent-card-number text-emerald-900 dark:text-emerald-200">02</span>
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/30 accent-icon">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Exclusive Job Portal</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Access handpicked jobs and internships posted directly by alumni hiring for their respective teams. Apply online and request immediate referral opportunities.
                  </p>
                  <button onClick={onGetStarted} className="mt-5 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:underline cursor-pointer group/cta">
                    <span>Browse opportunities</span>
                    <span className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
                  </button>
                </div>
              </ScrollReveal>

              {/* About Card 3 */}
              <ScrollReveal style={{ animationDelay: '240ms' }}>
                <div className="p-8 pt-10 accent-card accent-card-purple group">
                  <span className="accent-card-number text-purple-900 dark:text-purple-200">03</span>
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-500/30 accent-icon">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Resume & Mock Review</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Leverage our AI Career Mentor to scan your resume, evaluate industry skill discrepancies, practice target role-specific mock interviews, and structure your growth roadmap.
                  </p>
                  <button onClick={onGetStarted} className="mt-5 flex items-center gap-1.5 text-purple-600 dark:text-purple-400 text-xs font-semibold hover:underline cursor-pointer group/cta">
                    <span>Try AI Mentor</span>
                    <span className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
                  </button>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-900 bg-white dark:bg-slate-950 py-8 theme-transition mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-405 text-sm">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6" />
            <span className="font-bold text-slate-800 dark:text-white">AlumniConnect</span>
          </div>
          <p>© {new Date().getFullYear()} AlumniConnect Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
;
