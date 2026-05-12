import { useState, useRef } from "react";

const THEMES = [
  { name: "Yellow", nameT: "เหลือง", primary: "#F5B800", primaryDark: "#D9A200", bg: "#1E1E1E", card: "#2A2A2A", headerText: "#1A1A1A", accent: "#1A1A1A" },
  { name: "Dark", nameT: "เข้ม", primary: "#2A2A2A", primaryDark: "#1A1A1A", bg: "#111", card: "#1E1E1E", headerText: "#FFFFFF", accent: "#F5B800" },
  { name: "White", nameT: "ขาว", primary: "#F5B800", primaryDark: "#D9A200", bg: "#F5F5F0", card: "#FFFFFF", headerText: "#1A1A1A", accent: "#1A1A1A" },
];

const lang = {
  en: {
    brand: "all Thailand", brandSub: "GOLF CLINIC",
    title: "beat the pro", subtitle: "Junior Activity Registration",
    saturday: "Saturday", sunday: "Sunday", selectDay: "Select your day",
    step1: "Kid's Profile", step2: "Parent Details", step3: "Performance & Showcase",
    kidName: "Kid's Full Name", kidNamePh: "e.g. Somchai Jaidee",
    kidDob: "Date of Birth", kidPhoto: "Kid's Photo",
    parentName: "Parent / Guardian Name", parentNamePh: "e.g. Khun Somsak Jaidee",
    parentPhone: "Phone Number", parentPhonePh: "e.g. 081 234 5678",
    scorecard: "Scorecard (image or PDF)", swingVideo: "Swing Video", introVideo: "Self-Introduction Video",
    upload: "Tap to upload", next: "NEXT", back: "BACK", submit: "SUBMIT",
    confirm: "Registration Complete!", confirmMsg: "See you on the course!",
    errorRequired: "This field is required", errorFile: "Please upload this file",
    colors: "Theme", registerAnother: "+ Register Another",
    event: "Event", parent: "Parent", phone: "Phone", day: "Day",
  },
  th: {
    brand: "all Thailand", brandSub: "GOLF CLINIC",
    title: "beat the pro", subtitle: "ลงทะเบียนกิจกรรมเยาวชน",
    saturday: "วันเสาร์", sunday: "วันอาทิตย์", selectDay: "เลือกวันที่",
    step1: "ข้อมูลเด็ก", step2: "ข้อมูลผู้ปกครอง", step3: "ผลงาน & วิดีโอ",
    kidName: "ชื่อ-นามสกุลเด็ก", kidNamePh: "เช่น สมชาย ใจดี",
    kidDob: "วันเกิด", kidPhoto: "รูปภาพเด็ก",
    parentName: "ชื่อผู้ปกครอง", parentNamePh: "เช่น คุณสมศักดิ์ ใจดี",
    parentPhone: "เบอร์โทรศัพท์", parentPhonePh: "เช่น 081 234 5678",
    scorecard: "สกอร์การ์ด (ภาพหรือ PDF)", swingVideo: "วิดีโอการสวิง", introVideo: "วิดีโอแนะนำตัว",
    upload: "แตะเพื่ออัปโหลด", next: "ถัดไป", back: "ย้อนกลับ", submit: "ส่งข้อมูล",
    confirm: "ลงทะเบียนสำเร็จ!", confirmMsg: "พบกันในสนาม!",
    errorRequired: "กรุณากรอกข้อมูล", errorFile: "กรุณาอัปโหลดไฟล์",
    colors: "ธีม", registerAnother: "+ ลงทะเบียนอีกคน",
    event: "กิจกรรม", parent: "ผู้ปกครอง", phone: "โทรศัพท์", day: "วัน",
  },
};

function FileUpload({ label, value, onChange, error, c }) {
  const ref = useRef();
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: "#999", display: "block", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>
        {label} <span style={{ color: "#E55" }}>*</span>
      </label>
      <div onClick={() => ref.current.click()} style={{
        border: `2px dashed ${error ? "#E55" : value ? c.primary : "#444"}`,
        borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center",
        gap: 12, cursor: "pointer", background: value ? `${c.primary}15` : "#33333360",
        transition: "all 0.2s",
      }}>
        <span style={{ fontSize: 20 }}>{value ? "✅" : "📎"}</span>
        <span style={{ fontSize: 13, color: value ? c.primary : error ? "#E55" : "#AAA", fontWeight: value ? 600 : 400 }}>
          {value ? value.name : label}
        </span>
        <input ref={ref} type="file" style={{ display: "none" }} onChange={e => onChange(e.target.files[0])} />
      </div>
      {error && <div style={{ fontSize: 12, color: "#E55", marginTop: 5 }}>⚠ {error}</div>}
    </div>
  );
}

