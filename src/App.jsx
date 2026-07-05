import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  ChevronRight, ChevronLeft, CheckCircle, AlertCircle, 
  Send, Shield, User, FileText, Star, MessageSquare, 
  Loader2, Check, Info
} from 'lucide-react';

// Initialize Supabase using Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// JSON-DRIVEN CONFIGURATION
// ==========================================
const SURVEY_CONFIG = {
  regions: [
    "Region I - Ilocos Region", "Region II - Cagayan Valley", "Region III - Central Luzon", "Region IV-A - CALABARZON", "MIMAROPA Region", "Region V - Bicol Region", "Region VI - Western Visayas", "Region VII - Central Visayas", "Region VIII - Eastern Visayas", "Region IX - Zamboanga Peninsula", "Region X - Northern Mindanao", "Region XI - Davao Region", "Region XII - SOCCSKSARGEN", "Region XIII - Caraga", "NCR - National Capital Region", "CAR - Cordillera Administrative Region", "BARMM - Bangsamoro Autonomous Region in Muslim Mindanao"
  ],
  services: [
    "Request and Issuances of Scholastic Records (TOR, Certificates, Grades, Diploma, Documents)", "Processing Financial Assistance", "Application (employment)", "Payment", "Process related research paper documents", "Process scholarship documentary requirements", "Submit requirements", "Consultation (clinic, health, guidance)", "Inquiries, complaints and assistance", "Request for issuance of Travel orders, application of leave, documents", "Request for livestreaming, photo documentation and news writing of university events and activities", "Process of salary claims, vouchers", "Receive Documents (for signature)", "Release documents (done signature)", "Visit office personnel", "Other"
  ],
  offices: [
    "CD Office", "Accounting Office", "Budget / Finance Office", "Cashier's Office", "Civil Security Unit (CSU) Office", "Medical Clinic / Dental", "Admin Office", "CAS Office", "COTE Office", "COED Office", "MIS Office", "Guidance Office", "Graduate School Office", "Human Resource and Management Office", "Library Office", "Maintenance Office", "BAC Office", "Public Assistance and Information Desk", "Registrar's Office", "Scholarship Office", "SAO Dean's Office", "Supply Office", "GAD Office", "Planning & Development Office", "DOI Office", "Other"
  ],
  ccQuestions: [
    {
      id: "cc1",
      question: "CC1. Do you know about the Citizen's Charter (CC)? Nakahibalo ba ka bahin sa Citizen's Charter or CC?",
      options: [
        "Yes, I know and I saw this office's CC. (Kahibalo ko kung unsa ang CC ug nakita nako ang CC aning buhatan).",
        "Yes, I know but I did NOT see this office's CC. (Kahibalo ko kung unsa ang CC pero wala nako makita ang CC aning buhatan).",
        "No, and I only know about it when I saw this office's CC. (Nakahibalo ko sa CC lamang pagkakita nako sa CC aning buhatan.)",
        "No, I do not know and I did not see one in this office. (Wala ko kahibalo kung unsa ang CC ug wala ko makakita og usa dinhi sa buhatan)"
      ]
    },
    {
      id: "cc2",
      question: "CC2: If YES to #1, did you see this office's Citizen's Charter? (Kung Yes, masulti ba nimo nga ang CC aning opisina kay)",
      options: [
        "Yes, it was easy to see. (Sayon ra makita)",
        "Yes, somewhat easy to see. (Medjo sayon ra makita)",
        "No, it is difficult to see. (Liso makita)",
        "No, it is not visible at all. (Wala gyud makita)",
        "Not Applicable (N/A). (Dili angay)"
      ]
    },
    {
      id: "cc3",
      question: "CC3. If Yes to #2, how much did the CC help you in your transaction? (Kung YES, giunsa ka maktabang sa CC sa imong transaksion?)",
      options: [
        "Yes, it helped me very much. (Dako kaayo'g natabang).",
        "Yes, it somewhat helped. (Medjo nakatabang).",
        "No, it did not help at all. (Wala gyud makatabang).",
        "Not Applicable (N/A). (Dili angay)"
      ]
    }
  ],
  sqdScale: ["Strongly Agree", "Agree", "Neither Agree nor Disagree", "Disagree", "Strongly Disagree", "Not Applicable (N/A)"],
  sqdStatements: [
    { id: "sqd0", text: "SQD 0. I am satisfied with the service. (Kontento ko sa serbisyo.)" },
    { id: "sqd1", text: "SQD 1. I spent a reasonable amount of time for my transaction. (Akong transaksyon nahuman sa hustong oras)." },
    { id: "sqd2", text: "SQD 2. The office followed the transaction's requirements and steps based on the information provided. (Gisunod sa opisina ang mga kinahanglanon ug mga pamaagi sa transaksyon sumala sa impormasyong gihatag.)" },
    { id: "sqd3", text: "SQD 3. The steps I needed to do for transaction were easy and simple. (Sayon ug yano ra ang mga lakang nga akong gisunod aron makompleto ang transaksyon.)" },
    { id: "sqd4", text: "SQD 4. I easily found information about my transaction from the office or its website. (Sayon nako nakit-an ang impormasyon mahitungod sa akong transaksyon gikan sa buhatan o sa ilang website.)" },
    { id: "sqd5", text: "SQD 5. I paid a reasonable amount of fees for my transaction. (Makatarunganon ang kantidad sa bayad nga akong gibayran alang sa akong transaksyon.)" },
    { id: "sqd6", text: "SQD 6. I feel the office was fair to all or had no favoritism. (Gibati nako nga patas sa serbisyon ug walay pinalabi)." },
    { id: "sqd7", text: "SQD 7. The staff treated me courteously and were helpful. (Matinahuron ko nilang giatiman.)" },
    { id: "sqd8", text: "SQD 8. I got what I needed from the office, or if denied, was sufficiently provided an explanation. (Nakuha nako ang akong gikinahanglan sa opisina, o kung gi-deny, gipasabot ko sa rason.)" }
  ]
};

