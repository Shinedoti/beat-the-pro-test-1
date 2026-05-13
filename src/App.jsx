import { useState, useRef } from "react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxILFGmT-3xuSqKQmQOxiSlYycfyV3noeiasfT-gabj_-mrDAPcY2UK2UMScuRaifF9QQ/exec";

function fileToBase64(file) {
  return new Promise(function(resolve) {
    if (!file) { resolve(null); return; }
    var reader = new FileReader();
    reader.onload = function(e) { resolve(e.target.result); };
    reader.readAsDataURL(file);
  });
}

const THEMES = [
  { name: "White",  nameT: "ขาว",    primary: "#F5B800", bg: "#F5F5F0", card: "#FFFFFF", headerText: "#1A1A1A", textMain: "#1A1A1A", textSub: "#555", border: "#CCC" },
  { name: "Yellow", nameT: "เหลือง", primary: "#F5B800", bg: "#1E1E1E", card: "#2A2A2A", headerText: "#1A1A1A", textMain: "#EEE",    textSub: "#AAA", border: "#444" },
];

const SAT_DETAILS = [
  { text: "Masterclass by ", bold: "Andrew Knott" },
  { text: "3 station learning from tour pros" },
  { text: "Beat the Pro" },
];
const SUN_DETAILS = [
  { text: "Game development Q&A with ", bold: "Andrew Knott", after: " and tour pros" },
  { text: "Golf demonstration" },
  { text: "Fun challenge for prizes" },
  { text: "", bold: "Lucky Draw!!!" },
];

const lang = {
  en: {
    brand: "all Thailand", brandSub: "Golf Clinic",
    title: "beat the pro", subtitle: "Junior Activity Registration",
    saturday: "Saturday", sunday: "Sunday", selectDay: "Select your activity", selectHint: "Select one or both",
    step1: "Kid's Profile", step2: "Parent Details", step3: "Performance & Showcase",
    kidNameEN: "Full Name (English)", kidNameENPh: "e.g. Somchai Jaidee",
    kidNameTH: "Full Name (Thai)", kidNameTHPh: "เช่น สมชาย ใจดี",
    kidAge: "Age", kidAgePh: "e.g. 10",
    kidGolfExp: "Golf Experience (years)", kidGolfExpPh: "e.g. 3",
    kidAcadYear: "Academic Year / Grade", kidAcadYearPh: "e.g. Grade 5",
    kidSchool: "School", kidSchoolPh: "e.g. Bangkok Christian College",
    kidProvince: "Resident Province", kidProvincePh: "e.g. Bangkok",
    kidCert: "Would you like to receive an electronic certificate of participation?",
    certYes: "Yes, please!", certNo: "No, thank you",
    kidPhoto: "Kid's Photo",
    gender: "Gender", genderMale: "Male", genderFemale: "Female", genderOther: "Prefer not to say",
    parentName: "Parent / Guardian Name", parentNamePh: "e.g. Khun Somsak Jaidee",
    parentPhone: "Phone Number", parentPhonePh: "e.g. 081 234 5678",
    parentEmail: "Email Address", parentEmailPh: "e.g. parent@email.com",
    scorecard: "Scorecard (image or PDF)", swingVideo: "Swing Video", introVideo: "Self-Introduction Video",
    next: "NEXT", back: "BACK", submit: "SUBMIT",
    confirm: "Registration Complete!", confirmMsg: "See you on the course!",
    errorRequired: "This field is required", errorFile: "Please upload this file",
    errorDay: "Please select at least one activity", errorGender: "Please select a gender",
    errorCert: "Please select an option",
    colors: "Theme", registerAnother: "+ Register Another",
    activityLabel: "Activity", parentLabel: "Parent", phoneLabel: "Phone",
    noFiles: "No files required for this activity 🏌️",
    submitting: "Submitting...", networkError: "Network error. Please try again.",
  },
  th: {
    brand: "all Thailand", brandSub: "Golf Clinic",
    title: "beat the pro", subtitle: "Junior Activity Registration",
    saturday: "Saturday", sunday: "Sunday", selectDay: "เลือกกิจกรรม", selectHint: "เลือกหนึ่งหรือทั้งสองรายการ",
    step1: "ข้อมูลเด็ก", step2: "ข้อมูลผู้ปกครอง", step3: "ผลงาน & วิดีโอ",
    kidNameEN: "ชื่อ-นามสกุล (อังกฤษ)", kidNameENPh: "e.g. Somchai Jaidee",
    kidNameTH: "ชื่อ-นามสกุล (ไทย)", kidNameTHPh: "เช่น สมชาย ใจดี",
    kidAge: "อายุ", kidAgePh: "เช่น 10",
    kidGolfExp: "ประสบการณ์กอล์ฟ (ปี)", kidGolfExpPh: "เช่น 3",
    kidAcadYear: "ชั้นปี / ระดับชั้น", kidAcadYearPh: "เช่น ป.5",
    kidSchool: "โรงเรียน", kidSchoolPh: "เช่น โรงเรียนกรุงเทพคริสเตียน",
    kidProvince: "จังหวัดที่อยู่อาศัย", kidProvincePh: "เช่น กรุงเทพมหานคร",
    kidCert: "ต้องการรับใบประกาศนียบัตรอิเล็กทรอนิกส์หรือไม่?",
    certYes: "ต้องการ", certNo: "ไม่ต้องการ",
    kidPhoto: "รูปภาพเด็ก",
    gender: "เพศ", genderMale: "ชาย", genderFemale: "หญิง", genderOther: "ไม่ระบุ",
    parentName: "ชื่อผู้ปกครอง", parentNamePh: "เช่น คุณสมศักดิ์ ใจดี",
    parentPhone: "เบอร์โทรศัพท์", parentPhonePh: "เช่น 081 234 5678",
    parentEmail: "อีเมล", parentEmailPh: "เช่น parent@email.com",
    scorecard: "สกอร์การ์ด (ภาพหรือ PDF)", swingVideo: "วิดีโอการสวิง", introVideo: "วิดีโอแนะนำตัว",
    next: "ถัดไป", back: "ย้อนกลับ", submit: "ส่งข้อมูล",
    confirm: "ลงทะเบียนสำเร็จ!", confirmMsg: "พบกันในสนาม!",
    errorRequired: "กรุณากรอกข้อมูล", errorFile: "กรุณาอัปโหลดไฟล์",
    errorDay: "กรุณาเลือกกิจกรรมอย่างน้อยหนึ่งรายการ", errorGender: "กรุณาเลือกเพศ",
    errorCert: "กรุณาเลือกตัวเลือก",
    colors: "ธีม", registerAnother: "+ ลงทะเบียนอีกคน",
    activityLabel: "กิจกรรม", parentLabel: "ผู้ปกครอง", phoneLabel: "โทรศัพท์",
    noFiles: "ไม่จำเป็นต้องอัปโหลดไฟล์สำหรับกิจกรรมนี้ 🏌️",
    submitting: "กำลังส่งข้อมูล...", networkError: "เกิดข้อผิดพลาด กรุณาลองใหม่",
  },
};

