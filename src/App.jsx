import { useState, useRef } from "react";

const THEMES = [
  { name: "Yellow", nameT: "เหลือง", primary: "#F5B800", primaryDark: "#D9A200", bg: "#1E1E1E", card: "#2A2A2A", headerText: "#1A1A1A" },
  { name: "Dark",   nameT: "เข้ม",   primary: "#2A2A2A", primaryDark: "#1A1A1A", bg: "#111",    card: "#1E1E1E", headerText: "#FFFFFF" },
  { name: "White",  nameT: "ขาว",    primary: "#F5B800", primaryDark: "#D9A200", bg: "#F5F5F0", card: "#FFFFFF", headerText: "#1A1A1A" },
];

const lang = {
  en: {
    brand: "all Thailand", brandSub: "GOLF CLINIC",
    title: "beat the pro", subtitle: "Junior Activity Registration",
    saturday: "Beat the Pro", sunday: "Golf Demonstration", selectDay: "Select your activity",
    step1: "Kid's Profile", step2: "Parent Details", step3: "Performance & Showcase",
    kidName: "Kid's Full Name", kidNamePh: "e.g. Somchai Jaidee",
    kidDob: "Date of Birth", kidPhoto: "Kid's Photo",
    parentName: "Parent / Guardian Name", parentNamePh: "e.g. Khun Somsak Jaidee",
    parentPhone: "Phone Number", parentPhonePh: "e.g. 081 234 5678",
    scorecard: "Scorecard (image or PDF)", swingVideo: "Swing Video", introVideo: "Self-Introduction Video",
    next: "NEXT", back: "BACK", submit: "SUBMIT",
    confirm: "Registration Complete!", confirmMsg: "See you on the course!",
    errorRequired: "This field is required", errorFile: "Please upload this file",
    errorDay: "Please select at least one activity",
    colors: "Theme", registerAnother: "+ Register Another",
    event: "Activity", parent: "Parent", phone: "Phone", day: "Day(s)",
  },
  th: {
    brand: "all Thailand", brandSub: "GOLF CLINIC",
    title: "beat the pro",     subtitle: "Junior Activity Registration",
    saturday: "Beat the Pro", sunday: "Golf Demonstration", selectDay: "เลือกกิจกรรม",
    step1: "ข้อมูลเด็ก", step2: "ข้อมูลผู้ปกครอง", step3: "ผลงาน & วิดีโอ",
    kidName: "ชื่อ-นามสกุลเด็ก", kidNamePh: "เช่น สมชาย ใจดี",
    kidDob: "วันเกิด", kidPhoto: "รูปภาพเด็ก",
    parentName: "ชื่อผู้ปกครอง", parentNamePh: "เช่น คุณสมศักดิ์ ใจดี",
    parentPhone: "เบอร์โทรศัพท์", parentPhonePh: "เช่น 081 234 5678",
    scorecard: "สกอร์การ์ด (ภาพหรือ PDF)", swingVideo: "วิดีโอการสวิง", introVideo: "วิดีโอแนะนำตัว",
    next: "ถัดไป", back: "ย้อนกลับ", submit: "ส่งข้อมูล",
    confirm: "ลงทะเบียนสำเร็จ!", confirmMsg: "พบกันในสนาม!",
    errorRequired: "กรุณากรอกข้อมูล", errorFile: "กรุณาอัปโหลดไฟล์",
    errorDay: "กรุณาเลือกกิจกรรมอย่างน้อยหนึ่งรายการ",
    colors: "ธีม", registerAnother: "+ ลงทะเบียนอีกคน",
    event: "กิจกรรม", parent: "ผู้ปกครอง", phone: "โทรศัพท์", day: "วัน",
  },
};

const css = `
@keyframes fadeIn   { from{opacity:0} to{opacity:1} }
@keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeOut  { from{opacity:1;transform:scale(1)} to{opacity:0;transform:scale(0.95)} }
@keyframes popIn    { 0%{opacity:0;transform:scale(0.7)} 70%{transform:scale(1.08)} 100%{opacity:1;transform:scale(1)} }
@keyframes slideIn  { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
@keyframes breathe  { 0%{transform:scale(1);opacity:0.85} 50%{transform:scale(1.18);opacity:1} 100%{transform:scale(1);opacity:0.85} }
@keyframes btnBreathe { 0%{box-shadow:0 0 0px #F5B80000;transform:scale(1)} 50%{box-shadow:0 0 22px #F5B80099;transform:scale(1.03)} 100%{box-shadow:0 0 0px #F5B80000;transform:scale(1)} }
@keyframes shimmer  { 0%{opacity:0.6} 50%{opacity:1} 100%{opacity:0.6} }
.fade-in     { animation: fadeIn    0.4s ease both }
.fade-up     { animation: fadeUp    0.5s ease both }
.fade-out    { animation: fadeOut   0.4s ease forwards }
.pop-in      { animation: popIn     0.5s cubic-bezier(.17,.67,.35,1.2) both }
.slide-in    { animation: slideIn   0.4s ease both }
.breathe     { animation: breathe     3s ease-in-out infinite }
.btn-breathe { animation: btnBreathe  2.5s ease-in-out infinite }
.shimmer     { animation: shimmer     2s ease-in-out infinite }
input:focus  { border-color: #F5B800 !important }
`;

