'use client';

import React, { useEffect, useState } from 'react';
import { Beach, Report } from '@/lib/types';
import { getBeaches, getReports, deleteReport, getCurrentUser, setCurrentUser, logoutUser } from '@/lib/supabase';
import { SargazoLevelBadge } from '@/components/ui/SargazoLevelBadge';
import { formatTimeAgo } from '@/lib/algorithms';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  Camera,
  LogOut,
  LogIn,
  UserPlus,
  Trash2,
  ExternalLink,
  Lock,
  Mail,
  User,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

export default function ProfilePage() {
  const [currentUser, setAuthUser] = useState<{ email?: string; name: string; isGuest?: boolean; trustScore?: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'reports' | 'verifications' | 'badges'>('reports');
  const [reports, setReports] = useState<Report[]>([]);
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth Form state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true);
        const user = getCurrentUser();
        if (user) {
          setAuthUser(user);
        }

        const [fetchedBeaches, fetchedReports] = await Promise.all([
          getBeaches(),
          getReports()
        ]);
        setBeaches(fetchedBeaches);
        setReports(fetchedReports);
      } catch (e) {
        console.error('Error cargando perfil', e);
      } finally {
        setLoading(false);
      }
    }
    loadProfileData();
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const userName = name || email.split('@')[0];
    const user = { email, name: userName, isGuest: false };
    setCurrentUser(user);
    setAuthUser({ ...user, trustScore: 15 });
  };

  const handleGuestLogin = () => {
    const guestUser = { name: 'Ciudadano Colaborador', isGuest: true };
    setCurrentUser(guestUser);
    setAuthUser({ ...guestUser, trustScore: 5 });
  };

  const handleLogout = () => {
    logoutUser();
    setAuthUser(null);
  };

  const handleDeleteUserReport = async (reportId: string) => {
    if (confirm('¿Estás seguro de eliminar este reporte de sargazo?')) {
      await deleteReport(reportId);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    }
  };

  // Filter user reports (if logged in, show user reports; else show demo user reports)
  const myReports = reports.filter((r) =>
    currentUser?.name ? r.user_name.toLowerCase().includes(currentUser.name.toLowerCase()) || r.user_name === 'Ciudadano Colaborador' : true
  );

  const badgesList = [
    { id: '1', name: 'Guardia Costero', icon: '🌊', desc: 'Primeros reportes publicados en el Caribe', unlocked: myReports.length >= 1, progress: `${Math.min(100, (myReports.length / 3) * 100)}%` },
    { id: '2', name: 'Ojo de Águila', icon: '📸', desc: 'Verificaciones comunitarias precisas', unlocked: true, progress: '100%' },
    { id: '3', name: 'Pionero de Tulum', icon: '🌴', desc: 'Contribuciones continuas en Riviera Maya', unlocked: myReports.length >= 2, progress: `${Math.min(100, (myReports.length / 2) * 100)}%` },
    { id: '4', name: 'Verificador Maestro', icon: '🛡️', desc: 'Más de 10 votos de precisión positivos', unlocked: false, progress: '40%' }
  ];

  // Render Login / Register Screen if not logged in
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-8 px-4 flex flex-col gap-6">
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Tu Perfil en Sargazo Watch
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Inicia sesión o regístrate para acumular puntos de reputación, guardar tu historial de reportes y desbloquear insignias.
          </p>
        </div>

        {/* Login / Register Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-5">
          {/* Auth Mode Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Crear Cuenta</span>
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            {authMode === 'register' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nombre completo</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Maria Gonzalez"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Correo electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 py-3 px-4 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-cyan-600/20 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{authMode === 'login' ? 'Ingresar a mi Cuenta' : 'Registrarme Gratis'}</span>
            </button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase">o bien</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <button
            type="button"
            onClick={handleGuestLogin}
            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>Continuar como Invitado Colaborador</span>
          </button>
        </div>
      </div>
    );
  }

  // Authenticated User Profile View
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      {/* Profile Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 shrink-0">
            {currentUser.name.substring(0, 2).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {currentUser.name}
              </h1>
              {currentUser.isGuest && (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                  Invitado
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentUser.email || 'Contribuidor ciudadano del Caribe Mexicano'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            {currentUser.trustScore || 15} pts Karma
          </span>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-600 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Statistics Counters (Clicking switches tab!) */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setActiveTab('reports')}
          className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all ${
            activeTab === 'reports'
              ? 'bg-cyan-500/10 border-cyan-500 text-cyan-900 dark:text-cyan-100 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Camera className="w-5 h-5 text-cyan-500" />
          <span className="text-xl font-extrabold">{myReports.length}</span>
          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
            Reportes Subidos
          </span>
        </button>

        <button
          onClick={() => setActiveTab('verifications')}
          className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all ${
            activeTab === 'verifications'
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-100 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span className="text-xl font-extrabold">12</span>
          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
            Verificaciones
          </span>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all ${
            activeTab === 'badges'
              ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-100 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Award className="w-5 h-5 text-amber-500" />
          <span className="text-xl font-extrabold">{badgesList.filter((b) => b.unlocked).length}</span>
          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
            Insignias
          </span>
        </button>
      </div>

      {/* Tab Content Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
        {/* TAB 1: MIS REPORTES SUBIDOS */}
        {activeTab === 'reports' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-cyan-500" />
                <span>Mis Reportes Fotográficos Subidos ({myReports.length})</span>
              </h3>
              <Link
                href="/upload"
                className="py-1.5 px-3 bg-cyan-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Nuevo Reporte</span>
              </Link>
            </div>

            {myReports.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex flex-col items-center gap-2">
                <HelpCircle className="w-8 h-8 text-slate-400" />
                <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                  Aún no has subido tu primer reporte de sargazo.
                </p>
                <Link
                  href="/upload"
                  className="mt-2 py-2 px-4 bg-cyan-600 text-white rounded-xl text-xs font-bold"
                >
                  Subir mi Primera Foto
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myReports.map((report) => {
                  const beach = beaches.find((b) => b.id === report.beach_id);

                  return (
                    <div
                      key={report.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col gap-3 justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                            {beach?.name || 'Playa del Caribe'}
                          </span>
                          <SargazoLevelBadge level={report.sargazo_level} size="sm" />
                        </div>

                        {report.photo_url && (
                          <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-800 mb-2">
                            <img
                              src={report.photo_url}
                              alt="Foto del reporte"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-500" />
                          {formatTimeAgo(report.created_at)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                        <Link
                          href={`/beach/${report.beach_id}`}
                          className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-0.5 hover:underline"
                        >
                          <span>Ver en mapa</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>

                        <button
                          onClick={() => handleDeleteUserReport(report.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                          title="Eliminar reporte"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MIS VERIFICACIONES */}
        {activeTab === 'verifications' && (
          <div className="flex flex-col gap-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Historial de Verificaciones Comunitarias</span>
            </h3>

            <div className="flex flex-col gap-2">
              {[
                { beach: 'Playa Delfines', vote: 'Preciso ✅', time: 'Hace 1 hora', points: '+1 Karma' },
                { beach: 'Playa Norte (Isla Mujeres)', vote: 'Preciso ✅', time: 'Hace 3 horas', points: '+1 Karma' },
                { beach: 'Playa Mamitas', vote: 'Preciso ✅', time: 'Ayer', points: '+1 Karma' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{item.beach}</span>
                      <span className="text-[10px] text-slate-500 block">{item.time}</span>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                    {item.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INSIGNIAS Y LOGROS */}
        {activeTab === 'badges' && (
          <div className="flex flex-col gap-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Insignias de Logros Desbloqueadas</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badgesList.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                    badge.unlocked
                      ? 'bg-amber-500/10 border-amber-500/40 text-slate-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <span className="text-3xl shrink-0">{badge.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs">{badge.name}</h4>
                      {badge.unlocked ? (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                          Desbloqueado
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">En progreso</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{badge.desc}</p>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: badge.progress }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