const css = `
@keyframes fadeIn    { from{opacity:0} to{opacity:1} }
@keyframes fadeUp    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeOut   { from{opacity:1;transform:scale(1)} to{opacity:0;transform:scale(0.95)} }
@keyframes popIn     { 0%{opacity:0;transform:scale(0.7)} 70%{transform:scale(1.08)} 100%{opacity:1;transform:scale(1)} }
@keyframes slideIn   { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
@keyframes expandIn  { from{opacity:0;max-height:0} to{opacity:1;max-height:500px} }
@keyframes breathe   { 0%{transform:scale(1);opacity:0.85} 50%{transform:scale(1.18);opacity:1} 100%{transform:scale(1);opacity:0.85} }
@keyframes btnBreathe{ 0%{box-shadow:0 0 0px #F5B80000;transform:scale(1)} 50%{box-shadow:0 0 22px #F5B80099;transform:scale(1.03)} 100%{box-shadow:0 0 0px #F5B80000;transform:scale(1)} }
@keyframes shimmer   { 0%{opacity:0.6} 50%{opacity:1} 100%{opacity:0.6} }
.fade-in     { animation: fadeIn     0.4s ease both }
.fade-up     { animation: fadeUp     0.5s ease both }
.fade-out    { animation: fadeOut    0.4s ease forwards }
.pop-in      { animation: popIn      0.5s cubic-bezier(.17,.67,.35,1.2) both }
.slide-in    { animation: slideIn    0.4s ease both }
.expand-in   { animation: expandIn   0.35s ease both; overflow:hidden }
.breathe     { animation: breathe    3s ease-in-out infinite }
.btn-breathe { animation: btnBreathe 2.5s ease-in-out infinite }
.shimmer     { animation: shimmer    2s ease-in-out infinite }
.hover-card  { transition: transform 0.18s ease, box-shadow 0.18s ease !important }
.hover-card:hover { transform: scale(1.02) !important; box-shadow: 0 0 20px #F5B80044 !important }
.hover-flag  { transition: transform 0.18s ease, box-shadow 0.18s ease !important }
.hover-flag:hover { transform: scale(1.08) !important; box-shadow: 0 0 16px #F5B80077 !important }
input:focus  { border-color: #F5B800 !important }
`;

