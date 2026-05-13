// 📌 Replace with your deployed Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxecUo46G59GJehatBmB9n-Npy8OFdF84M3FFo9Q7wy_fvvRnleQH562X3tjT1C3QxRnA/exec";

// Converts a File object to base64 string
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]); // strip data:...;base64,
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Add this state inside your App() component:
// const [uploadProgress, setUploadProgress] = useState(0);

async function submitToSheet() {
  const e = validate(3);
  if (Object.keys(e).length > 0) { setErrors(e); return; }
  setErrors({});
  setSubmitting(true);
  setSubmitError("");

  const f = formRef.current;
  const d = daysRef.current;

  try {
    setUploadProgress(10);

    // Convert files to base64
    const [photoB64, scorecardB64, swingB64, introB64] = await Promise.all([
      f.kidPhoto   ? fileToBase64(f.kidPhoto)   : Promise.resolve(""),
      f.scorecard  ? fileToBase64(f.scorecard)  : Promise.resolve(""),
      f.swingVideo ? fileToBase64(f.swingVideo) : Promise.resolve(""),
      f.introVideo ? fileToBase64(f.introVideo) : Promise.resolve(""),
    ]);

    setUploadProgress(40);

    // Build form data
    const params = new URLSearchParams({
      activity:      d.join(" & "),
      kidNameEN:     f.kidNameEN,
      kidNameTH:     f.kidNameTH,
      kidAge:        f.kidAge,
      kidGender:     f.kidGender,
      kidGolfExp:    f.kidGolfExp,
      kidAcadYear:   f.kidAcadYear,
      kidSchool:     f.kidSchool,
      kidProvince:   f.kidProvince,
      kidCert:       f.kidCert,
      parentName:    f.parentName,
      parentPhone:   f.parentPhone,
      parentEmail:   f.parentEmail,
      photoData:     photoB64,
      photoName:     f.kidPhoto?.name || "",
      scorecardData: scorecardB64,
      scorecardName: f.scorecard?.name || "",
      swingData:     swingB64,
      swingName:     f.swingVideo?.name || "",
      introData:     introB64,
      introName:     f.introVideo?.name || "",
    });

    setUploadProgress(60);

    // POST to Apps Script
    await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    setUploadProgress(100);
    setTimeout(() => {
      setSubmitting(false);
      setUploadProgress(0);
      goTo(4);
    }, 500);

  } catch (err) {
    console.error(err);
    setSubmitError(t.networkError);
    setSubmitting(false);
    setUploadProgress(0);
  }
}

// Progress bar UI — paste this just above the submit button in Step 3:
{submitting && (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: c.textSub, marginBottom: 4 }}>
      <span>Uploading files...</span>
      <span>{uploadProgress}%</span>
    </div>
    <div style={{ height: 6, borderRadius: 6, background: c.border }}>
      <div style={{ height: 6, borderRadius: 6, background: c.primary, width: uploadProgress + "%", transition: "width 0.4s ease" }} />
    </div>
  </div>
)}