function Anim({ children, cls, delay, style }) {
  return (
    <div className={cls || "fade-up"} style={{ animationDelay: (delay || 0) + "s", ...(style || {}) }}>
      {children}
    </div>
  );
}

function FileUpload({ label, value, onChange, error, c }) {
  const ref = useRef();
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: "#999", display: "block", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>
        {label} <span style={{ color: "#E55" }}>*</span>
      </label>
      <div onClick={() => ref.current.click()} style={{
        border: "2px dashed " + (error ? "#E55" : value ? c.primary : "#444"),
        borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center",
        gap: 12, cursor: "pointer",
        background: value ? c.primary + "18" : "#33333360",
        transition: "all 0.25s",
      }}>
        <span style={{ fontSize: 20 }}>{value ? "✅" : "📎"}</span>
        <span style={{ fontSize: 13, color: value ? c.primary : error ? "#E55" : "#AAA", fontWeight: value ? 600 : 400 }}>
          {value ? value.name : label}
        </span>
        <input ref={ref} type="file" style={{ display: "none" }} onChange={function(e){ onChange(e.target.files[0]); }} />
      </div>
      {error && <div className="fade-in" style={{ fontSize: 12, color: "#E55", marginTop: 5 }}>⚠ {error}</div>}
    </div>
  );
}

function Input({ label, placeholder, type, value, onChange, error, c }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: "#999", display: "block", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>
        {label} <span style={{ color: "#E55" }}>*</span>
      </label>
      <input
        type={type || "text"}
        placeholder={placeholder}
        value={value}
        onChange={function(e){ onChange(e.target.value); }}
        style={{
          width: "100%", padding: "12px 14px", borderRadius: 12,
          border: "2px solid " + (error ? "#E55" : value ? c.primary : "#444"),
          fontSize: 15, background: "#33333360", color: "#FFF",
          outline: "none", boxSizing: "border-box",
        }}
      />
      {error && <div className="fade-in" style={{ fontSize: 12, color: "#E55", marginTop: 5 }}>⚠ {error}</div>}
    </div>
  );
}

