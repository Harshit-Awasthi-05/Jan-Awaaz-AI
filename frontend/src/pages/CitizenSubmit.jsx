import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  MapPin,
  Send,
  ChevronDown,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import SparkleIcon from '../components/SparkleIcon';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import imageCompression from 'browser-image-compression';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet marker icon in React/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

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

function LocationMarker({ position, setPosition, resolveConstituency }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      resolveConstituency(e.latlng.lat, e.latlng.lng);
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, Math.max(map.getZoom(), 14));
      resolveConstituency(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return position === null ? null : (
    <Marker 
      position={position}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition(pos);
          resolveConstituency(pos.lat, pos.lng);
        },
      }}
    />
  );
}

export default function CitizenSubmit() {
  const { citizenToken } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [compressing, setCompressing] = useState(false);

  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const [position, setPosition] = useState(null);
  const [mpConstituency, setMpConstituency] = useState('');
  const [resolvedMp, setResolvedMp] = useState(null);
  const [resolvingConstituency, setResolvingConstituency] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const resolveConstituencyFromLocation = async (latitude, longitude) => {
    setResolvingConstituency(true);
    try {
      const res = await fetch(`${API_BASE}/location/resolve-constituency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude }),
      });
      const data = await res.json();
      if (res.ok && data.resolved) {
        setMpConstituency(data.constituency);
        setResolvedMp({ mpName: data.mp_name, confidence: data.confidence });
      } else {
        setResolvedMp(null);
      }
    } catch {
      setResolvedMp(null);
    } finally {
      setResolvingConstituency(false);
    }
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      setPhotoFile(compressedFile);
      setPhotoPreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error(error);
      setSubmitError("Failed to compress image.");
    } finally {
      setCompressing(false);
    }
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
    if (!position) {
      setSubmitError(t('submit_error_location'));
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', photoFile);
      formData.append('latitude', position.lat);
      formData.append('longitude', position.lng);
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

  const renderStepIndicator = () => (
    <div className="flex items-center gap-2 mb-6">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex-1 flex flex-col gap-1.5">
          <div className={`h-1.5 rounded-full ${s <= step ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'}`} />
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${s === step ? 'text-[#2563EB]' : 'text-[#94A3B8]'}`}>
            {s === 1 ? 'Capture' : s === 2 ? 'Categorize' : 'Locate'}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">{t('submit_title')}</h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          {t('submit_subtitle')}
        </p>
      </div>

      {renderStepIndicator()}

      {submitError && (
        <div className="flex items-start justify-between gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <span>{submitError}</span>
          <button onClick={() => setSubmitError('')}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {step === 1 && (
          <div className="space-y-4">
            <label className="text-xs font-semibold text-[#475569] block tracking-wide">
              {t('submit_photo_label')} <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            
            {photoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0]">
                <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={compressing}
                className="w-full h-48 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border-2 border-dashed border-[#CBD5E1] text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
              >
                <Camera className="w-8 h-8" />
                <span className="text-sm font-medium">
                  {compressing ? "Compressing image..." : t('submit_photo_button')}
                </span>
              </button>
            )}

            <button
              type="button"
              disabled={!photoFile}
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white text-sm font-semibold px-4 py-3.5 rounded-2xl hover:bg-[#1D4ED8] transition-colors shadow-lg shadow-[#2563EB]/20 disabled:opacity-50"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
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

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-14 flex items-center justify-center bg-white border border-[#E2E8F0] text-[#64748B] rounded-2xl hover:bg-[#F8FAFC]"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2563EB] text-white text-sm font-semibold px-4 py-3.5 rounded-2xl hover:bg-[#1D4ED8] transition-colors shadow-lg shadow-[#2563EB]/20"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <label className="text-xs font-semibold text-[#475569] block tracking-wide">
              {t('submit_location_label')} <span className="text-red-500">*</span>
            </label>
            
            <div className="h-64 rounded-2xl overflow-hidden border border-[#E2E8F0] relative z-0">
              <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <LocationMarker 
                  position={position} 
                  setPosition={setPosition} 
                  resolveConstituency={resolveConstituencyFromLocation}
                />
              </MapContainer>
            </div>
            
            {position && (
              <p className="text-[11px] text-[#94A3B8] text-center bg-[#F8FAFC] rounded-xl p-2 border border-[#E2E8F0]">
                {resolvingConstituency && 'Detecting your constituency…'}
                {!resolvingConstituency && resolvedMp && (
                  <>Constituency: <span className="text-[#475569] font-medium">{mpConstituency}</span> · MP: {resolvedMp.mpName}</>
                )}
                {!resolvingConstituency && !resolvedMp && mpConstituency && (
                  <>Constituency: <span className="text-[#475569] font-medium">{mpConstituency}</span></>
                )}
                {!resolvingConstituency && !resolvedMp && !mpConstituency && (
                  <>Could not auto-detect your constituency — it will be added manually.</>
                )}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-14 flex items-center justify-center bg-white border border-[#E2E8F0] text-[#64748B] rounded-2xl hover:bg-[#F8FAFC]"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={submitting || !position}
                className="flex-1 flex items-center justify-center gap-2 bg-[#16A34A] text-white text-sm font-semibold px-4 py-3.5 rounded-2xl hover:bg-[#15803D] transition-colors shadow-lg shadow-[#16A34A]/20 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? t('submit_submitting') : t('submit_button')}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}