export default function App() {
  const currentYear = new Date().getFullYear();
  const [step, setStep] = useState(0); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [invalidFields, setInvalidFields] = useState([]);

  const [formData, setFormData] = useState({
    consent: "", client_type: "", date_of_service: "", gender: "", age: "", region: "", service_availed: "", service_other: "", campus: "", office_visited: "", office_other: "",
    cc1: "", cc2: "", cc3: "",
    sqd0: "", sqd1: "", sqd2: "", sqd3: "", sqd4: "", sqd5: "", sqd6: "", sqd7: "", sqd8: "",
    suggestions: "", full_name: "", email: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(""); 
    
    if (invalidFields.includes(field)) {
      setInvalidFields(prev => prev.filter(f => f !== field));
    }
  };

  const nextStep = () => {
    if (step === 1 && formData.consent !== "agree") {
      setError("You must agree to the consent form to participate.");
      setInvalidFields(["consent"]);
      return;
    }

    if (step === 2) {
      const required = ['client_type', 'date_of_service', 'gender', 'age', 'region', 'service_availed', 'campus', 'office_visited'];
      const missing = required.filter(field => !formData[field]);
      
      if (formData.office_visited === "Other" && !formData.office_other.trim()) {
        missing.push('office_other');
      }
      
      if (formData.service_availed === "Other" && !formData.service_other.trim()) {
        missing.push('service_other');
      }

      if (missing.length > 0) {
        setError("Please fill out all required fields highlighted in red.");
        setInvalidFields(missing);
        return;
      }
    }

    if (step === 3) {
      const missingCc = ['cc1', 'cc2', 'cc3'].filter(field => !formData[field]);
      if (missingCc.length > 0) {
        setError("Please answer all Citizen's Charter questions highlighted in red.");
        setInvalidFields(missingCc);
        return;
      }
    }

    if (step === 4) {
      const requiredSqd = ['sqd0', 'sqd1', 'sqd2', 'sqd3', 'sqd4', 'sqd5', 'sqd6', 'sqd7', 'sqd8'];
      const missingSqd = requiredSqd.filter(field => !formData[field]);
      if (missingSqd.length > 0) {
        setError("Please rate all Service Quality Dimensions statements highlighted in red.");
        setInvalidFields(missingSqd);
        return;
      }
    }

    setError("");
    setInvalidFields([]);
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    setError("");
    setInvalidFields([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setError("Supabase connection keys are missing! Please check your .env file.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    
    const payload = { ...formData };
    delete payload.consent; 

    if (payload.age) payload.age = parseInt(payload.age, 10);
    
    if (payload.service_availed === "Other") {
      payload.service_availed = payload.service_other;
    }
    delete payload.service_other;

    try {
      const { error: dbError } = await supabase.from('css_responses').insert([payload]);
      if (dbError) throw dbError;
      
      setStep(6);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError("Failed to submit survey. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isInvalid = (field) => invalidFields.includes(field);

  const steps = [
    { icon: Info, title: "Info" },
    { icon: Shield, title: "Consent" },
    { icon: User, title: "Client" },
    { icon: FileText, title: "Charter" },
    { icon: Star, title: "Quality" },
    { icon: MessageSquare, title: "Feedback" }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans selection:bg-orange-200 text-[#1F2937]">
      <div className="bg-white w-full py-4 px-6 border-b border-[#E5E7EB] shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/CTU logo.png" 
              alt="CTU Logo" 
              className="w-12 h-12 object-contain"
              onError={(e) => {
                e.target.src = "https://upload.wikimedia.org/wikipedia/commons/9/9a/Cebu_Technological_University_Logo.png"
              }}
            />
            <div>
              <h1 className="font-bold text-[#1F2937] tracking-normal uppercase text-sm sm:text-base">Cebu Technological University</h1>
              <p className="text-[#6B7280] text-xs font-medium uppercase tracking-wider text-left">Argao Campus QA Office</p>
            </div>
          </div>
          <div className="hidden sm:block px-3 py-1.5 bg-[#FFF4E5] text-[#D97E00] border border-[#FF9501]/20 rounded-md text-xs font-bold uppercase tracking-wider">
            Official Form
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
        
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] tracking-tight">
            Client Satisfaction Survey <span className="text-[#FF9501]">{currentYear}</span>
          </h2>
          <p className="text-[#6B7280] mt-2 text-sm font-medium">Help us identify areas of strength and opportunities for improvement to better serve you.</p>
        </div>

        {step < 6 && (
          <div className="flex justify-between items-center mb-8 relative px-4">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#E5E7EB] rounded-full z-0"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#FF9501] rounded-full z-0 transition-all duration-500 ease-out" style={{ width: `${(step / 5) * 100}%` }}></div>
            
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step >= idx;
              const isCurrent = step === idx;
              return (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                    isActive ? 'bg-[#FF9501] border-[#FF9501] text-white shadow-md' : 'bg-white border-[#E5E7EB] text-[#9CA3AF]'
                  } ${isCurrent ? 'ring-4 ring-orange-100 scale-110' : ''}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`hidden sm:block text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-[#FF9501]' : 'text-[#9CA3AF]'}`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 rounded-xl animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-semibold text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
          
          {step === 0 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4 mb-2">
                  <Info className="w-6 h-6 text-[#FF9501]" />
                  <h3 className="text-lg font-bold text-[#1F2937]">Part I: Information Sheet</h3>
                </div>

                <div className="text-sm text-[#4B5563] space-y-5 leading-relaxed text-left">
                  <p>
                    <strong>Introduction:</strong> Cebu Technological University Argao Campus (CTU-AC) is conducting a Client/Customer Satisfaction Survey to evaluate the quality of its services, programs, facilities, and resources for the year {currentYear}. The information gathered will help the University identify areas of strength and opportunities for improvement to better serve its stakeholders. Your participation in this survey is voluntary. Before deciding to participate, please read this consent information carefully to understand the purpose of the survey, how your information will be used, and your rights as a participant.
                  </p>
                  <p>
                    <strong>Privacy Notice:</strong> CTU-AC is committed to protecting your privacy and handling your personal information in accordance with the applicable provisions of the Data Privacy Act of 2012 (Republic Act No. 10173). The information you provide will be treated with strict confidentiality and will be used solely for institutional assessment, quality assurance, planning, and service improvement purposes. Survey results will be reported only in aggregate form, and no individual respondent will be identified in any report or publication unless required by law or with your explicit consent.
                  </p>
                  <p>
                    <strong>Voluntary Participation and Right to Withdraw:</strong> Your participation in this survey is entirely voluntary. You may choose not to answer any question that you are uncomfortable with or discontinue your participation at any time before submitting your responses, without penalty or loss of any benefits or services. Once your responses have been submitted and anonymized, they may no longer be identifiable for withdrawal.
                  </p>
                  <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                    <p className="mb-2"><strong>Contact Information:</strong> If you have any questions about this survey, your rights as a participant, or how your information will be used, please contact:</p>
                    <ul className="space-y-1">
                      <li><strong>Facebook:</strong> <a className="text-[#FF9501] hover:underline font-medium" href="https://www.facebook.com/profile.php?id=100063694579890" target="_blank" rel="noreferrer">Cebu Technological University - Argao Campus</a></li>
                      <li><strong>Email:</strong> <a className="text-[#FF9501] hover:underline font-medium" href="mailto:argao@ctu.edu.ph">argao@ctu.edu.ph</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4 mb-2">
                  <Shield className="w-6 h-6 text-[#FF9501]" />
                  <h3 className="text-lg font-bold text-[#1F2937]">Part II: Certificate of Consent</h3>
                </div>

                <div className="text-sm text-[#4B5563] space-y-4 leading-relaxed">
                  <p>I have read and understood the information provided regarding the Client/Customer Satisfaction Survey {currentYear} conducted by Cebu Technological University – Argao Campus (CTU-AC). I understand that the purpose of this survey is to evaluate the quality of the University's services, programs, facilities, and resources and to identify opportunities for continuous improvement. I understand that:</p>
                  
                  <ul className="space-y-3 list-disc pl-5 marker:text-[#FF9501]">
                    <li>My participation in this survey is entirely voluntary.</li>
                    <li>I may decline to answer any question or discontinue my participation at any time before submitting my responses without any penalty or adverse consequences.</li>
                    <li>The information I provide will be treated with strict confidentiality and will be used solely for institutional assessment, quality assurance, planning, research, and service improvement purposes.</li>
                    <li>My responses will be reported only in summary or aggregate form, and no personally identifiable information will be disclosed unless required by law or with my explicit consent.</li>
                    <li>The collection, processing, storage, and protection of my personal information will be carried out in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173) and other applicable laws and university policies.</li>
                  </ul>
                </div>

                <div className={`mt-8 p-5 rounded-xl border transition-colors duration-300 ${isInvalid('consent') ? 'bg-red-50 border-red-300' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
                  <p className={`font-bold mb-4 text-sm ${isInvalid('consent') ? 'text-red-700' : 'text-[#1F2937]'}`}>
                    By selecting "I Agree", I acknowledge that I have read and understood the information above and voluntarily consent to participate.
                  </p>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleInputChange('consent', 'agree')}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${formData.consent === 'agree' ? 'border-[#FF9501] bg-[#FFF4E5]' : isInvalid('consent') ? 'border-red-300 bg-white hover:border-red-400' : 'border-[#E5E7EB] bg-white hover:border-gray-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.consent === 'agree' ? 'border-[#FF9501]' : 'border-gray-300'}`}>
                        {formData.consent === 'agree' && <div className="w-2.5 h-2.5 bg-[#FF9501] rounded-full" />}
                      </div>
                      <span className={`font-semibold text-sm ${formData.consent === 'agree' ? 'text-[#D97E00]' : 'text-[#374151]'}`}>I Agree. I voluntarily consent to participate in the survey.</span>
                    </button>
                    
                    <button 
                      onClick={() => handleInputChange('consent', 'disagree')}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${formData.consent === 'disagree' ? 'border-red-500 bg-red-50' : isInvalid('consent') ? 'border-red-300 bg-white hover:border-red-400' : 'border-[#E5E7EB] bg-white hover:border-gray-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.consent === 'disagree' ? 'border-red-500' : 'border-gray-300'}`}>
                        {formData.consent === 'disagree' && <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />}
                      </div>
                      <span className={`font-semibold text-sm ${formData.consent === 'disagree' ? 'text-red-700' : 'text-[#374151]'}`}>I Do Not Agree. I do not wish to participate in this survey.</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
               <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4 mb-2">
                  <User className="w-6 h-6 text-[#FF9501]" />
                  <h3 className="text-lg font-bold text-[#1F2937]">Part III: Client Information</h3>
                </div>
                
                <div className={`p-4 rounded-xl transition-colors ${isInvalid('client_type') ? 'bg-red-50/50 -mx-4 px-4' : ''}`}>
                  <label className={`block font-bold mb-2 text-sm ${isInvalid('client_type') ? 'text-red-600' : 'text-[#374151]'}`}>Client Type <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {["Citizen/Individual", "Business", "Government employee"].map(opt => (
                      <button 
                        key={opt} onClick={() => handleInputChange('client_type', opt)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all text-center ${formData.client_type === opt ? 'border-[#FF9501] bg-[#FFF4E5] text-[#D97E00] ring-1 ring-[#FF9501]' : isInvalid('client_type') ? 'border-red-300 bg-white text-red-600' : 'border-[#E5E7EB] bg-[#F9FAFB] text-[#4B5563] hover:bg-gray-100'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={`block font-bold mb-2 text-sm ${isInvalid('date_of_service') ? 'text-red-600' : 'text-[#374151]'}`}>Date of Service <span className="text-red-500">*</span></label>
                    <input type="date" value={formData.date_of_service} onChange={(e) => handleInputChange('date_of_service', e.target.value)} 
                           className={`w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9501] transition-colors ${isInvalid('date_of_service') ? 'border border-red-400 bg-red-50 focus:border-[#FF9501]' : 'border border-[#E5E7EB] bg-[#F9FAFB]'}`} />
                  </div>
                  <div>
                    <label className={`block font-bold mb-2 text-sm ${isInvalid('age') ? 'text-red-600' : 'text-[#374151]'}`}>Age <span className="text-red-500">*</span></label>
                    <input type="number" placeholder="Enter age" value={formData.age} onChange={(e) => handleInputChange('age', e.target.value)} 
                           className={`w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9501] transition-colors ${isInvalid('age') ? 'border border-red-400 bg-red-50 focus:border-[#FF9501]' : 'border border-[#E5E7EB] bg-[#F9FAFB]'}`} />
                  </div>
                </div>

                <div className={`p-4 rounded-xl transition-colors ${isInvalid('gender') ? 'bg-red-50/50 -mx-4 px-4' : ''}`}>
                  <label className={`block font-bold mb-2 text-sm ${isInvalid('gender') ? 'text-red-600' : 'text-[#374151]'}`}>Gender <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-3">
                    {["Woman", "Man", "Non-binary", "Prefer not to say"].map(opt => (
                      <button 
                        key={opt} onClick={() => handleInputChange('gender', opt)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${formData.gender === opt ? 'border-[#FF9501] bg-[#FFF4E5] text-[#D97E00]' : isInvalid('gender') ? 'border-red-300 bg-white text-red-600' : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-gray-50'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={`block font-bold mb-2 text-sm ${isInvalid('region') ? 'text-red-600' : 'text-[#374151]'}`}>Region <span className="text-red-500">*</span></label>
                    <select value={formData.region} onChange={(e) => handleInputChange('region', e.target.value)} 
                            className={`w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9501] transition-colors cursor-pointer ${isInvalid('region') ? 'border border-red-400 bg-red-50 text-red-700' : 'border border-[#E5E7EB] bg-[#F9FAFB]'}`}>
                      <option value="" disabled>Select Region...</option>
                      {SURVEY_CONFIG.regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`block font-bold mb-2 text-sm ${isInvalid('service_availed') || isInvalid('service_other') ? 'text-red-600' : 'text-[#374151]'}`}>Service Availed <span className="text-red-500">*</span></label>
                    <select value={formData.service_availed} onChange={(e) => handleInputChange('service_availed', e.target.value)} 
                            className={`w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9501] transition-colors cursor-pointer ${isInvalid('service_availed') ? 'border border-red-400 bg-red-50 text-red-700' : 'border border-[#E5E7EB] bg-[#F9FAFB]'}`}>
                      <option value="" disabled>Select Service...</option>
                      {SURVEY_CONFIG.services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {formData.service_availed === "Other" && (
                      <input 
                        type="text" placeholder="Please specify service..." 
                        value={formData.service_other} onChange={(e) => handleInputChange('service_other', e.target.value)} 
                        className={`mt-3 w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9501] transition-colors animate-in fade-in ${isInvalid('service_other') ? 'border border-red-400 bg-red-50' : 'border border-[#E5E7EB] bg-white'}`}
                      />
                    )}
                  </div>
                </div>

                <div className={`p-5 rounded-xl border space-y-5 transition-colors duration-300 ${isInvalid('campus') || isInvalid('office_visited') || isInvalid('office_other') ? 'bg-red-50/50 border-red-200' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
                  <div>
                    <label className={`block font-bold mb-2 text-sm ${isInvalid('campus') ? 'text-red-600' : 'text-[#374151]'}`}>Campus <span className="text-red-500">*</span></label>
                    <div className="flex gap-3">
                      {["Argao", "Oslob", "Ginatilan"].map(opt => (
                        <button 
                          key={opt} onClick={() => handleInputChange('campus', opt)}
                          className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${formData.campus === opt ? 'border-[#FF9501] bg-[#FFF4E5] text-[#D97E00]' : isInvalid('campus') ? 'border-red-300 bg-white text-red-600' : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-gray-50'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={`block font-bold mb-2 text-sm ${isInvalid('office_visited') || isInvalid('office_other') ? 'text-red-600' : 'text-[#374151]'}`}>Office Visited <span className="text-red-500">*</span></label>
                    <select value={formData.office_visited} onChange={(e) => handleInputChange('office_visited', e.target.value)} 
                            className={`w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9501] transition-colors cursor-pointer ${isInvalid('office_visited') ? 'border border-red-400 bg-white text-red-700' : 'border border-[#E5E7EB] bg-white'}`}>
                      <option value="" disabled>Select Office...</option>
                      {SURVEY_CONFIG.offices.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    {formData.office_visited === "Other" && (
                      <input 
                        type="text" placeholder="Please specify office..." 
                        value={formData.office_other} onChange={(e) => handleInputChange('office_other', e.target.value)} 
                        className={`mt-3 w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9501] transition-colors animate-in fade-in ${isInvalid('office_other') ? 'border border-red-400 bg-red-50' : 'border border-[#E5E7EB] bg-white'}`}
                      />
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
               <div className="p-6 md:p-8 space-y-6">
                <div className="border-b border-[#E5E7EB] pb-4 mb-2">
                  <div className="flex items-center gap-3 mb-1">
                    <FileText className="w-6 h-6 text-[#FF9501]" />
                    <h3 className="text-lg font-bold text-[#1F2937]">Part IV: Citizen's Charter (CC)</h3>
                  </div>
                  <p className="text-xs text-[#6B7280]">The CC is an official document reflecting services, requirements, fees, and processing times.</p>
                </div>

                <div className="space-y-6">
                  {SURVEY_CONFIG.ccQuestions.map((q) => (
                    <div key={q.id} className={`p-5 rounded-xl border transition-colors duration-300 ${isInvalid(q.id) ? 'bg-red-50/50 border-red-200' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
                      <p className={`font-bold mb-4 text-sm leading-relaxed ${isInvalid(q.id) ? 'text-red-700' : 'text-[#1F2937]'}`}>{q.question} <span className="text-red-500">*</span></p>
                      <div className="space-y-2">
                        {q.options.map(opt => (
                          <button 
                            key={opt} onClick={() => handleInputChange(q.id, opt)}
                            className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left ${formData[q.id] === opt ? 'border-[#FF9501] bg-[#FFF4E5] ring-1 ring-[#FF9501]' : isInvalid(q.id) ? 'border-red-300 bg-white hover:border-red-400' : 'border-[#E5E7EB] bg-white hover:border-gray-300'}`}
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${formData[q.id] === opt ? 'border-[#FF9501]' : isInvalid(q.id) ? 'border-red-400' : 'border-gray-300'}`}>
                              {formData[q.id] === opt && <div className="w-2 h-2 bg-[#FF9501] rounded-full" />}
                            </div>
                            <span className={`text-sm font-medium leading-snug ${isInvalid(q.id) && !formData[q.id] ? 'text-gray-600' : 'text-[#374151]'}`}>{opt}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
             <div className="animate-in fade-in slide-in-from-right-8 duration-300">
               <div className="p-6 md:p-8 space-y-6">
                <div className="border-b border-[#E5E7EB] pb-4 mb-2">
                  <div className="flex items-center gap-3 mb-1">
                    <Star className="w-6 h-6 text-[#FF9501]" />
                    <h3 className="text-lg font-bold text-[#1F2937]">Part V: Service Quality Dimensions</h3>
                  </div>
                  <p className="text-xs text-[#6B7280]">Please select the rating that best corresponds to your experience.</p>
                </div>

                <div className="hidden md:block overflow-hidden border border-[#E5E7EB] rounded-xl shadow-sm">
                  <table className="w-full text-left bg-white">
                    <thead>
                      <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                        <th className="p-4 w-1/3 font-semibold text-[#4B5563] text-xs uppercase tracking-wider">Statement</th>
                        {SURVEY_CONFIG.sqdScale.map(scale => (
                          <th key={scale} className="p-3 w-[11%] font-semibold text-[#4B5563] text-[10px] text-center uppercase tracking-wider leading-tight">{scale}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {SURVEY_CONFIG.sqdStatements.map((stmt, idx) => (
                        <tr key={stmt.id} className={`transition-colors ${isInvalid(stmt.id) ? 'bg-red-50/50' : 'hover:bg-orange-50/30'}`}>
                          <td className={`p-4 text-sm font-medium border-r border-[#E5E7EB] ${isInvalid(stmt.id) ? 'text-red-700' : 'text-[#1F2937]'}`}>{stmt.text}</td>
                          {SURVEY_CONFIG.sqdScale.map(scale => {
                            const isSelected = formData[stmt.id] === scale;
                            return (
                              <td key={scale} className="p-0 border-r border-[#E5E7EB] last:border-0 relative">
                                <button 
                                  onClick={() => handleInputChange(stmt.id, scale)}
                                  className={`w-full h-full min-h-[60px] flex items-center justify-center transition-all ${isSelected ? 'bg-[#FFF4E5]' : isInvalid(stmt.id) ? 'hover:bg-red-100/50' : 'hover:bg-gray-50'}`}
                                >
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#FF9501]' : isInvalid(stmt.id) ? 'border-red-300' : 'border-gray-300'}`}>
                                    {isSelected && <div className="w-2.5 h-2.5 bg-[#FF9501] rounded-full" />}
                                  </div>
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-5">
                  {SURVEY_CONFIG.sqdStatements.map(stmt => (
                    <div key={stmt.id} className={`p-5 rounded-xl border transition-colors duration-300 ${isInvalid(stmt.id) ? 'bg-red-50/50 border-red-200' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
                      <p className={`font-bold text-sm mb-4 ${isInvalid(stmt.id) ? 'text-red-700' : 'text-[#1F2937]'}`}>{stmt.text} <span className="text-red-500">*</span></p>
                      <div className="space-y-2">
                        {SURVEY_CONFIG.sqdScale.map(scale => (
                          <button 
                            key={scale} onClick={() => handleInputChange(stmt.id, scale)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${formData[stmt.id] === scale ? 'border-[#FF9501] bg-[#FFF4E5] ring-1 ring-[#FF9501]' : isInvalid(stmt.id) ? 'border-red-300 bg-white hover:border-red-400' : 'border-[#E5E7EB] bg-white hover:border-gray-300'}`}
                          >
                             <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${formData[stmt.id] === scale ? 'border-[#FF9501]' : isInvalid(stmt.id) ? 'border-red-400' : 'border-gray-300'}`}>
                                {formData[stmt.id] === scale && <div className="w-2 h-2 bg-[#FF9501] rounded-full" />}
                              </div>
                              <span className={`text-sm font-medium ${isInvalid(stmt.id) && !formData[stmt.id] ? 'text-gray-600' : 'text-[#374151]'}`}>{scale}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
             </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
               <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4 mb-2">
                  <MessageSquare className="w-6 h-6 text-[#FF9501]" />
                  <h3 className="text-lg font-bold text-[#1F2937]">Part VI: Suggestions & Recommendations</h3>
                </div>

                <div>
                  <label className="block font-bold text-[#374151] mb-2 text-sm">
                    We value your feedback. Please share any suggestions, comments, or recommendations.
                  </label>
                  <textarea 
                    rows="5" placeholder="Type your suggestions here..."
                    value={formData.suggestions} onChange={(e) => handleInputChange('suggestions', e.target.value)}
                    className="w-full p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9501] transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                  <p className="text-xs font-bold text-[#6B7280] mb-4 uppercase tracking-wider">Optional Contact Info</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-medium text-[#374151] mb-1.5 text-sm">Complete Name</label>
                      <input type="text" placeholder="Optional" value={formData.full_name} onChange={(e) => handleInputChange('full_name', e.target.value)} className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9501] transition-colors" />
                    </div>
                    <div>
                      <label className="block font-medium text-[#374151] mb-1.5 text-sm">Email Address</label>
                      <input type="email" placeholder="Optional" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9501] transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="p-12 text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-[#FF9501]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Survey Submitted Successfully!</h2>
              <p className="text-[#6B7280] text-sm max-w-md mx-auto leading-relaxed">Thank you for your time. Your feedback is securely saved and will help CTU Argao improve its services.</p>
              
              <button 
                onClick={() => window.location.reload()}
                className="mt-8 px-6 py-2.5 bg-[#FF9501] text-white text-sm font-semibold rounded-lg hover:bg-[#D97E00] transition-transform active:scale-95 shadow-sm"
              >
                Submit Another Response
              </button>
            </div>
          )}

          {step < 6 && (
            <div className="p-6 border-t border-[#E5E7EB] bg-[#F9FAFB] flex justify-between items-center rounded-b-2xl">
              {step > 0 ? (
                <button onClick={prevStep} disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E5E7EB] text-[#4B5563] text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 shadow-sm">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : <div></div>}
              
              {step < 5 ? (
                <button onClick={nextStep} className="flex items-center gap-2 px-6 py-2.5 bg-[#FF9501] text-white text-sm font-semibold rounded-lg hover:bg-[#D97E00] transition-colors shadow-sm cursor-pointer active:scale-95">
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-[#FF9501] text-white text-sm font-semibold rounded-lg hover:bg-[#D97E00] transition-colors shadow-sm cursor-pointer disabled:opacity-50 active:scale-95">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin"/> Submitting...</> : <>Submit Survey <Send className="w-4 h-4 ml-1" /></>}
                </button>
              )}
            </div>
          )}

        </div>
        
        <div className="text-center mt-6 text-xs text-[#9CA3AF] font-medium">
          Powered by CTU Argao Quality Assurance Office &copy; {currentYear}
        </div>

      </div>
    </div>
  );
}