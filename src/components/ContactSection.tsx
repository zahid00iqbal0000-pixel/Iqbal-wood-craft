import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PhoneCall, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  User, 
  Building2,
  Globe,
  Share2
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { contactInfo, showToast } = useApp();

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || !formMessage) {
      showToast('Please complete all required fields.');
      return;
    }
    setIsSubmitted(true);
    showToast('Inquiry sent! Iqbal Woodcraft team will contact you shortly.');
  };

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto text-white">
      {/* Title */}
      <div className="text-center space-y-2 mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
          DHA Phase 6 Karachi Showroom
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-black text-amber-100">
          Contact IQBAL WOODCRAFT
        </h1>
        <p className="text-xs md:text-sm text-stone-300 max-w-xl mx-auto">
          Visit our flagship luxury furniture showroom or connect directly with our CEO and sales team via call, WhatsApp, or email.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Leadership Contacts & Address */}
        <div className="lg:col-span-5 space-y-6">
          {/* Official Contacts Box */}
          <div className="bg-stone-900 border border-[#d4af37]/60 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-amber-200 border-b border-stone-800 pb-2">
              Official Management Contacts
            </h3>

            <div className="space-y-3 text-xs">
              {/* CEO */}
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase">Chief Executive Officer</span>
                  <h4 className="font-serif font-bold text-amber-100 text-sm">{contactInfo.ceo}</h4>
                  <p className="text-stone-400 font-mono">{contactInfo.ceoPhone}</p>
                </div>
                <a
                  href={`tel:${contactInfo.ceoPhone}`}
                  className="p-2 bg-amber-800 hover:bg-amber-700 text-white rounded-lg"
                  title="Call CEO"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>
              </div>

              {/* Business Manager */}
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase">Business Manager</span>
                  <h4 className="font-serif font-bold text-amber-100 text-sm">{contactInfo.businessManager}</h4>
                  <p className="text-stone-400 font-mono">{contactInfo.bmPhone}</p>
                </div>
                <a
                  href={`tel:${contactInfo.bmPhone}`}
                  className="p-2 bg-amber-800 hover:bg-amber-700 text-white rounded-lg"
                  title="Call Business Manager"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>
              </div>

              {/* Sales & App Management */}
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase">Sales & App Management</span>
                  <h4 className="font-serif font-bold text-amber-100 text-sm">{contactInfo.salesAndApp}</h4>
                  <p className="text-stone-400 font-mono">{contactInfo.salesPhone}</p>
                </div>
                <a
                  href={`tel:${contactInfo.salesPhone}`}
                  className="p-2 bg-amber-800 hover:bg-amber-700 text-white rounded-lg"
                  title="Call Sales Manager"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>
              </div>

              {/* WhatsApp Business */}
              <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Official WhatsApp Business</span>
                  <p className="font-mono font-bold text-white text-sm">{contactInfo.whatsappBusiness}</p>
                </div>
                <a
                  href={`https://wa.me/92${contactInfo.whatsappBusiness.replace(/[^0-9]/g, '').slice(1)}?text=Assalam-o-Alaikum%20IQBAL%20WOODCRAFT`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg"
                  title="WhatsApp Business"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Location & Hours */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 block mb-0.5">Showroom Address:</strong>
                <p className="text-stone-300 leading-relaxed">{contactInfo.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-stone-800">
              <Clock className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 block mb-0.5">Business Hours:</strong>
                <p className="text-stone-300">{contactInfo.businessHours}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-stone-800">
              <Mail className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 block mb-0.5">Official Email:</strong>
                <a href={`mailto:${contactInfo.email}`} className="text-amber-400 font-mono hover:underline">
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex items-center justify-between text-xs">
            <span className="font-bold text-amber-200">Connect On Social Media:</span>
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com/iqbalwoodcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-blue-900/60 hover:bg-blue-800 text-blue-200 rounded-lg font-bold"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com/iqbalwoodcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-pink-900/60 hover:bg-pink-800 text-pink-200 rounded-lg font-bold"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Google Maps Embed & Interactive Inquiry Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Map */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden h-64 relative shadow-lg">
            <iframe
              title="IQBAL WOODCRAFT Location"
              src={contactInfo.googleMapsEmbedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
            />
          </div>

          {/* Inquiry Form */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-amber-200 border-b border-stone-800 pb-2">
              Send Showroom Message or Inquiry
            </h3>

            {isSubmitted ? (
              <div className="p-6 bg-stone-950 border border-[#d4af37] rounded-xl text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-[#d4af37] mx-auto" />
                <h4 className="font-serif font-bold text-amber-100 text-lg">Inquiry Submitted!</h4>
                <p className="text-xs text-stone-300">
                  Thank you, <strong className="text-amber-200">{formName}</strong>. Muhammad Zahid Iqbal or Shahid Iqbal will reply within 2 business hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 bg-stone-800 text-amber-300 text-xs font-bold rounded-lg"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Mian Bilal"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100 outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="0302-XXXXXXX"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      required
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100 outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100 outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 mb-1">Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. Custom Dining Set Inquiry"
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100 outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Message Detail *</label>
                  <textarea
                    placeholder="Describe your furniture requirement or room sizes..."
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    required
                    rows={4}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100 outline-none focus:border-[#d4af37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-[#d4af37] to-amber-500 text-black font-extrabold text-xs rounded-xl shadow-lg hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Send className="w-4 h-4" />
                  Send Inquiry To Showroom
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
