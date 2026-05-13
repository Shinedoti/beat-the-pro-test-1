import { useState, useRef } from "react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRIDLVH-ug5i4o2SRiqMZOicrkN-EsEAA69dAR66lxsIqDK8IVLDpMD_efGjhvTRUn9A/exec";

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

function Anim(props) {
  return React.createElement("div", { className: props.cls || "fade-up", style: Object.assign({ animationDelay: (props.delay || 0) + "s" }, props.style || {}) }, props.children);
}

function DetailLine(props) {
  return React.createElement("div", { style: { display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 } },
    React.createElement("span", { style: { color: "#F5B800", fontSize: 14, marginTop: 1, flexShrink: 0 } }, "•"),
    React.createElement("span", { style: { fontSize: 13, color: props.color, lineHeight: 1.5 } },
      props.item.text,
      props.item.bold ? React.createElement("strong", null, props.item.bold) : null,
      props.item.after || ""
    )
  );
}

function SectionDivider(props) {
  return React.createElement("div", { style: { fontSize: 10, color: props.c.primary, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 12, marginTop: 8, paddingBottom: 6, borderBottom: "1px solid " + props.c.primary + "44" } }, props.label);
}

function Input(props) {
  return React.createElement("div", { style: { marginBottom: 14 } },
    React.createElement("label", { style: { fontSize: 12, color: props.c.textSub, display: "block", marginBottom: 6 } },
      props.label, " ", React.createElement("span", { style: { color: "#E55" } }, "*")
    ),
    React.createElement("input", {
      type: props.type || "text",
      placeholder: props.placeholder,
      value: props.value,
      onChange: function(e) { props.onChange(e.target.value); },
      style: {
        width: "100%", padding: "12px 14px", borderRadius: 12,
        border: "2px solid " + (props.error ? "#E55" : props.value ? props.c.primary : props.c.border),
        fontSize: 15, background: "rgba(128,128,128,0.08)", color: props.c.textMain,
        outline: "none", boxSizing: "border-box",
      }
    }),
    props.error ? React.createElement("div", { className: "fade-in", style: { fontSize: 12, color: "#E55", marginTop: 5 } }, "⚠ " + props.error) : null
  );
}

function TwoCol(props) {
  return React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } }, props.children);
}

function ChoiceSelect(props) {
  return React.createElement("div", { style: { marginBottom: 14 } },
    React.createElement("label", { style: { fontSize: 12, color: props.c.textSub, display: "block", marginBottom: 8 } },
      props.label, " ", React.createElement("span", { style: { color: "#E55" } }, "*")
    ),
    React.createElement("div", { style: { display: "flex", gap: 8 } },
      props.options.map(function(opt) {
        var sel = props.value === opt.value;
        return React.createElement("div", {
          key: opt.value,
          onClick: function() { props.onChange(opt.value); },
          style: {
            flex: 1, padding: "10px 6px", borderRadius: 12, cursor: "pointer", textAlign: "center",
            border: "2px solid " + (sel ? props.c.primary : props.error ? "#E55" : props.c.border),
            background: sel ? props.c.primary + "18" : "rgba(128,128,128,0.08)", transition: "all 0.2s",
          }
        },
          opt.icon ? React.createElement("div", { style: { fontSize: 18, marginBottom: 4 } }, opt.icon) : null,
          React.createElement("div", { style: { fontSize: 12, fontWeight: sel ? 700 : 400, color: sel ? props.c.primary : props.c.textMain, lineHeight: 1.3 } }, opt.label)
        );
      })
    ),
    props.error ? React.createElement("div", { className: "fade-in", style: { fontSize: 12, color: "#E55", marginTop: 5 } }, "⚠ " + props.error) : null
  );
}

