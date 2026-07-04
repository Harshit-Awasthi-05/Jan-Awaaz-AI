import { useState } from 'react';
import {
  Camera,
  Mic,
  MapPin,
  Send,
  ChevronDown,
} from 'lucide-react';
import SparkleIcon from '../components/SparkleIcon';

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
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">Submit Grievance</h1>
        <p className="text-xs text-[#64748B] mt-0.5">Describe your issue and we'll route it to the right department.</p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Subject */}
        <div>
          <label className="text-xs font-semibold text-[#475569] mb-1.5 block tracking-wide">Subject</label>
          <input
            type="text"
            placeholder="Brief description of the issue"
            className="w-full px-4 py-3 text-sm bg-white rounded-2xl border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A] placeholder:text-[#CBD5E1]"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-semibold text-[#475569] mb-1.5 block tracking-wide">Category</label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white rounded-2xl border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A] appearance-none cursor-pointer"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
          </div>
        </div>

        {/* Description – AI-enhanced */}
        <div>
          <label className="text-xs font-semibold text-[#475569] mb-1.5 block tracking-wide">
            Description
            <span className="ml-1.5 inline-flex items-center gap-0.5 text-[#14B8A6]">
              <SparkleIcon className="w-3 h-3 inline" /> AI-Enhanced
            </span>
          </label>
          <div className="relative ai-border-rounded rounded-2xl">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your issue in detail. Our AI will help structure it..."
              rows={5}
              className="w-full px-4 py-3 text-sm bg-white rounded-2xl border border-transparent outline-none focus:ring-2 focus:ring-[#14B8A6]/30 text-[#0F172A] placeholder:text-[#CBD5E1] resize-none"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-xs font-semibold text-[#475569] mb-1.5 block tracking-wide">Location</label>
          <button className="w-full flex items-center gap-2 px-4 py-3 text-sm bg-white rounded-2xl border border-[#E2E8F0] text-[#94A3B8] hover:border-[#2563EB] transition-colors">
            <MapPin className="w-4 h-4 text-[#2563EB]" />
            <span>Tap to detect your location</span>
          </button>
        </div>

        {/* Attachments */}
        <div>
          <label className="text-xs font-semibold text-[#475569] mb-1.5 block tracking-wide">Attachments</label>
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm bg-white rounded-2xl border border-dashed border-[#CBD5E1] text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
              <Camera className="w-4 h-4" />
              Photo
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm bg-white rounded-2xl border border-dashed border-[#CBD5E1] text-[#64748B] hover:border-[#14B8A6] hover:text-[#14B8A6] transition-colors">
              <Mic className="w-4 h-4" />
              Voice Note
            </button>
          </div>
        </div>

        {/* Submit */}
        <button className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white text-sm font-semibold px-4 py-3.5 rounded-2xl hover:bg-[#1D4ED8] transition-colors shadow-lg shadow-[#2563EB]/20 active:scale-[0.98]">
          <Send className="w-4 h-4" />
          Submit Grievance
        </button>
      </div>
    </div>
  );
}