export default function App() {
  var [language, setLanguage]   = useState("en");
  var [step, setStep]           = useState(-1);
  var [splashOut, setSplashOut] = useState(false);
  var [days, setDays]           = useState([]);
  var [themeIdx, setThemeIdx]   = useState(0);
  var [showTheme, setShowTheme] = useState(false);
  var [errors, setErrors]       = useState({});
  var [animKey, setAnimKey]     = useState(0);
  var [form, setForm]           = useState({
    kidName: "", kidDob: "", kidPhoto: null,
    parentName: "", parentPhone: "",
    scorecard: null, swingVideo: null, introVideo: null,
  });

  var c = THEMES[themeIdx];
  var t = lang[language];

  function setF(k, v) {
    setForm(function(f){ return Object.assign({}, f, { [k]: v }); });
    setErrors(function(e){ return Object.assign({}, e, { [k]: null }); });
  }

  function toggleDay(d) {
    setDays(function(prev){
      return prev.includes(d) ? prev.filter(function(x){ return x !== d; }) : prev.concat([d]);
    });
    setErrors(function(e){ return Object.assign({}, e, { days: null }); });
  }

  function validate(s) {
    var e = {};
    if (s === 0) {
      if (days.length === 0) e.days = t.errorDay;
    }
    if (s === 1) {
      if (!form.kidName.trim()) e.kidName  = t.errorRequired;
      if (!form.kidDob)         e.kidDob   = t.errorRequired;
      if (!form.kidPhoto)       e.kidPhoto = t.errorFile;
    }
    if (s === 2) {
      if (!form.parentName.trim())  e.parentName  = t.errorRequired;
      if (!form.parentPhone.trim()) e.parentPhone = t.errorRequired;
    }
    if (s === 3) {
      var needFiles = days.includes(t.saturday);
      if (needFiles && !form.scorecard)  e.scorecard  = t.errorFile;
      if (needFiles && !form.swingVideo) e.swingVideo = t.errorFile;
      if (needFiles && !form.introVideo) e.introVideo = t.errorFile;
    }
    return e;
  }

  function goTo(to) {
    setAnimKey(function(k){ return k + 1; });
    setStep(to);
  }

  function handleGetStarted() {
    setSplashOut(true);
    setTimeout(function(){ setSplashOut(false); goTo(0); }, 400);
  }

  function tryNext(from, to) {
    var e = validate(from);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    goTo(to);
  }

  var steps = [t.step1, t.step2, t.step3];

  var card = { background: c.card, borderRadius: 18, padding: "20px 18px", marginBottom: 16, border: "1.5px solid #3A3A3A" };
  var btnP = { flex: 1, padding: "14px", borderRadius: 12, border: "none", background: c.primary, color: c.headerText, fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: 1.5, transition: "all 0.2s" };
  var btnO = { flex: 1, padding: "14px", borderRadius: 12, border: "2px solid #555", background: "transparent", color: "#AAA", fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: 1 };

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

      {/* Header */}
      {step >= 0 && (
        <div className="fade-in" style={{ background: c.card, borderBottom: "3px solid " + c.primary, padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div onClick={function(){ goTo(-1); }} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 11, color: "#AAA", letterSpacing: 1 }}>{t.brand}</span>
                <span style={{ fontSize: 11, color: c.primary, letterSpacing: 2, fontWeight: 700 }}>{t.brandSub}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, fontStyle: "italic", color: c.primary, lineHeight: 1.1 }}>{t.title}</div>
              <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>{t.subtitle}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <div style={{ display: "flex", background: "#33333380", borderRadius: 20, overflow: "hidden", border: "1px solid #444" }}>
                {["en", "th"].map(function(l){
                  return (
                    <button key={l} onClick={function(){ setLanguage(l); }} style={{
                      padding: "5px 14px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
                      background: language === l ? c.primary : "transparent",
                      color: language === l ? c.headerText : "#888",
                      borderRadius: 20, letterSpacing: 1, transition: "all 0.2s",
                    }}>{l.toUpperCase()}</button>
                  );
                })}
              </div>
              <button onClick={function(){ setShowTheme(!showTheme); }} style={{ background: "transparent", border: "1px solid #444", borderRadius: 20, padding: "4px 10px", color: "#888", fontSize: 11, cursor: "pointer" }}>
                🎨 {t.colors}
              </button>
            </div>
          </div>

          {showTheme && (
            <div className="fade-up" style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {THEMES.map(function(th, i){
                return (
                  <button key={i} onClick={function(){ setThemeIdx(i); setShowTheme(false); }} style={{
                    background: th.primary, border: i === themeIdx ? "2px solid #FFF" : "2px solid transparent",
                    borderRadius: 20, padding: "5px 14px", color: th.headerText, fontSize: 12, cursor: "pointer", fontWeight: 700,
                  }}>{language === "th" ? th.nameT : th.name}</button>
                );
              })}
            </div>
          )}

          {step > 0 && step < 4 && (
            <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
              {steps.map(function(s, i){
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0,
                        background: i + 1 <= step ? c.primary : "#333",
                        color: i + 1 <= step ? c.headerText : "#666",
                        border: i + 1 === step ? "2px solid " + c.primary : "2px solid transparent",
                        transition: "all 0.3s",
                      }}>{i + 1 < step ? "✓" : i + 1}</div>
                      <span style={{ fontSize: 10, color: i + 1 <= step ? c.primary : "#555", letterSpacing: 0.5 }}>{s}</span>
                    </div>
                    {i < 2 && <div style={{ flex: 1, height: 1.5, background: i + 1 < step ? c.primary : "#333", margin: "0 8px", transition: "background 0.4s" }} />}
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

          {/* Day Select */}
          {step === 0 && (
            <div key={animKey} className="slide-in">
              <div style={{ fontSize: 13, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>• {t.selectDay} •</div>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 16 }}>Select one or both</div>
              {[t.saturday, t.sunday].map(function(d, idx){
                var sel = days.includes(d);
                return (
                  <Anim key={d} cls="fade-up" delay={idx * 0.1}>
                    <div onClick={function(){ toggleDay(d); }} style={Object.assign({}, card, {
                      border: "2px solid " + (sel ? c.primary : "#3A3A3A"),
                      display: "flex", alignItems: "center", gap: 16, cursor: "pointer",
                      background: sel ? c.primary + "18" : c.card,
                      transform: sel ? "scale(1.01)" : "scale(1)", transition: "all 0.2s",
                    })}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: sel ? c.primary : "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, transition: "all 0.2s" }}>⛳</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: sel ? c.primary : "#EEE" }}>{d}</div>
                        <div style={{ fontSize: 12, color: "#777", letterSpacing: 1 }}>JUNIOR ACTIVITY · all Thailand GOLF TOUR</div>
                      </div>
                      {sel && <span className="pop-in" style={{ color: c.primary, fontSize: 22, fontWeight: 900 }}>✓</span>}
                    </div>
                  </Anim>
                );
              })}
              {errors.days && <div className="fade-in" style={{ fontSize: 12, color: "#E55", marginTop: 4 }}>⚠ {errors.days}</div>}
              <Anim cls="fade-up" delay={0.2}>
                <button style={Object.assign({}, btnP, { width: "100%", marginTop: 8 })} onClick={function(){ tryNext(0, 1); }}>{t.next} →</button>
              </Anim>
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div key={animKey} className="slide-in">
              <div style={card}>
                <div style={{ fontSize: 13, color: c.primary, letterSpacing: 2, fontWeight: 700, marginBottom: 16 }}>⛳ {t.step1.toUpperCase()}</div>
                <Input label={t.kidName} placeholder={t.kidNamePh} value={form.kidName} onChange={function(v){ setF("kidName", v); }} error={errors.kidName} c={c} />
                <Input label={t.kidDob} type="date" value={form.kidDob} onChange={function(v){ setF("kidDob", v); }} error={errors.kidDob} c={c} />
                <FileUpload label={t.kidPhoto} value={form.kidPhoto} onChange={function(v){ setF("kidPhoto", v); }} error={errors.kidPhoto} c={c} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={btnO} onClick={function(){ goTo(0); }}>← {t.back}</button>
                <button style={btnP} onClick={function(){ tryNext(1, 2); }}>{t.next} →</button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div key={animKey} className="slide-in">
              <div style={card}>
                <div style={{ fontSize: 13, color: c.primary, letterSpacing: 2, fontWeight: 700, marginBottom: 16 }}>👨‍👧 {t.step2.toUpperCase()}</div>
                <Input label={t.parentName} placeholder={t.parentNamePh} value={form.parentName} onChange={function(v){ setF("parentName", v); }} error={errors.parentName} c={c} />
                <Input label={t.parentPhone} placeholder={t.parentPhonePh} type="tel" value={form.parentPhone} onChange={function(v){ setF("parentPhone", v); }} error={errors.parentPhone} c={c} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={btnO} onClick={function(){ goTo(1); }}>← {t.back}</button>
                <button style={btnP} onClick={function(){ tryNext(2, 3); }}>{t.next} →</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div key={animKey} className="slide-in">
              <div style={card}>
                <div style={{ fontSize: 13, color: c.primary, letterSpacing: 2, fontWeight: 700, marginBottom: 16 }}>🏆 {t.step3.toUpperCase()}</div>
                {days.includes(t.saturday) ? (
                  <div>
                    <FileUpload label={t.scorecard} value={form.scorecard} onChange={function(v){ setF("scorecard", v); }} error={errors.scorecard} c={c} />
                    <FileUpload label={t.swingVideo} value={form.swingVideo} onChange={function(v){ setF("swingVideo", v); }} error={errors.swingVideo} c={c} />
                    <FileUpload label={t.introVideo} value={form.introVideo} onChange={function(v){ setF("introVideo", v); }} error={errors.introVideo} c={c} />
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px 0", color: "#666", fontSize: 13 }}>
                    No files required for Golf Demonstration 🏌️
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={btnO} onClick={function(){ goTo(2); }}>← {t.back}</button>
                <button style={Object.assign({}, btnP, { flex: 2 })} onClick={function(){ tryNext(3, 4); }}>{t.submit} ✓</button>
              </div>
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
                <div style={{ fontSize: 14, color: "#888", letterSpacing: 2, marginBottom: 24 }}>{t.confirmMsg}</div>
              </Anim>
              <Anim cls="fade-up" delay={0.45}>
                <div style={card}>
                  {[
                    [t.event, days.join(" & ")],
                    [t.parent, form.parentName],
                    [t.phone, form.parentPhone],
                  ].map(function(row){
                    return (
                      <div key={row[0]} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderBottom: "1px solid #333", padding: "10px 0" }}>
                        <span style={{ color: "#888", letterSpacing: 1, textTransform: "uppercase", fontSize: 11 }}>{row[0]}</span>
                        <span style={{ color: "#EEE", fontWeight: 600 }}>{row[1]}</span>
                      </div>
                    );
                  })}
                </div>
              </Anim>
              <Anim cls="fade-up" delay={0.6}>
                <button style={Object.assign({}, btnP, { width: "100%", marginTop: 8 })} onClick={function(){
                  goTo(0);
                  setDays([]);
                  setForm({ kidName: "", kidDob: "", kidPhoto: null, parentName: "", parentPhone: "", scorecard: null, swingVideo: null, introVideo: null });
                  setErrors({});
                }}>{t.registerAnother}</button>
              </Anim>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