function Input({ label, placeholder, type = "text", value, onChange, error, c }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: "#999", display: "block", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>
        {label} <span style={{ color: "#E55" }}>*</span>
      </label>
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "12px 14px", borderRadius: 12,
          border: `2px solid ${error ? "#E55" : value ? c.primary : "#444"}`,
          fontSize: 15, background: "#33333360", color: "#FFF",
          outline: "none", boxSizing: "border-box",
        }}
      />
      {error && <div style={{ fontSize: 12, color: "#E55", marginTop: 5 }}>⚠ {error}</div>}
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState("en");
  const [step, setStep] = useState(0);
  const [day, setDay] = useState(null);
  const [themeIdx, setThemeIdx] = useState(0);
  const [showTheme, setShowTheme] = useState(false);
  const [errors, setErrors] = useState({});
  const c = THEMES[themeIdx];
  const t = lang[language];

  const [form, setForm] = useState({
    kidName: "", kidDob: "", kidPhoto: null,
    parentName: "", parentPhone: "",
    scorecard: null, swingVideo: null, introVideo: null,
  });

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })); };

  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.kidName.trim()) e.kidName = t.errorRequired;
      if (!form.kidDob) e.kidDob = t.errorRequired;
      if (!form.kidPhoto) e.kidPhoto = t.errorFile;
    }
    if (s === 2) {
      if (!form.parentName.trim()) e.parentName = t.errorRequired;
      if (!form.parentPhone.trim()) e.parentPhone = t.errorRequired;
    }
    if (s === 3) {
      if (!form.scorecard) e.scorecard = t.errorFile;
      if (!form.swingVideo) e.swingVideo = t.errorFile;
      if (!form.introVideo) e.introVideo = t.errorFile;
    }
    return e;
  };

  const tryNext = (from, to) => {
    const e = validate(from);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({}); setStep(to);
  };

  const steps = [t.step1, t.step2, t.step3];
  const card = { background: c.card, borderRadius: 18, padding: "20px 18px", marginBottom: 16, border: "1.5px solid #3A3A3A" };
  const btnPrimary = { flex: 1, padding: "14px", borderRadius: 12, border: "none", background: c.primary, color: c.headerText, fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: 1.5 };
  const btnOutline = { flex: 1, padding: "14px", borderRadius: 12, border: "2px solid #555", background: "transparent", color: "#AAA", fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: 1 };

  return (
    <div style={{ background: c.bg, minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>

      {/* Header */}
      <div style={{ background: c.card, borderBottom: `3px solid ${c.primary}`, padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 11, color: "#AAA", letterSpacing: 1 }}>{t.brand}</span>
              <span style={{ fontSize: 11, color: c.primary, letterSpacing: 2, fontWeight: 700 }}>{t.brandSub}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, fontStyle: "italic", color: c.primary, lineHeight: 1.1, letterSpacing: -0.5 }}>
              {t.title}
            </div>
            <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>{t.subtitle}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <div style={{ display: "flex", background: "#33333380", borderRadius: 20, overflow: "hidden", border: "1px solid #444" }}>
              {["en", "th"].map(l => (
                <button key={l} onClick={() => setLanguage(l)} style={{
                  padding: "5px 14px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
                  background: language === l ? c.primary : "transparent",
                  color: language === l ? c.headerText : "#888",
                  borderRadius: 20, letterSpacing: 1,
                }}>{l.toUpperCase()}</button>
              ))}
            </div>
            <button onClick={() => setShowTheme(!showTheme)} style={{ background: "transparent", border: "1px solid #444", borderRadius: 20, padding: "4px 10px", color: "#888", fontSize: 11, cursor: "pointer" }}>
              🎨 {t.colors}
            </button>
          </div>
        </div>

        {showTheme && (
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {THEMES.map((th, i) => (
              <button key={i} onClick={() => { setThemeIdx(i); setShowTheme(false); }} style={{
                background: th.primary, border: i === themeIdx ? "2px solid #FFF" : "2px solid transparent",
                borderRadius: 20, padding: "5px 14px", color: th.headerText, fontSize: 12, cursor: "pointer", fontWeight: 700,
              }}>{language === "th" ? th.nameT : th.name}</button>
            ))}
          </div>
        )}

        {step > 0 && step < 4 && (
          <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0,
                    background: i + 1 <= step ? c.primary : "#333",
                    color: i + 1 <= step ? c.headerText : "#666",
                    border: i + 1 === step ? `2px solid ${c.primary}` : "2px solid transparent",
                  }}>{i + 1 < step ? "✓" : i + 1}</div>
                  <span style={{ fontSize: 10, color: i + 1 <= step ? c.primary : "#555", letterSpacing: 0.5 }}>{s}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 1.5, background: i + 1 < step ? c.primary : "#333", margin: "0 8px" }} />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>

        {step === 0 && (
          <div>
            <div style={{ fontSize: 13, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>• {t.selectDay} •</div>
            {[t.saturday, t.sunday].map(d => (
              <div key={d} onClick={() => setDay(d)} style={{
                ...card,
                border: `2px solid ${day === d ? c.primary : "#3A3A3A"}`,
                display: "flex", alignItems: "center", gap: 16, cursor: "pointer",
                background: day === d ? `${c.primary}18` : c.card,
              }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: day === d ? c.primary : "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>⛳</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: day === d ? c.primary : "#EEE" }}>{d}</div>
                  <div style={{ fontSize: 12, color: "#777", letterSpacing: 1 }}>BEAT THE PRO · JUNIOR ACTIVITY</div>
                </div>
                {day === d && <span style={{ color: c.primary, fontSize: 22, fontWeight: 900 }}>✓</span>}
              </div>
            ))}
            {day && (
              <button style={{ ...btnPrimary, width: "100%", marginTop: 8 }} onClick={() => setStep(1)}>{t.next} →</button>
            )}
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={card}>
              <div style={{ fontSize: 13, color: c.primary, letterSpacing: 2, fontWeight: 700, marginBottom: 16 }}>⛳ {t.step1.toUpperCase()}</div>
              <Input label={t.kidName} placeholder={t.kidNamePh} value={form.kidName} onChange={v => set("kidName", v)} error={errors.kidName} c={c} />
              <Input label={t.kidDob} type="date" value={form.kidDob} onChange={v => set("kidDob", v)} error={errors.kidDob} c={c} />
              <FileUpload label={t.kidPhoto} value={form.kidPhoto} onChange={v => set("kidPhoto", v)} error={errors.kidPhoto} c={c} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={btnOutline} onClick={() => setStep(0)}>← {t.back}</button>
              <button style={btnPrimary} onClick={() => tryNext(1, 2)}>{t.next} →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={card}>
              <div style={{ fontSize: 13, color: c.primary, letterSpacing: 2, fontWeight: 700, marginBottom: 16 }}>👨‍👧 {t.step2.toUpperCase()}</div>
              <Input label={t.parentName} placeholder={t.parentNamePh} value={form.parentName} onChange={v => set("parentName", v)} error={errors.parentName} c={c} />
              <Input label={t.parentPhone} placeholder={t.parentPhonePh} type="tel" value={form.parentPhone} onChange={v => set("parentPhone", v)} error={errors.parentPhone} c={c} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={btnOutline} onClick={() => setStep(1)}>← {t.back}</button>
              <button style={btnPrimary} onClick={() => tryNext(2, 3)}>{t.next} →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={card}>
              <div style={{ fontSize: 13, color: c.primary, letterSpacing: 2, fontWeight: 700, marginBottom: 16 }}>🏆 {t.step3.toUpperCase()}</div>
              <FileUpload label={t.scorecard} value={form.scorecard} onChange={v => set("scorecard", v)} error={errors.scorecard} c={c} />
              <FileUpload label={t.swingVideo} value={form.swingVideo} onChange={v => set("swingVideo", v)} error={errors.swingVideo} c={c} />
              <FileUpload label={t.introVideo} value={form.introVideo} onChange={v => set("introVideo", v)} error={errors.introVideo} c={c} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={btnOutline} onClick={() => setStep(2)}>← {t.back}</button>
              <button style={{ ...btnPrimary, flex: 2 }} onClick={() => tryNext(3, 4)}>{t.submit} ✓</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: c.primary, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38 }}>⛳</div>
            <div style={{ fontSize: 24, fontWeight: 900, fontStyle: "italic", color: c.primary, marginBottom: 6 }}>{t.confirm}</div>
            <div style={{ fontSize: 14, color: "#888", letterSpacing: 2, marginBottom: 24 }}>{t.confirmMsg}</div>
            <div style={card}>
              {[[t.event, "Beat the Pro"], [t.day, day], [t.parent, form.parentName], [t.phone, form.parentPhone]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderBottom: "1px solid #333", padding: "10px 0" }}>
                  <span style={{ color: "#888", letterSpacing: 1, textTransform: "uppercase", fontSize: 11 }}>{k}</span>
                  <span style={{ color: "#EEE", fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <button style={{ ...btnPrimary, width: "100%", marginTop: 8 }}
              onClick={() => { setStep(0); setDay(null); setForm({ kidName: "", kidDob: "", kidPhoto: null, parentName: "", parentPhone: "", scorecard: null, swingVideo: null, introVideo: null }); setErrors({}); }}>
              {t.registerAnother}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
