import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Mic,
  MapPin,
  Send,
  ChevronDown,
  CheckCircle2,
  X,
} from 'lucide-react';
import SparkleIcon from '../components/SparkleIcon';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

const categories = [
  'Water Supply',
  'Infrastructure',
  'Sanitation',
  'Roads',
  'Traffic',
  'Environment',
  'Welfare',
  'Other',
];

export default function CitizenSubmit() {
  const { citizenToken } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [mpConstituency, setMpConstituency] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    setLocationStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus('done');
      },
      () => setLocationStatus('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhotoFile(file);
  };

  useEffect(() => {
    fetch(`${API_BASE}/mp/info`)
      .then((res) => res.json())
      .then((data) => setMpConstituency(data.constituency || ''))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!photoFile) {
      setSubmitError(t('submit_error_photo'));
      return;
    }
    if (!location) {
      setSubmitError(t('submit_error_location'));
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', photoFile);
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      if (category) formData.append('category', category);
      if (description) formData.append('description', description);
      formData.append('language', language);
      if (mpConstituency) formData.append('constituency', mpConstituency);

      const res = await fetch(`${API_BASE}/ingestion/app-upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${citizenToken}` },
        body: formData,
      });

      if (!res.ok) throw new Error(t('submit_error_generic'));

      setSubmitSuccess(true);
      setTimeout(() => navigate('/'), 1800);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle2 className="w-14 h-14 text-[#22C55E] mb-4" />
        <h2 className="text-lg font-bold text-[#0F172A]">{t('submit_success_title')}</h2>
        <p className="text-sm text-[#64748B] mt-1">
          {t('submit_success_subtitle')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">{t('submit_title')}</h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          {t('submit_subtitle')}
        </p>
      </div>

      {submitError && (
        <div className="flex items-start justify-between gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <span>{submitError}</span>
          <button onClick={() => setSubmitError('')}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-[#475569] mb-1.5 block tracking-wide">
            {t('submit_category_label')}
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white rounded-2xl border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A] appearance-none cursor-pointer"
            >
              <option value="">{t('submit_category_auto')}</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#475569] mb-1.5 block tracking-wide">
            {t('submit_description_label')}
            <span className="ml-1.5 inline-flex items-center gap-0.5 text-[#14B8A6]">
              <SparkleIcon className="w-3 h-3 inline" /> {t('submit_ai_enhanced')}
            </span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('submit_description_placeholder')}
            rows={4}
            className="w-full px-4 py-3 text-sm bg-white rounded-2xl border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#14B8A6]/30 text-[#0F172A] placeholder:text-[#CBD5E1] resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#475569] mb-1.5 block tracking-wide">
            {t('submit_location_label')} <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={handleDetectLocation}
            className={`w-full flex items-center gap-2 px-4 py-3 text-sm bg-white rounded-2xl border transition-colors ${
              locationStatus === 'done'
                ? 'border-[#22C55E] text-[#16A34A]'
                : locationStatus === 'error'
                ? 'border-red-300 text-red-500'
                : 'border-[#E2E8F0] text-[#94A3B8] hover:border-[#2563EB]'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#2563EB]" />
            <span>
              {locationStatus === 'detecting' && t('submit_location_detecting')}
              {locationStatus === 'done' &&
                `${t('submit_location_detected')} (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})`}
              {locationStatus === 'error' && t('submit_location_error')}
              {locationStatus === 'idle' && t('submit_location_idle')}
            </span>
          </button>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#475569] mb-1.5 block tracking-wide">
            {t('submit_photo_label')} <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm bg-white rounded-2xl border border-dashed transition-colors ${
                photoFile
                  ? 'border-[#22C55E] text-[#16A34A]'
                  : 'border-[#CBD5E1] text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB]'
              }`}
            >
              <Camera className="w-4 h-4" />
              {photoFile ? photoFile.name.slice(0, 20) : t('submit_photo_button')}
            </button>
            <button
              type="button"
              disabled
              title="Voice notes are coming soon"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm bg-[#F8FAFC] rounded-2xl border border-dashed border-[#E2E8F0] text-[#CBD5E1] cursor-not-allowed"
            >
              <Mic className="w-4 h-4" />
              {t('submit_voice_soon')}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white text-sm font-semibold px-4 py-3.5 rounded-2xl hover:bg-[#1D4ED8] transition-colors shadow-lg shadow-[#2563EB]/20 active:scale-[0.98] disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {submitting ? t('submit_submitting') : t('submit_button')}
        </button>
      </form>
    </div>
  );
}