function Anim({ children, cls, delay, style }) {
  return <div className={cls || "fade-up"} style={{ animationDelay: (delay || 0) + "s", ...(style || {}) }}>{children}</div>;
}

function DetailLine({ item, color }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
      <span style={{ color: "#F5B800", fontSize: 14, marginTop: 1, flexShrink: 0 }}>•</span>
      <span style={{ fontSize: 13, color: color, lineHeight: 1.5 }}>
        {item.text}{item.bold && <strong>{item.bold}</strong>}{item.after || ""}
      </span>
    </div>
  );
}

function SectionDivider({ label, c }) {
  return (
    <div style={{ fontSize: 10, color: c.primary, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 12, marginTop: 8, paddingBottom: 6, borderBottom: "1px solid " + c.primary + "44" }}>
      {label}
    </div>
  );
}

function Input({ label, placeholder, type, value, onChange, error, c }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: c.textSub, display: "block", marginBottom: 6, letterSpacing: 0.3 }}>
        {label} <span style={{ color: "#E55" }}>*</span>
      </label>
      <input type={type || "text"} placeholder={placeholder} value={value}
        onChange={function(e) { onChange(e.target.value); }}
        style={{
          width: "100%", padding: "12px 14px", borderRadius: 12,
          border: "2px solid " + (error ? "#E55" : value ? c.primary : c.border),
          fontSize: 15, background: "rgba(128,128,128,0.08)", color: c.textMain,
          outline: "none", boxSizing: "border-box",
        }}
      />
      {error && <div className="fade-in" style={{ fontSize: 12, color: "#E55", marginTop: 5 }}>⚠ {error}</div>}
    </div>
  );
}

function TwoCol({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{children}</div>;
}

function ChoiceSelect({ label, value, onChange, error, c, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: c.textSub, display: "block", marginBottom: 8, letterSpacing: 0.3 }}>
        {label} <span style={{ color: "#E55" }}>*</span>
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        {options.map(function(opt) {
          var sel = value === opt.value;
          return (
            <div key={opt.value} onClick={function() { onChange(opt.value); }} style={{
              flex: 1, padding: "10px 6px", borderRadius: 12, cursor: "pointer", textAlign: "center",
              border: "2px solid " + (sel ? c.primary : error ? "#E55" : c.border),
              background: sel ? c.primary + "18" : "rgba(128,128,128,0.08)",
              transition: "all 0.2s",
            }}>
              {opt.icon && <div style={{ fontSize: 18, marginBottom: 4 }}>{opt.icon}</div>}
              <div style={{ fontSize: 12, fontWeight: sel ? 700 : 400, color: sel ? c.primary : c.textMain, lineHeight: 1.3 }}>{opt.label}</div>
            </div>
          );
        })}
      </div>
      {error && <div className="fade-in" style={{ fontSize: 12, color: "#E55", marginTop: 5 }}>⚠ {error}</div>}
    </div>
  );
}

function FileUpload({ label, value, onChange, error, c, videoOnly }) {
  var ref = useRef();
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: c.textSub, display: "block", marginBottom: 6, letterSpacing: 0.3 }}>
        {label} <span style={{ color: "#E55" }}>*</span>
        {videoOnly && <span style={{ color: c.primary, marginLeft: 6, fontSize: 10 }}>(video only)</span>}
      </label>
      <div onClick={function() { ref.current.click(); }} style={{
        border: "2px dashed " + (error ? "#E55" : value ? c.primary : c.border),
        borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center",
        gap: 12, cursor: "pointer", background: value ? c.primary + "18" : "rgba(128,128,128,0.08)", transition: "all 0.25s",
      }}>
        <span style={{ fontSize: 20 }}>{value ? "✅" : videoOnly ? "🎬" : "📎"}</span>
        <span style={{ fontSize: 13, color: value ? c.primary : error ? "#E55" : c.textSub, fontWeight: value ? 600 : 400 }}>
          {value ? value.name : label}
        </span>
        <input ref={ref} type="file" accept={videoOnly ? "video/*" : "*/*"} style={{ display: "none" }} onChange={function(e) { onChange(e.target.files[0]); }} />
      </div>
      {error && <div className="fade-in" style={{ fontSize: 12, color: "#E55", marginTop: 5 }}>⚠ {error}</div>}
    </div>
  );
}