function FileUpload(props) {
  var ref = useRef();
  return React.createElement("div", { style: { marginBottom: 14 } },
    React.createElement("label", { style: { fontSize: 12, color: props.c.textSub, display: "block", marginBottom: 6 } },
      props.label, " ", React.createElement("span", { style: { color: "#E55" } }, "*"),
      props.videoOnly ? React.createElement("span", { style: { color: props.c.primary, marginLeft: 6, fontSize: 10 } }, "(video only)") : null
    ),
    React.createElement("div", {
      onClick: function() { ref.current.click(); },
      style: {
        border: "2px dashed " + (props.error ? "#E55" : props.value ? props.c.primary : props.c.border),
        borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center",
        gap: 12, cursor: "pointer", background: props.value ? props.c.primary + "18" : "rgba(128,128,128,0.08)", transition: "all 0.25s",
      }
    },
      React.createElement("span", { style: { fontSize: 20 } }, props.value ? "✅" : props.videoOnly ? "🎬" : "📎"),
      React.createElement("span", { style: { fontSize: 13, color: props.value ? props.c.primary : props.error ? "#E55" : props.c.textSub, fontWeight: props.value ? 600 : 400 } },
        props.value ? props.value.name : props.label
      ),
      React.createElement("input", { ref: ref, type: "file", accept: props.videoOnly ? "video/*" : "*/*", style: { display: "none" }, onChange: function(e) { props.onChange(e.target.files[0]); } })
    ),
    props.error ? React.createElement("div", { className: "fade-in", style: { fontSize: 12, color: "#E55", marginTop: 5 } }, "⚠ " + props.error) : null
  );
}