export default function App() {
  var [language, setLanguage]             = useState("en");
  var [step, setStep]                     = useState(-1);
  var [splashOut, setSplashOut]           = useState(false);
  var [showLangPicker, setShowLangPicker] = useState(false);
  var [days, setDays]                     = useState([]);
  var [themeIdx, setThemeIdx]             = useState(0);
  var [showTheme, setShowTheme]           = useState(false);
  var [errors, setErrors]                 = useState({});
  var [animKey, setAnimKey]               = useState(0);
  var [submitting, setSubmitting]         = useState(false);
  var [submitError, setSubmitError]       = useState("");
  var [form, setForm]                     = useState({
    kidNameEN: "", kidNameTH: "", kidAge: "", kidGender: "",
    kidGolfExp: "", kidAcadYear: "", kidSchool: "", kidProvince: "",
    kidCert: "", kidPhoto: null,
    parentName: "", parentPhone: "", parentEmail: "",
    scorecard: null, swingVideo: null, introVideo: null,
  });

  var c = THEMES[themeIdx];
  var t = lang[language];

  function setF(k, v) {
    setForm(function(f) { return Object.assign({}, f, { [k]: v }); });
    setErrors(function(e) { return Object.assign({}, e, { [k]: null }); });
  }

  function toggleDay(d) {
    setDays(function(prev) { return prev.includes(d) ? prev.filter(function(x) { return x !== d; }) : prev.concat([d]); });
    setErrors(function(e) { return Object.assign({}, e, { days: null }); });
  }

  function validate(s) {
    var e = {};
    if (s === 0 && days.length === 0) e.days = t.errorDay;
    if (s === 1) {
      if (!form.kidNameEN.trim())  e.kidNameEN  = t.errorRequired;
      if (!form.kidNameTH.trim())  e.kidNameTH  = t.errorRequired;
      if (!form.kidAge.trim())     e.kidAge     = t.errorRequired;
      if (!form.kidGender)         e.kidGender  = t.errorGender;
      if (!form.kidGolfExp.trim()) e.kidGolfExp = t.errorRequired;
      if (!form.kidAcadYear.trim())e.kidAcadYear= t.errorRequired;
      if (!form.kidSchool.trim())  e.kidSchool  = t.errorRequired;
      if (!form.kidProvince.trim())e.kidProvince= t.errorRequired;
      if (!form.kidCert)           e.kidCert    = t.errorCert;
      if (!form.kidPhoto)          e.kidPhoto   = t.errorFile;
    }
    if (s === 2) {
      if (!form.parentName.trim())  e.parentName  = t.errorRequired;
      if (!form.parentPhone.trim()) e.parentPhone = t.errorRequired;
      if (!form.parentEmail.trim()) e.parentEmail = t.errorRequired;
    }
    if (s === 3) {
      var needFiles = days.includes(t.saturday);
      if (needFiles && !form.scorecard)  e.scorecard  = t.errorFile;
      if (needFiles && !form.swingVideo) e.swingVideo = t.errorFile;
      if (needFiles && !form.introVideo) e.introVideo = t.errorFile;
    }
    return e;
  }

  function goTo(to) { setAnimKey(function(k) { return k + 1; }); setStep(to); }
  function handleGetStarted() { setSplashOut(true); setTimeout(function() { setSplashOut(false); setShowLangPicker(true); }, 400); }
  function selectLanguage(l) { setLanguage(l); setShowLangPicker(false); goTo(0); }

  function tryNext(from, to) {
    var e = validate(from);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({}); goTo(to);
  }

  function submitToSheet() {
    var e = validate(3);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setSubmitting(true);
    setSubmitError("");

    Promise.all([
      fileToBase64(form.kidPhoto),
      fileToBase64(form.scorecard),
      fileToBase64(form.swingVideo),
      fileToBase64(form.introVideo),
    ]).then(function(results) {
      var params = new URLSearchParams({
        activity:    days.join(" & "),
        kidNameEN:   form.kidNameEN,
        kidNameTH:   form.kidNameTH,
        kidAge:      form.kidAge,
        kidGender:   form.kidGender,
        kidGolfExp:  form.kidGolfExp,
        kidAcadYear: form.kidAcadYear,
        kidSchool:   form.kidSchool,
        kidProvince: form.kidProvince,
        kidCert:     form.kidCert,
        parentName:  form.parentName,
        parentPhone: form.parentPhone,
        parentEmail: form.parentEmail,
        kidPhoto:    results[0] || "",
        scorecard:   results[1] || "",
        swingVideo:  results[2] || "",
        introVideo:  results[3] || "",
      });
      return fetch(SCRIPT_URL + "?" + params.toString(), { method: "GET", mode: "no-cors" });
    }).then(function() {
      setSubmitting(false);
      goTo(4);
    }).catch(function() {
      setSubmitting(false);
      setSubmitError(t.networkError);
    });
  }

  function resetForm() {
    goTo(0); setDays([]);
    setForm({ kidNameEN: "", kidNameTH: "", kidAge: "", kidGender: "", kidGolfExp: "", kidAcadYear: "", kidSchool: "", kidProvince: "", kidCert: "", kidPhoto: null, parentName: "", parentPhone: "", parentEmail: "", scorecard: null, swingVideo: null, introVideo: null });
    setErrors({});
  }

  var steps = [t.step1, t.step2, t.step3];
  var cardStyle = { background: c.card, borderRadius: 18, padding: "20px 18px", marginBottom: 16, border: "1.5px solid " + c.border };
  var btnP = { flex: 1, padding: "14px", borderRadius: 12, border: "none", background: c.primary, color: c.headerText, fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: 1.5, transition: "all 0.2s" };
  var btnO = { flex: 1, padding: "14px", borderRadius: 12, border: "2px solid " + c.border, background: "transparent", color: c.textSub, fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: 1 };

  var genderOpts = [
    { value: "male",   label: t.genderMale,   icon: "👦" },
    { value: "female", label: t.genderFemale, icon: "👧" },
    { value: "other",  label: t.genderOther,  icon: "🤍" },
  ];
  var certOpts = [
    { value: "yes", label: t.certYes, icon: "📜" },
    { value: "no",  label: t.certNo,  icon: "✖️" },
  ];

  return (
    <div style={{ background: c.bg, minHeight: "100vh", fontFamily: "Arial,sans-serif" }}>
      <style>{css}</style>

      {/* Splash */}
      {step === -1 && (
        <div className={splashOut ? "fade-out" : "fade-in"} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
          <Anim cls="pop-in" delay={0.1}>
            <div className="breathe" style={{ fontSize: 72, marginBottom: 24 }}>⛳</div>
          </Anim>
          <Anim cls="fade-up" delay={0.3}>
            <div style={{ fontSize: 11, color: "#AAA", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
              {t.brand} <span style={{ color: c.primary }}>{t.brandSub}</span>
            </div>
            <div style={{ fontSize: 38, fontWeight: 900, fontStyle: "italic", color: c.primary, lineHeight: 1.1, marginBottom: 8 }}>{t.title}</div>
            <div style={{ fontSize: 11, color: "#666", letterSpacing: 2, textTransform: "uppercase", marginBottom: 48 }}>{t.subtitle}</div>
          </Anim>
          <Anim cls="fade-up" delay={0.5} style={{ width: "100%", maxWidth: 360 }}>
            <button className="btn-breathe" style={Object.assign({}, btnP, { width: "100%", fontSize: 16, padding: "18px", letterSpacing: 4, borderRadius: 14 })} onClick={handleGetStarted}>
              GET STARTED
            </button>
          </Anim>
          <Anim cls="fade-up" delay={0.7}>
            <div className="shimmer" style={{ fontSize: 12, color: "#555", marginTop: 24, letterSpacing: 1 }}>all Thailand Golf Tour</div>
          </Anim>
        </div>
      )}

      {/* Lang Picker */}
      {showLangPicker && (
        <div className="fade-in" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div className="pop-in" style={{ background: c.card, borderRadius: 24, padding: "36px 32px", textAlign: "center", width: 300, border: "2px solid " + c.primary }}>
            <div style={{ fontSize: 13, color: c.primary, letterSpacing: 3, fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>Choose Language</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 28 }}>เลือกภาษา</div>
            <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
              {[
                { code: "en", label: "English", sublabel: "อังกฤษ", flag: (
                  <svg viewBox="0 0 60 40" width="72" height="48" style={{ borderRadius: 6, display: "block" }}>
                    <rect width="60" height="40" fill="#012169"/>
                    <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8"/>
                    <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="5"/>
                    <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="12"/>
                    <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="7"/>
                  </svg>
                )},
                { code: "th", label: "ภาษาไทย", sublabel: "Thai", flag: (
                  <svg viewBox="0 0 60 40" width="72" height="48" style={{ borderRadius: 6, display: "block" }}>
                    <rect width="60" height="40" fill="#A51931"/>
                    <rect y="6.67" width="60" height="26.67" fill="#F4F5F8"/>
                    <rect y="13.33" width="60" height="13.33" fill="#2D2A4A"/>
                  </svg>
                )},
              ].map(function(opt) {
                var sel = language === opt.code;
                return (
                  <div key={opt.code} className="hover-flag" onClick={function() { selectLanguage(opt.code); }} style={{
                    cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                    padding: "14px 18px", borderRadius: 16,
                    border: "2px solid " + (sel ? c.primary : "transparent"),
                    background: sel ? c.primary + "18" : "transparent", transition: "all 0.2s",
                  }}>
                    <div style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.25)", borderRadius: 6 }}>{opt.flag}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: sel ? c.primary : c.textMain }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{opt.sublabel}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      {step >= 0 && (
        <div className="fade-in" style={{ background: c.card, borderBottom: "3px solid " + c.primary, padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div onClick={function() { goTo(-1); }} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 11, color: "#AAA", letterSpacing: 1 }}>{t.brand}</span>
                <span style={{ fontSize: 11, color: c.primary, letterSpacing: 2, fontWeight: 700 }}>{t.brandSub}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, fontStyle: "italic", color: c.primary, lineHeight: 1.1 }}>{t.title}</div>
              <div style={{ fontSize: 11, color: c.textSub, letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>{t.subtitle}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <div style={{ display: "flex", background: "rgba(128,128,128,0.15)", borderRadius: 20, overflow: "hidden", border: "1px solid " + c.border }}>
                {["en", "th"].map(function(l) {
                  return (
                    <button key={l} onClick={function() { setLanguage(l); }} style={{
                      padding: "5px 14px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
                      background: language === l ? c.primary : "transparent",
                      color: language === l ? c.headerText : c.textSub,
                      borderRadius: 20, letterSpacing: 1, transition: "all 0.2s",
                    }}>{l.toUpperCase()}</button>
                  );
                })}
              </div>
              <button onClick={function() { setShowTheme(!showTheme); }} style={{ background: "transparent", border: "1px solid " + c.border, borderRadius: 20, padding: "4px 10px", color: c.textSub, fontSize: 11, cursor: "pointer" }}>
                🎨 {t.colors}
              </button>
            </div>
          </div>
          {showTheme && (
            <div className="fade-up" style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {THEMES.map(function(th, i) {
                return (
                  <button key={i} onClick={function() { setThemeIdx(i); setShowTheme(false); }} style={{
                    background: th.primary, border: i === themeIdx ? "2px solid " + (i === 0 ? "#333" : "#FFF") : "2px solid transparent",
                    borderRadius: 20, padding: "5px 14px", color: th.headerText, fontSize: 12, cursor: "pointer", fontWeight: 700,
                  }}>{language === "th" ? th.nameT : th.name}</button>
                );
              })}
            </div>
          )}
          {step > 0 && step < 4 && (
            <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
              {steps.map(function(s, i) {
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0,
                        background: i + 1 <= step ? c.primary : (c.bg === "#F5F5F0" ? "#DDD" : "#333"),
                        color: i + 1 <= step ? c.headerText : c.textSub,
                        border: i + 1 === step ? "2px solid " + c.primary : "2px solid transparent",
                        transition: "all 0.3s",
                      }}>{i + 1 < step ? "✓" : i + 1}</div>
                      <span style={{ fontSize: 10, color: i + 1 <= step ? c.primary : c.textSub, letterSpacing: 0.5 }}>{s}</span>
                    </div>
                    {i < 2 && <div style={{ flex: 1, height: 1.5, background: i + 1 < step ? c.primary : c.border, margin: "0 8px", transition: "background 0.4s" }} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Body */}
      {step >= 0 && (
        <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>

          {/* Step 0 */}
          {step === 0 && (
            <div key={animKey} className="slide-in">
              <div style={{ fontSize: 13, color: c.textSub, letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>• {t.selectDay} •</div>
              <div style={{ fontSize: 11, color: c.textSub, marginBottom: 16 }}>{t.selectHint}</div>
              {[{ label: t.saturday, details: SAT_DETAILS }, { label: t.sunday, details: SUN_DETAILS }].map(function(item, idx) {
                var sel = days.includes(item.label);
                return (
                  <Anim key={item.label} cls="fade-up" delay={idx * 0.1}>
                    <div className="hover-card" onClick={function() { toggleDay(item.label); }} style={{
                      background: sel ? c.primary + "14" : c.card, borderRadius: 18, marginBottom: 14,
                      cursor: "pointer", border: "2px solid " + (sel ? c.primary : c.border),
                      overflow: "hidden", transition: "all 0.25s",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px" }}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: sel ? c.primary : (c.bg === "#F5F5F0" ? "#EEE" : "#333"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, transition: "all 0.2s" }}>⛳</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 18, fontWeight: 700, color: sel ? c.primary : c.textMain }}>{item.label}</div>
                          <div style={{ fontSize: 11, color: c.textSub, letterSpacing: 1 }}>JUNIOR ACTIVITY · all Thailand GOLF TOUR</div>
                        </div>
                        <div style={{ fontSize: 20, color: c.primary, fontWeight: 900 }}>{sel ? "✓" : "+"}</div>
                      </div>
                      {sel && (
                        <div className="expand-in" style={{ borderTop: "1px solid " + c.primary + "44", padding: "14px 18px 16px" }}>
                          {item.details.map(function(d, i) { return <DetailLine key={i} item={d} color={c.textMain} />; })}
                        </div>
                      )}
                    </div>
                  </Anim>
                );
              })}
              {errors.days && <div className="fade-in" style={{ fontSize: 12, color: "#E55", marginBottom: 10 }}>⚠ {errors.days}</div>}
              <button style={Object.assign({}, btnP, { width: "100%" })} onClick={function() { tryNext(0, 1); }}>{t.next} →</button>
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div key={animKey} className="slide-in">
              <div style={cardStyle}>
                <div style={{ fontSize: 13, color: c.primary, letterSpacing: 2, fontWeight: 700, marginBottom: 12 }}>⛳ {t.step1.toUpperCase()}</div>
                <SectionDivider label="Name" c={c} />
                <Input label={t.kidNameEN} placeholder={t.kidNameENPh} value={form.kidNameEN} onChange={function(v) { setF("kidNameEN", v); }} error={errors.kidNameEN} c={c} />
                <Input label={t.kidNameTH} placeholder={t.kidNameTHPh} value={form.kidNameTH} onChange={function(v) { setF("kidNameTH", v); }} error={errors.kidNameTH} c={c} />
                <SectionDivider label="Personal Info" c={c} />
                <TwoCol>
                  <Input label={t.kidAge} placeholder={t.kidAgePh} type="number" value={form.kidAge} onChange={function(v) { setF("kidAge", v); }} error={errors.kidAge} c={c} />
                  <Input label={t.kidGolfExp} placeholder={t.kidGolfExpPh} type="number" value={form.kidGolfExp} onChange={function(v) { setF("kidGolfExp", v); }} error={errors.kidGolfExp} c={c} />
                </TwoCol>
                <ChoiceSelect label={t.gender} value={form.kidGender} onChange={function(v) { setF("kidGender", v); }} error={errors.kidGender} c={c} options={genderOpts} />
                <SectionDivider label="Academic Info" c={c} />
                <TwoCol>
                  <Input label={t.kidAcadYear} placeholder={t.kidAcadYearPh} value={form.kidAcadYear} onChange={function(v) { setF("kidAcadYear", v); }} error={errors.kidAcadYear} c={c} />
                  <Input label={t.kidProvince} placeholder={t.kidProvincePh} value={form.kidProvince} onChange={function(v) { setF("kidProvince", v); }} error={errors.kidProvince} c={c} />
                </TwoCol>
                <Input label={t.kidSchool} placeholder={t.kidSchoolPh} value={form.kidSchool} onChange={function(v) { setF("kidSchool", v); }} error={errors.kidSchool} c={c} />
                <SectionDivider label="Certificate" c={c} />
                <ChoiceSelect label={t.kidCert} value={form.kidCert} onChange={function(v) { setF("kidCert", v); }} error={errors.kidCert} c={c} options={certOpts} />
                <SectionDivider label="Photo" c={c} />
                <FileUpload label={t.kidPhoto} value={form.kidPhoto} onChange={function(v) { setF("kidPhoto", v); }} error={errors.kidPhoto} c={c} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={btnO} onClick={function() { goTo(0); }}>← {t.back}</button>
                <button style={btnP} onClick={function() { tryNext(1, 2); }}>{t.next} →</button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div key={animKey} className="slide-in">
              <div style={cardStyle}>
                <div style={{ fontSize: 13, color: c.primary, letterSpacing: 2, fontWeight: 700, marginBottom: 16 }}>👨‍👧 {t.step2.toUpperCase()}</div>
                <Input label={t.parentName} placeholder={t.parentNamePh} value={form.parentName} onChange={function(v) { setF("parentName", v); }} error={errors.parentName} c={c} />
                <Input label={t.parentPhone} placeholder={t.parentPhonePh} type="tel" value={form.parentPhone} onChange={function(v) { setF("parentPhone", v); }} error={errors.parentPhone} c={c} />
                <Input label={t.parentEmail} placeholder={t.parentEmailPh} type="email" value={form.parentEmail} onChange={function(v) { setF("parentEmail", v); }} error={errors.parentEmail} c={c} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={btnO} onClick={function() { goTo(1); }}>← {t.back}</button>
                <button style={btnP} onClick={function() { tryNext(2, 3); }}>{t.next} →</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div key={animKey} className="slide-in">
              <div style={cardStyle}>
                <div style={{ fontSize: 13, color: c.primary, letterSpacing: 2, fontWeight: 700, marginBottom: 16 }}>🏆 {t.step3.toUpperCase()}</div>
                {days.includes(t.saturday) ? (
                  <div>
                    <FileUpload label={t.scorecard}  value={form.scorecard}  onChange={function(v) { setF("scorecard", v); }}  error={errors.scorecard}  c={c} />
                    <FileUpload label={t.swingVideo} value={form.swingVideo} onChange={function(v) { setF("swingVideo", v); }} error={errors.swingVideo} c={c} videoOnly={true} />
                    <FileUpload label={t.introVideo} value={form.introVideo} onChange={function(v) { setF("introVideo", v); }} error={errors.introVideo} c={c} videoOnly={true} />
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px 0", color: c.textSub, fontSize: 13 }}>{t.noFiles}</div>
                )}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={btnO} onClick={function() { goTo(2); }}>← {t.back}</button>
                <button style={Object.assign({}, btnP, { flex: 2, opacity: submitting ? 0.7 : 1 })}
                  onClick={submitToSheet} disabled={submitting}>
                  {submitting ? "⏳ " + t.submitting : t.submit + " ✓"}
                </button>
              </div>
              {submitError && <div className="fade-in" style={{ fontSize: 12, color: "#E55", marginTop: 10, textAlign: "center" }}>⚠ {submitError}</div>}
            </div>
          )}

          {/* Confirm */}
          {step === 4 && (
            <div key={animKey} style={{ textAlign: "center" }}>
              <Anim cls="pop-in" delay={0.1}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: c.primary, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38 }}>⛳</div>
              </Anim>
              <Anim cls="fade-up" delay={0.3}>
                <div style={{ fontSize: 24, fontWeight: 900, fontStyle: "italic", color: c.primary, marginBottom: 6 }}>{t.confirm}</div>
                <div style={{ fontSize: 14, color: c.textSub, letterSpacing: 2, marginBottom: 24 }}>{t.confirmMsg}</div>
              </Anim>
              <Anim cls="fade-up" delay={0.45}>
                <div style={cardStyle}>
                  {[
                    [t.activityLabel, days.join(" & ")],
                    ["Name (EN)", form.kidNameEN],
                    ["Name (TH)", form.kidNameTH],
                    ["Age", form.kidAge],
                    ["School", form.kidSchool],
                    [t.parentLabel, form.parentName],
                    [t.phoneLabel, form.parentPhone],
                  ].map(function(row) {
                    return (
                      <div key={row[0]} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderBottom: "1px solid " + c.border, padding: "10px 0" }}>
                        <span style={{ color: c.textSub, letterSpacing: 1, textTransform: "uppercase", fontSize: 11 }}>{row[0]}</span>
                        <span style={{ color: c.textMain, fontWeight: 600 }}>{row[1]}</span>
                      </div>
                    );
                  })}
                </div>
              </Anim>
              <Anim cls="fade-up" delay={0.6}>
                <button style={Object.assign({}, btnP, { width: "100%", marginTop: 8 })} onClick={resetForm}>{t.registerAnother}</button>
              </Anim>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