export default function App() {
  var s = useState; // shorthand
  var language        = s("en");       var setLanguage       = language[1]; language       = language[0];
  var step            = s(-1);         var setStep           = step[1];     step           = step[0];
  var splashOut       = s(false);      var setSplashOut      = splashOut[1];splashOut      = splashOut[0];
  var showLangPicker  = s(false);      var setShowLangPicker = showLangPicker[1]; showLangPicker = showLangPicker[0];
  var days            = s([]);         var setDays           = days[1];     days           = days[0];
  var themeIdx        = s(0);          var setThemeIdx       = themeIdx[1]; themeIdx       = themeIdx[0];
  var showTheme       = s(false);      var setShowTheme      = showTheme[1];showTheme      = showTheme[0];
  var errors          = s({});         var setErrors         = errors[1];   errors         = errors[0];
  var animKey         = s(0);          var setAnimKey        = animKey[1];  animKey        = animKey[0];
  var submitting      = s(false);      var setSubmitting     = submitting[1];submitting    = submitting[0];
  var submitError     = s("");         var setSubmitError    = submitError[1];submitError  = submitError[0];
  var form            = s({
    kidNameEN: "", kidNameTH: "", kidAge: "", kidGender: "",
    kidGolfExp: "", kidAcadYear: "", kidSchool: "", kidProvince: "",
    kidCert: "", kidPhoto: null,
    parentName: "", parentPhone: "", parentEmail: "",
    scorecard: null, swingVideo: null, introVideo: null,
  });
  var setForm = form[1]; form = form[0];

  var formRef = useRef(form);
  formRef.current = form;
  var daysRef = useRef(days);
  daysRef.current = days;

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

  function validate(st) {
    var e = {};
    if (st === 0 && days.length === 0) e.days = t.errorDay;
    if (st === 1) {
      if (!form.kidNameEN.trim())   e.kidNameEN  = t.errorRequired;
      if (!form.kidNameTH.trim())   e.kidNameTH  = t.errorRequired;
      if (!form.kidAge.trim())      e.kidAge     = t.errorRequired;
      if (!form.kidGender)          e.kidGender  = t.errorGender;
      if (!form.kidGolfExp.trim())  e.kidGolfExp = t.errorRequired;
      if (!form.kidAcadYear.trim()) e.kidAcadYear= t.errorRequired;
      if (!form.kidSchool.trim())   e.kidSchool  = t.errorRequired;
      if (!form.kidProvince.trim()) e.kidProvince= t.errorRequired;
      if (!form.kidCert)            e.kidCert    = t.errorCert;
      if (!form.kidPhoto)           e.kidPhoto   = t.errorFile;
    }
    if (st === 2) {
      if (!form.parentName.trim())  e.parentName  = t.errorRequired;
      if (!form.parentPhone.trim()) e.parentPhone = t.errorRequired;
      if (!form.parentEmail.trim()) e.parentEmail = t.errorRequired;
    }
    if (st === 3) {
      var need = days.includes(t.saturday);
      if (need && !form.scorecard)  e.scorecard  = t.errorFile;
      if (need && !form.swingVideo) e.swingVideo = t.errorFile;
      if (need && !form.introVideo) e.introVideo = t.errorFile;
    }
    return e;
  }

  function goTo(to) { setAnimKey(function(k) { return k + 1; }); setStep(to); }

  function handleGetStarted() {
    setSplashOut(true);
    setTimeout(function() { setSplashOut(false); setShowLangPicker(true); }, 400);
  }

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

    var f = formRef.current;
    var d = daysRef.current;

    var url = SCRIPT_URL
      + "?activity="    + encodeURIComponent(d.join(" & "))
      + "&kidNameEN="   + encodeURIComponent(f.kidNameEN)
      + "&kidNameTH="   + encodeURIComponent(f.kidNameTH)
      + "&kidAge="      + encodeURIComponent(f.kidAge)
      + "&kidGender="   + encodeURIComponent(f.kidGender)
      + "&kidGolfExp="  + encodeURIComponent(f.kidGolfExp)
      + "&kidAcadYear=" + encodeURIComponent(f.kidAcadYear)
      + "&kidSchool="   + encodeURIComponent(f.kidSchool)
      + "&kidProvince=" + encodeURIComponent(f.kidProvince)
      + "&kidCert="     + encodeURIComponent(f.kidCert)
      + "&parentName="  + encodeURIComponent(f.parentName)
      + "&parentPhone=" + encodeURIComponent(f.parentPhone)
      + "&parentEmail=" + encodeURIComponent(f.parentEmail);

    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    setTimeout(function() {
      document.body.removeChild(iframe);
      setSubmitting(false);
      goTo(4);
    }, 4000);
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

  var ukFlag = React.createElement("svg", { viewBox: "0 0 60 40", width: "72", height: "48", style: { borderRadius: 6, display: "block" } },
    React.createElement("rect", { width: "60", height: "40", fill: "#012169" }),
    React.createElement("path", { d: "M0,0 L60,40 M60,0 L0,40", stroke: "#fff", strokeWidth: "8" }),
    React.createElement("path", { d: "M0,0 L60,40 M60,0 L0,40", stroke: "#C8102E", strokeWidth: "5" }),
    React.createElement("path", { d: "M30,0 V40 M0,20 H60", stroke: "#fff", strokeWidth: "12" }),
    React.createElement("path", { d: "M30,0 V40 M0,20 H60", stroke: "#C8102E", strokeWidth: "7" })
  );
  var thFlag = React.createElement("svg", { viewBox: "0 0 60 40", width: "72", height: "48", style: { borderRadius: 6, display: "block" } },
    React.createElement("rect", { width: "60", height: "40", fill: "#A51931" }),
    React.createElement("rect", { y: "6.67", width: "60", height: "26.67", fill: "#F4F5F8" }),
    React.createElement("rect", { y: "13.33", width: "60", height: "13.33", fill: "#2D2A4A" })
  );

  return React.createElement("div", { style: { background: c.bg, minHeight: "100vh", fontFamily: "Arial,sans-serif" } },
    React.createElement("style", null, css),

    // Splash
    step === -1 && React.createElement("div", { className: splashOut ? "fade-out" : "fade-in", style: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" } },
      React.createElement(Anim, { cls: "pop-in", delay: 0.1 },
        React.createElement("div", { className: "breathe", style: { fontSize: 72, marginBottom: 24 } }, "⛳")
      ),
      React.createElement(Anim, { cls: "fade-up", delay: 0.3 },
        React.createElement("div", { style: { fontSize: 11, color: "#AAA", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 } }, t.brand, " ", React.createElement("span", { style: { color: c.primary } }, t.brandSub)),
        React.createElement("div", { style: { fontSize: 38, fontWeight: 900, fontStyle: "italic", color: c.primary, lineHeight: 1.1, marginBottom: 8 } }, t.title),
        React.createElement("div", { style: { fontSize: 11, color: "#666", letterSpacing: 2, textTransform: "uppercase", marginBottom: 48 } }, t.subtitle)
      ),
      React.createElement(Anim, { cls: "fade-up", delay: 0.5, style: { width: "100%", maxWidth: 360 } },
        React.createElement("button", { className: "btn-breathe", style: Object.assign({}, btnP, { width: "100%", fontSize: 16, padding: "18px", letterSpacing: 4, borderRadius: 14 }), onClick: handleGetStarted }, "GET STARTED")
      ),
      React.createElement(Anim, { cls: "fade-up", delay: 0.7 },
        React.createElement("div", { className: "shimmer", style: { fontSize: 12, color: "#555", marginTop: 24, letterSpacing: 1 } }, "all Thailand Golf Tour")
      )
    ),

    // Lang Picker
    showLangPicker && React.createElement("div", { className: "fade-in", style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 } },
      React.createElement("div", { className: "pop-in", style: { background: c.card, borderRadius: 24, padding: "36px 32px", textAlign: "center", width: 300, border: "2px solid " + c.primary } },
        React.createElement("div", { style: { fontSize: 13, color: c.primary, letterSpacing: 3, fontWeight: 700, marginBottom: 6, textTransform: "uppercase" } }, "Choose Language"),
        React.createElement("div", { style: { fontSize: 12, color: "#888", marginBottom: 28 } }, "เลือกภาษา"),
        React.createElement("div", { style: { display: "flex", gap: 20, justifyContent: "center" } },
          [{ code: "en", label: "English", sublabel: "อังกฤษ", flag: ukFlag }, { code: "th", label: "ภาษาไทย", sublabel: "Thai", flag: thFlag }].map(function(opt) {
            var sel = language === opt.code;
            return React.createElement("div", { key: opt.code, className: "hover-flag", onClick: function() { selectLanguage(opt.code); }, style: { cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "14px 18px", borderRadius: 16, border: "2px solid " + (sel ? c.primary : "transparent"), background: sel ? c.primary + "18" : "transparent", transition: "all 0.2s" } },
              React.createElement("div", { style: { boxShadow: "0 2px 8px rgba(0,0,0,0.25)", borderRadius: 6 } }, opt.flag),
              React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: sel ? c.primary : c.textMain } }, opt.label),
              React.createElement("div", { style: { fontSize: 11, color: "#888" } }, opt.sublabel)
            );
          })
        )
      )
    ),

    // Header
    step >= 0 && React.createElement("div", { className: "fade-in", style: { background: c.card, borderBottom: "3px solid " + c.primary, padding: "16px 20px" } },
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
        React.createElement("div", { onClick: function() { goTo(-1); }, style: { cursor: "pointer" } },
          React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 4 } },
            React.createElement("span", { style: { fontSize: 11, color: "#AAA", letterSpacing: 1 } }, t.brand),
            React.createElement("span", { style: { fontSize: 11, color: c.primary, letterSpacing: 2, fontWeight: 700 } }, t.brandSub)
          ),
          React.createElement("div", { style: { fontSize: 26, fontWeight: 900, fontStyle: "italic", color: c.primary, lineHeight: 1.1 } }, t.title),
          React.createElement("div", { style: { fontSize: 11, color: c.textSub, letterSpacing: 2, textTransform: "uppercase", marginTop: 2 } }, t.subtitle)
        ),
        React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 } },
          React.createElement("div", { style: { display: "flex", background: "rgba(128,128,128,0.15)", borderRadius: 20, overflow: "hidden", border: "1px solid " + c.border } },
            ["en", "th"].map(function(l) {
              return React.createElement("button", { key: l, onClick: function() { setLanguage(l); }, style: { padding: "5px 14px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: language === l ? c.primary : "transparent", color: language === l ? c.headerText : c.textSub, borderRadius: 20, letterSpacing: 1, transition: "all 0.2s" } }, l.toUpperCase());
            })
          ),
          React.createElement("button", { onClick: function() { setShowTheme(!showTheme); }, style: { background: "transparent", border: "1px solid " + c.border, borderRadius: 20, padding: "4px 10px", color: c.textSub, fontSize: 11, cursor: "pointer" } }, "🎨 " + t.colors)
        )
      ),
      showTheme && React.createElement("div", { className: "fade-up", style: { display: "flex", gap: 8, marginTop: 12 } },
        THEMES.map(function(th, i) {
          return React.createElement("button", { key: i, onClick: function() { setThemeIdx(i); setShowTheme(false); }, style: { background: th.primary, border: i === themeIdx ? "2px solid " + (i === 0 ? "#333" : "#FFF") : "2px solid transparent", borderRadius: 20, padding: "5px 14px", color: th.headerText, fontSize: 12, cursor: "pointer", fontWeight: 700 } }, language === "th" ? th.nameT : th.name);
        })
      ),
      step > 0 && step < 4 && React.createElement("div", { style: { display: "flex", alignItems: "center", marginTop: 16 } },
        steps.map(function(s, i) {
          return React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } },
              React.createElement("div", { style: { width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, background: i + 1 <= step ? c.primary : (c.bg === "#F5F5F0" ? "#DDD" : "#333"), color: i + 1 <= step ? c.headerText : c.textSub, border: i + 1 === step ? "2px solid " + c.primary : "2px solid transparent", transition: "all 0.3s" } }, i + 1 < step ? "✓" : i + 1),
              React.createElement("span", { style: { fontSize: 10, color: i + 1 <= step ? c.primary : c.textSub, letterSpacing: 0.5 } }, s)
            ),
            i < 2 && React.createElement("div", { style: { flex: 1, height: 1.5, background: i + 1 < step ? c.primary : c.border, margin: "0 8px", transition: "background 0.4s" } })
          );
        })
      )
    ),

    // Body
    step >= 0 && React.createElement("div", { style: { padding: "20px 16px", maxWidth: 480, margin: "0 auto" } },

      // Step 0
      step === 0 && React.createElement("div", { key: animKey, className: "slide-in" },
        React.createElement("div", { style: { fontSize: 13, color: c.textSub, letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 } }, "• " + t.selectDay + " •"),
        React.createElement("div", { style: { fontSize: 11, color: c.textSub, marginBottom: 16 } }, t.selectHint),
        [{ label: t.saturday, details: SAT_DETAILS }, { label: t.sunday, details: SUN_DETAILS }].map(function(item, idx) {
          var sel = days.includes(item.label);
          return React.createElement(Anim, { key: item.label, cls: "fade-up", delay: idx * 0.1 },
            React.createElement("div", { className: "hover-card", onClick: function() { toggleDay(item.label); }, style: { background: sel ? c.primary + "14" : c.card, borderRadius: 18, marginBottom: 14, cursor: "pointer", border: "2px solid " + (sel ? c.primary : c.border), overflow: "hidden", transition: "all 0.25s" } },
              React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16, padding: "16px 18px" } },
                React.createElement("div", { style: { width: 48, height: 48, borderRadius: "50%", background: sel ? c.primary : (c.bg === "#F5F5F0" ? "#EEE" : "#333"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, transition: "all 0.2s" } }, "⛳"),
                React.createElement("div", { style: { flex: 1 } },
                  React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: sel ? c.primary : c.textMain } }, item.label),
                  React.createElement("div", { style: { fontSize: 11, color: c.textSub, letterSpacing: 1 } }, "JUNIOR ACTIVITY · all Thailand GOLF TOUR")
                ),
                React.createElement("div", { style: { fontSize: 20, color: c.primary, fontWeight: 900 } }, sel ? "✓" : "+")
              ),
              sel && React.createElement("div", { className: "expand-in", style: { borderTop: "1px solid " + c.primary + "44", padding: "14px 18px 16px" } },
                item.details.map(function(d, i) { return React.createElement(DetailLine, { key: i, item: d, color: c.textMain }); })
              )
            )
          );
        }),
        errors.days && React.createElement("div", { className: "fade-in", style: { fontSize: 12, color: "#E55", marginBottom: 10 } }, "⚠ " + errors.days),
        React.createElement("button", { style: Object.assign({}, btnP, { width: "100%" }), onClick: function() { tryNext(0, 1); } }, t.next + " →")
      ),

      // Step 1
      step === 1 && React.createElement("div", { key: animKey, className: "slide-in" },
        React.createElement("div", { style: cardStyle },
          React.createElement("div", { style: { fontSize: 13, color: c.primary, letterSpacing: 2, fontWeight: 700, marginBottom: 12 } }, "⛳ " + t.step1.toUpperCase()),
          React.createElement(SectionDivider, { label: "Name", c: c }),
          React.createElement(Input, { label: t.kidNameEN, placeholder: t.kidNameENPh, value: form.kidNameEN, onChange: function(v) { setF("kidNameEN", v); }, error: errors.kidNameEN, c: c }),
          React.createElement(Input, { label: t.kidNameTH, placeholder: t.kidNameTHPh, value: form.kidNameTH, onChange: function(v) { setF("kidNameTH", v); }, error: errors.kidNameTH, c: c }),
          React.createElement(SectionDivider, { label: "Personal Info", c: c }),
          React.createElement(TwoCol, null,
            React.createElement(Input, { label: t.kidAge, placeholder: t.kidAgePh, type: "number", value: form.kidAge, onChange: function(v) { setF("kidAge", v); }, error: errors.kidAge, c: c }),
            React.createElement(Input, { label: t.kidGolfExp, placeholder: t.kidGolfExpPh, type: "number", value: form.kidGolfExp, onChange: function(v) { setF("kidGolfExp", v); }, error: errors.kidGolfExp, c: c })
          ),
          React.createElement(ChoiceSelect, { label: t.gender, value: form.kidGender, onChange: function(v) { setF("kidGender", v); }, error: errors.kidGender, c: c, options: genderOpts }),
          React.createElement(SectionDivider, { label: "Academic Info", c: c }),
          React.createElement(TwoCol, null,
            React.createElement(Input, { label: t.kidAcadYear, placeholder: t.kidAcadYearPh, value: form.kidAcadYear, onChange: function(v) { setF("kidAcadYear", v); }, error: errors.kidAcadYear, c: c }),
            React.createElement(Input, { label: t.kidProvince, placeholder: t.kidProvincePh, value: form.kidProvince, onChange: function(v) { setF("kidProvince", v); }, error: errors.kidProvince, c: c })
          ),
          React.createElement(Input, { label: t.kidSchool, placeholder: t.kidSchoolPh, value: form.kidSchool, onChange: function(v) { setF("kidSchool", v); }, error: errors.kidSchool, c: c }),
          React.createElement(SectionDivider, { label: "Certificate", c: c }),
          React.createElement(ChoiceSelect, { label: t.kidCert, value: form.kidCert, onChange: function(v) { setF("kidCert", v); }, error: errors.kidCert, c: c, options: certOpts }),
          React.createElement(SectionDivider, { label: "Photo", c: c }),
          React.createElement(FileUpload, { label: t.kidPhoto, value: form.kidPhoto, onChange: function(v) { setF("kidPhoto", v); }, error: errors.kidPhoto, c: c })
        ),
        React.createElement("div", { style: { display: "flex", gap: 10 } },
          React.createElement("button", { style: btnO, onClick: function() { goTo(0); } }, "← " + t.back),
          React.createElement("button", { style: btnP, onClick: function() { tryNext(1, 2); } }, t.next + " →")
        )
      ),

      // Step 2
      step === 2 && React.createElement("div", { key: animKey, className: "slide-in" },
        React.createElement("div", { style: cardStyle },
          React.createElement("div", { style: { fontSize: 13, color: c.primary, letterSpacing: 2, fontWeight: 700, marginBottom: 16 } }, "👨‍👧 " + t.step2.toUpperCase()),
          React.createElement(Input, { label: t.parentName, placeholder: t.parentNamePh, value: form.parentName, onChange: function(v) { setF("parentName", v); }, error: errors.parentName, c: c }),
          React.createElement(Input, { label: t.parentPhone, placeholder: t.parentPhonePh, type: "tel", value: form.parentPhone, onChange: function(v) { setF("parentPhone", v); }, error: errors.parentPhone, c: c }),
          React.createElement(Input, { label: t.parentEmail, placeholder: t.parentEmailPh, type: "email", value: form.parentEmail, onChange: function(v) { setF("parentEmail", v); }, error: errors.parentEmail, c: c })
        ),
        React.createElement("div", { style: { display: "flex", gap: 10 } },
          React.createElement("button", { style: btnO, onClick: function() { goTo(1); } }, "← " + t.back),
          React.createElement("button", { style: btnP, onClick: function() { tryNext(2, 3); } }, t.next + " →")
        )
      ),

      // Step 3
      step === 3 && React.createElement("div", { key: animKey, className: "slide-in" },
        React.createElement("div", { style: cardStyle },
          React.createElement("div", { style: { fontSize: 13, color: c.primary, letterSpacing: 2, fontWeight: 700, marginBottom: 16 } }, "🏆 " + t.step3.toUpperCase()),
          days.includes(t.saturday)
            ? React.createElement("div", null,
                React.createElement(FileUpload, { label: t.scorecard,  value: form.scorecard,  onChange: function(v) { setF("scorecard", v); },  error: errors.scorecard,  c: c }),
                React.createElement(FileUpload, { label: t.swingVideo, value: form.swingVideo, onChange: function(v) { setF("swingVideo", v); }, error: errors.swingVideo, c: c, videoOnly: true }),
                React.createElement(FileUpload, { label: t.introVideo, value: form.introVideo, onChange: function(v) { setF("introVideo", v); }, error: errors.introVideo, c: c, videoOnly: true })
              )
            : React.createElement("div", { style: { textAlign: "center", padding: "20px 0", color: c.textSub, fontSize: 13 } }, t.noFiles)
        ),
        React.createElement("div", { style: { display: "flex", gap: 10 } },
          React.createElement("button", { style: btnO, onClick: function() { goTo(2); } }, "← " + t.back),
          React.createElement("button", { style: Object.assign({}, btnP, { flex: 2, opacity: submitting ? 0.7 : 1 }), onClick: submitToSheet, disabled: submitting },
            submitting ? "⏳ " + t.submitting : t.submit + " ✓"
          )
        ),
        submitError && React.createElement("div", { className: "fade-in", style: { fontSize: 12, color: "#E55", marginTop: 10, textAlign: "center" } }, "⚠ " + submitError)
      ),

      // Confirm
      step === 4 && React.createElement("div", { key: animKey, style: { textAlign: "center" } },
        React.createElement(Anim, { cls: "pop-in", delay: 0.1 },
          React.createElement("div", { style: { width: 80, height: 80, borderRadius: "50%", background: c.primary, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38 } }, "⛳")
        ),
        React.createElement(Anim, { cls: "fade-up", delay: 0.3 },
          React.createElement("div", { style: { fontSize: 24, fontWeight: 900, fontStyle: "italic", color: c.primary, marginBottom: 6 } }, t.confirm),
          React.createElement("div", { style: { fontSize: 14, color: c.textSub, letterSpacing: 2, marginBottom: 24 } }, t.confirmMsg)
        ),
        React.createElement(Anim, { cls: "fade-up", delay: 0.45 },
          React.createElement("div", { style: cardStyle },
            [
              [t.activityLabel, days.join(" & ")],
              ["Name (EN)", form.kidNameEN],
              ["Name (TH)", form.kidNameTH],
              ["Age", form.kidAge],
              ["School", form.kidSchool],
              [t.parentLabel, form.parentName],
              [t.phoneLabel, form.parentPhone],
            ].map(function(row) {
              return React.createElement("div", { key: row[0], style: { display: "flex", justifyContent: "space-between", fontSize: 13, borderBottom: "1px solid " + c.border, padding: "10px 0" } },
                React.createElement("span", { style: { color: c.textSub, letterSpacing: 1, textTransform: "uppercase", fontSize: 11 } }, row[0]),
                React.createElement("span", { style: { color: c.textMain, fontWeight: 600 } }, row[1])
              );
            })
          )
        ),
        React.createElement(Anim, { cls: "fade-up", delay: 0.6 },
          React.createElement("button", { style: Object.assign({}, btnP, { width: "100%", marginTop: 8 }), onClick: resetForm }, t.registerAnother)
        )
      )
    )
  );
}
