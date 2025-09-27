import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import './App.css';
import './LoginPage.css'; // Make sure to import the new CSS
import {
  LuLayoutDashboard, LuSearch, LuFileText, LuBookOpen, LuUser, LuMessageSquare,
  LuBell, LuGlobe, LuPlus, LuBriefcase, LuTrendingUp, LuTarget, LuFilePlus,
  LuCircleCheck, LuCircle, LuBuilding2, LuX, LuMapPin, LuDollarSign,
  LuBot, LuSend, LuCircleUserRound, LuMenu, LuHistory
} from 'react-icons/lu';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Translation Data ---
const translations = {
    nav: {
        dashboard: { EN: "Dashboard", HI: "डैशबोर्ड" },
        findInternships: { EN: "Find Internships", HI: "इंटर्नशिप खोजें" },
        myApplications: { EN: "My Applications", HI: "मेरे आवेदन" },
        prepCourses: { EN: "Prep Courses", HI: "तैयारी पाठ्यक्रम" },
        profile: { EN: "Profile", HI: "प्रोफ़ाइल" },
        navigation: { EN: "Navigation", HI: "नेविगेशन" },
        quickHelp: { EN: "Quick Help", HI: "त्वरित सहायता" },
        askAssistant: { EN: "Ask Assistant", HI: "सहायक से पूछें" },
    },
    dashboard: {
        greeting: { EN: "Good morning", HI: "सुप्रभात" },
        ready: { EN: "Ready to explore new opportunities?", HI: "नए अवसर तलाशने के लिए तैयार हैं?" },
        findBtn: { EN: "Find Internships", HI: "इंटर्नशिप खोजें" },
        activeApps: { EN: "Active Applications", HI: "सक्रिय आवेदन" },
        aiMatches: { EN: "AI Matches", HI: "एआई मैच" },
        successRate: { EN: "Success Rate", HI: "सफलता दर" },
        totalApplied: { EN: "total applied", HI: "कुल आवेदन" },
        personalized: { EN: "Personalized for you", HI: "आपके लिए वैयक्तिकृत" },
        basedOnApps: { EN: "Based on applications", HI: "आवेदनों पर आधारित" },
        aiRecommended: { EN: "AI-Recommended For You", HI: "एआई-अनुशंसित आपके लिए" },
        viewAll: { EN: "View All", HI: "सभी देखें" },
        completeProfilePrompt: { EN: "Complete your profile for AI recommendations", HI: "एआई सिफारिशों के लिए अपनी प्रोफ़ाइल पूरी करें" },
        completeProfileSubtext: { EN: "Help us understand your skills and preferences to show personalized matches", HI: "व्यक्तिगत मैच दिखाने के लिए हमें अपने कौशल और प्राथमिकताएं समझने में मदद करें" },
        completeProfileBtn: { EN: "Complete Profile", HI: "प्रोफ़ाइल पूरी करें" },
        yourProgress: { EN: "Your Progress", HI: "आपकी प्रगति" },
        progress: {
            complete: { title: { EN: "Complete Profile", HI: "प्रोफ़ाइल पूरी करें" }, subtitle: { EN: "Add your skills, preferences, and education details", HI: "अपने कौशल, प्राथमिकताएं और शिक्षा विवरण जोड़ें" } },
            explore: { title: { EN: "Explore Internships", HI: "इंटर्नशिप खोजें" }, subtitle: { EN: "Browse and find opportunities that match your goals", HI: "अपने लक्ष्यों से मेल खाने वाले अवसर ब्राउज़ करें और खोजें" } },
            submit: { title: { EN: "Submit Applications", HI: "आवेदन जमा करें" }, subtitle: { EN: "Apply to internships you're interested in", HI: "जिन इंटर्नशिप में आपकी रुचि है, उनके लिए आवेदन करें" } },
            develop: { title: { EN: "Skill Development", HI: "कौशल विकास" }, subtitle: { EN: "Take courses to improve your chances", HI: "अपने अवसरों को बेहतर बनाने के लिए पाठ्यक्रम लें" } },
        }
    },
    profile: {
        title: { EN: "Update Your Profile", HI: "अपनी प्रोफ़ाइल अपडेट करें" },
        subtitle: { EN: "Help us find the perfect internship matches for you", HI: "हमें आपके लिए सही इंटर्नशिप मैच खोजने में मदद करें" },
        basicInfo: { EN: "Basic Info", HI: "मूल जानकारी" },
        skillsInterests: { EN: "Skills & Interests", HI: "कौशल और रुचियाँ" },
        preferences: { EN: "Preferences", HI: "प्राथमिकताएँ" },
        phone: { EN: "Phone Number", HI: "फ़ोन नंबर" },
        location: { EN: "Current Location", HI: "वर्तमान स्थान" },
        education: { EN: "Education Level", HI: "शिक्षा स्तर" },
        studyField: { EN: "Field of Study", HI: "अध्ययन का क्षेत्र" },
        yourSkills: { EN: "Your Skills", HI: "आपके कौशल" },
        popularSkills: { EN: "Popular Skills:", HI: "लोकप्रिय कौशल:" },
        preferredSectors: { EN: "Preferred Sectors", HI: "पसंदीदा क्षेत्र" },
        chooseIndustries: { EN: "Choose industries you're interested in", HI: "जिन उद्योगों में आपकी रुचि है, उन्हें चुनें" },
        yourSectors: { EN: "Your Sectors:", HI: "आपके क्षेत्र:" },
        workPreferences: { EN: "Work Preferences", HI: "कार्य प्राथमिकताएँ" },
        preferredLocations: { EN: "Preferred Work Locations", HI: "पसंदीदा कार्य स्थान" },
        whenStart: { EN: "When can you start?", HI: "आप कब शुरू कर सकते हैं?" },
        backBtn: { EN: "Back", HI: "वापस" },
        nextBtn: { EN: "Next:", HI: "अगला:" },
    },
    aiAssistant: {
        title: { EN: "AI Assistant", HI: "एआई सहायक" },
        subtitle: { EN: "Here to help you succeed", HI: "आपकी सफलता में मदद के लिए यहाँ है" },
        greeting: { EN: "Hello! I'm your AI assistant. How can I help you today?", HI: "नमस्ते! मैं आपका एआई सहायक हूँ। मैं आज आपकी कैसे मदद कर सकता हूँ?" },
        quickQuestions: { EN: "Quick questions:", HI: "त्वरित प्रश्न:" },
        q1: { EN: "How do I apply for internships?", HI: "मैं इंटर्नशिप के लिए कैसे आवेदन करूं?" },
        q2: { EN: "What skills do I need?", HI: "मुझे किन कौशलों की आवश्यकता है?" },
        q3: { EN: "How to track my applications?", HI: "मैं अपने आवेदनों को कैसे ट्रैक करूं?" },
        contactSupport: { EN: "Contact support team", HI: "सहायता टीम से संपर्क करें" },
        inputPlaceholder: { EN: "Type your message...", HI: "अपना संदेश लिखें..." },
    },
    internshipCard: {
        posted: { EN: "Posted 2 days ago", HI: "2 दिन पहले पोस्ट किया गया" },
        viewDetails: { EN: "View Details", HI: "विवरण देखें" },
    }
};

const languages = [
    { code: 'EN', name: 'English'}, { code: 'HI', name: 'हिन्दी'}, { code: 'BN', name: 'বাংলা'}, { code: 'TE', name: 'తెలుగు'}, { code: 'MR', name: 'मराठी'}, { code: 'GU', name: 'ગુજરાતી'}, { code: 'KN', name: 'ಕನ್ನಡ'},
];

// --- Language Context and Provider ---
const LanguageContext = createContext();
const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(languages[0]);
    const changeLanguage = (langCode) => { const newLang = languages.find(l => l.code === langCode) || languages[0]; setLanguage(newLang); };
    const t = (key) => { const keys = key.split('.'); let result = translations; for (const k of keys) { result = result[k]; if (!result) return key; } return result[language.code] || result['EN']; };
    return (<LanguageContext.Provider value={{ language, changeLanguage, t, languages }}>{children}</LanguageContext.Provider>);
};

// --- App Component (Handles Login State) ---
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUserName, setLoggedInUserName] = useState('');

  const handleLoginSuccess = (userName) => {
    setIsLoggedIn(true);
    setLoggedInUserName(userName);
  };

  const handleSignUpClick = () => {
    alert('Sign Up page functionality is not implemented.');
  };

  return (
    <LanguageProvider>
      {isLoggedIn ? (
        <SkillSyncApp userName={loggedInUserName} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} onSignUpClick={handleSignUpClick} />
      )}
    </LanguageProvider>
  );
}

// --- Main Application Component ---
function SkillSyncApp({ userName }) {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAssistantOpen, setAssistantOpen] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);


  const handleProfileComplete = () => { setIsProfileComplete(true); setActivePage('Dashboard'); };

  const renderPage = () => {
    switch (activePage) {
      case 'Profile': return <ProfileCompletion onProfileComplete={handleProfileComplete} />;
      case 'Dashboard':
      default:
        return <Dashboard setActivePage={setActivePage} isProfileComplete={isProfileComplete} userName={userName} />;
    }
  };

  return (
    <div className="app-container">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        activePage={activePage} 
        setActivePage={setActivePage}
        openAssistant={() => setAssistantOpen(true)}
        userName={userName}
      />
      <main className="main-content">
        {renderPage()}
      </main>
      {isAssistantOpen && <AIAssistantModal onClose={() => setAssistantOpen(false)} />}
    </div>
  );
}

// --- Login Page Component ---
const LoginPage = ({ onLoginSuccess, onSignUpClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    // SIMULATED LOGIN
    setTimeout(() => {
      if ((email === 'aman@example.com' || email === 'aman') && password === 'password') {
        onLoginSuccess('AMAN YADAV');
      } else {
        setError('Invalid credentials. Hint: aman / password');
      }
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-logo"><span className="header-logo">PM</span></div>
        <h2 className="login-title">Welcome to Intern4All</h2>
        <p className="login-subtitle">Sign in to continue</p>
        <button className="google-login-btn" onClick={() => onLoginSuccess('AMAN YADAV')} disabled={isLoading}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google Logo" className="google-icon"/> Continue with Google
        </button>
        <div className="or-divider">OR</div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group"><input type="text" placeholder="Email or Username" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} /></div>
          <div className="form-group"><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} /></div>
          {error && <p className="login-error-message">{error}</p>}
          <button type="submit" className="signin-btn" disabled={isLoading}>{isLoading ? 'Signing In...' : 'Sign In'}</button>
        </form>
        <div className="login-links">
          <a href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
          <span> • </span>
          <a href="#" onClick={(e) => {e.preventDefault(); onSignUpClick();}}>Need an account? Sign up</a>
        </div>
      </div>
    </div>
  );
};


// --- Mobile Header Component ---
const MobileHeader = ({ onMenuClick }) => {
    const { language, changeLanguage, languages } = useContext(LanguageContext);
    const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
    const langDropdownRef = useRef(null);

    useEffect(() => { const handleClickOutside = (event) => { if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) { setLangDropdownOpen(false); } }; document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [langDropdownRef]);
    
    return (
        <header className="mobile-header">
            <button className="icon-button" onClick={onMenuClick}><LuMenu /></button>
            <div className="header-logo-section">
                <span className="header-logo">PM</span>
                <span className="header-title">PM Internships</span>
            </div>
            <div className="header-controls">
                <div className="language-selector-wrapper" ref={langDropdownRef}>
                    <button className="icon-button" onClick={() => setLangDropdownOpen(!isLangDropdownOpen)}>
                        <LuGlobe/>
                    </button>
                    {isLangDropdownOpen && (<div className="language-dropdown">{languages.map(lang => (<div key={lang.code} className="dropdown-item" onClick={() => { changeLanguage(lang.code); setLangDropdownOpen(false); }}><span className="lang-code">{lang.code}</span> {lang.name}</div>))}</div>)}
                </div>
                <button className="icon-button"><LuBell/></button>
            </div>
        </header>
    );
};

// Sidebar Component
const Sidebar = ({ isOpen, onClose, activePage, setActivePage, openAssistant, userName }) => {
  const { t } = useContext(LanguageContext);
  const navItems = [
    { name: 'Dashboard', key: 'nav.dashboard', icon: <LuLayoutDashboard /> }, { name: 'Find Internships', key: 'nav.findInternships', icon: <LuSearch /> }, { name: 'My Applications', key: 'nav.myApplications', icon: <LuFileText /> }, { name: 'Prep Courses', key: 'nav.prepCourses', icon: <LuBookOpen /> }, { name: 'Profile', key: 'nav.profile', icon: <LuUser /> },
  ];
  
  const handleLinkClick = (pageName) => {
    setActivePage(pageName);
    onClose();
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div>
          <div className="sidebar-header"><span className="sidebar-logo">PM</span><div><div className="sidebar-title">PM Internships</div><div className="sidebar-subtitle">Smart Career Matching</div></div></div>
          <nav className="sidebar-nav">
            <div className="sidebar-section-title">{t('nav.navigation')}</div>
            <ul>{navItems.map(item => (<li key={item.name}><button className={`nav-link ${activePage === item.name ? 'active' : ''}`} onClick={() => handleLinkClick(item.name)}>{item.icon} {t(item.key)}</button></li>))}</ul>
          </nav>
          <div className="sidebar-section-title">{t('nav.quickHelp')}</div>
          <nav className="sidebar-nav"><ul><li><button className="nav-link" onClick={() => {openAssistant(); onClose();}}><LuMessageSquare /> {t('nav.askAssistant')}</button></li></ul></nav>
        </div>
        <div className="sidebar-footer">
          <div className="user-avatar">{userName.charAt(0)}</div>
          <div><div className="user-name">{userName}</div><div className="user-role">PM Intern</div></div>
        </div>
      </aside>
    </>
  );
};

// --- THIS IS THE MISSING COMPONENT THAT WAS ADDED BACK ---
// Internship Card Component
const InternshipCard = ({ internship }) => {
    const { t } = useContext(LanguageContext);
    return (
        <div className="internship-card"><div className="internship-card-header"><h4>{internship.title}</h4><p>{internship.company}</p></div><div className="internship-card-details"><span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><LuMapPin size={14} /> {internship.location}</span><span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><LuDollarSign size={14} /> {internship.stipend}</span></div><div className="internship-card-tags">{internship.tags.map(tag => <span key={tag} className="internship-tag">{tag}</span>)}</div><div className="internship-card-footer"><span className="posted-time">{t('internshipCard.posted')}</span><button className="view-details-btn">{t('internshipCard.viewDetails')}</button></div></div>
    )
}

// Dashboard Component
const Dashboard = ({ setActivePage, isProfileComplete, userName }) => {
  const { t } = useContext(LanguageContext);
  const dummyInternships = [
      { title: 'AI/ML Research Intern', company: 'Google', location: 'Remote', stipend: '₹ 30,000/month', tags: ['Machine Learning', 'Python', 'Research'] },
      { title: 'Frontend Developer Intern', company: 'Microsoft', location: 'Bangalore', stipend: '₹ 25,000/month', tags: ['React', 'JavaScript', 'CSS'] },
      { title: 'Product Management Intern', company: 'SkillSync', location: 'Delhi', stipend: '₹ 20,000/month', tags: ['Product', 'Management', 'UI/UX'] },
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <span className="ai-badge">✨ AI-Powered Matching</span>
          <h1>{t('dashboard.greeting')}, {userName}! 👋</h1>
          <p>{t('dashboard.ready')}</p>
        </div>
        <button className="primary-button">{t('dashboard.findBtn')} →</button>
      </header>
      <div className="stats-grid">
        <StatCard title={t('dashboard.activeApps')} value="0" footer={`0 ${t('dashboard.totalApplied')}`} icon={<LuFilePlus />} iconClass="blue" />
        <StatCard title={t('dashboard.aiMatches')} value={isProfileComplete ? dummyInternships.length : "0"} footer={t('dashboard.personalized')} icon={<LuTarget />} iconClass="green" />
        <StatCard title={t('dashboard.successRate')} value="0%" footer={t('dashboard.basedOnApps')} icon={<LuTrendingUp />} iconClass="purple" />
      </div>
      <div className="dashboard-main-area">
        <div className="recommendations-card">
          <div className="card-header"><h3>✨ {t('dashboard.aiRecommended')}</h3><button className="view-all-link">{t('dashboard.viewAll')}</button></div>
          {!isProfileComplete ? (<div className="empty-state"><LuBuilding2 /><h4>{t('dashboard.completeProfilePrompt')}</h4><p>{t('dashboard.completeProfileSubtext')}</p><button className="dark-button" onClick={() => setActivePage('Profile')}>{t('dashboard.completeProfileBtn')}</button></div>) : (<div className="recommendations-grid">{dummyInternships.map((internship, index) => (<InternshipCard key={index} internship={internship} />))}</div>)}
        </div>
        <div className="progress-card">
          <div className="card-header"><h3>{t('dashboard.yourProgress')}</h3><span>{isProfileComplete ? '4/4' : '1/4'}</span></div>
          <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: isProfileComplete ? '100%' : '25%' }}></div></div>
          <ul className="progress-checklist">
            <ChecklistItem title={t('dashboard.progress.complete.title')} subtitle={t('dashboard.progress.complete.subtitle')} completed={true} />
            <ChecklistItem title={t('dashboard.progress.explore.title')} subtitle={t('dashboard.progress.explore.subtitle')} completed={isProfileComplete} />
            <ChecklistItem title={t('dashboard.progress.submit.title')} subtitle={t('dashboard.progress.submit.subtitle')} completed={isProfileComplete} />
            <ChecklistItem title={t('dashboard.progress.develop.title')} subtitle={t('dashboard.progress.develop.subtitle')} completed={isProfileComplete} />
          </ul>
          <div className="recent-activity-header card-header"><h3><LuHistory/> Recent Activity</h3></div>
           <p style={{textAlign: 'center', color: 'var(--text-light)', marginTop: '1rem'}}>No recent activity.</p>
        </div>
      </div>
    </div>
  );
};

// StatCard Sub-component for Dashboard
const StatCard = ({ title, value, footer, icon, iconClass }) => (<div className="stat-card"><div className="stat-card-header"><span className="stat-card-title">{title}</span><div className={`stat-card-icon ${iconClass}`}>{icon}</div></div><div className="stat-card-value">{value}</div><div className="stat-card-footer">{footer}</div></div>);
const ChecklistItem = ({ title, subtitle, completed = false }) => (<li className="checklist-item"><div style={{flexShrink: 0}}>{completed ? <LuCircleCheck className="checklist-icon completed" /> : <LuCircle className="checklist-icon pending" />}</div><div><div className="checklist-item-title">{title}</div><div className="checklist-item-subtitle">{subtitle}</div>{!completed && <a href="#" onClick={(e) => e.preventDefault()} className="checklist-item-action">Complete →</a>}</div></li>);

// --- THIS IS THE MISSING COMPONENT THAT WAS ADDED BACK ---
// Profile Completion Flow Component
const ProfileCompletion = ({ onProfileComplete }) => {
  const { t } = useContext(LanguageContext);
  const [step, setStep] = useState(1);
  const steps = [
      { name: t('profile.basicInfo') }, 
      { name: t('profile.skillsInterests') }, 
      { name: t('profile.preferences') }
  ];
  const getStepStatus = (stepIndex) => {
    if (stepIndex < step) return 'completed'; if (stepIndex === step) return 'active'; return 'pending';
  };

  return (
    <div className="profile-form-container">
      <div className="profile-header"><h1>{t('profile.title')}</h1><p>{t('profile.subtitle')}</p></div>
      <div className="stepper">{steps.map((s, index) => (<div className={`step ${getStepStatus(index + 1)}`} key={s.name}><div className="step-number">{index + 1}</div><div className="step-name">{s.name}</div></div>))}</div>
      <div className="form-card">
        {step === 1 && <BasicInfoForm onNext={() => setStep(2)} />}
        {step === 2 && <SkillsInterestsForm onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <PreferencesForm onBack={() => setStep(2)} onComplete={onProfileComplete} />}
      </div>
    </div>
  );
};

// --- Form Components ---
const BasicInfoForm = ({ onNext }) => {
  const { t } = useContext(LanguageContext);
  const [formData, setFormData] = useState({ phone: '+91-7317208443', location: 'Delhi', education: 'Undergraduate', studyField: 'Computer Science' });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const validateAndProceed = () => { const newErrors = {}; if (!formData.phone.trim()) newErrors.phone = "Phone number is required"; if (!formData.location) newErrors.location = "Current location is required"; if (!formData.education) newErrors.education = "Education level is required"; setErrors(newErrors); if (Object.keys(newErrors).length === 0) onNext(); };
  return (<><h3><LuUser /> {t('profile.basicInfo')}</h3><div className="form-grid"><div className="form-group"><label className="form-label">{t('profile.phone')} *</label><input type="tel" name="phone" className={`form-input ${errors.phone ? 'error' : ''}`} value={formData.phone} onChange={handleChange} />{errors.phone && <p className="error-message">{errors.phone}</p>}</div><div className="form-group"><label className="form-label">{t('profile.location')} *</label><select name="location" className={`form-select ${errors.location ? 'error' : ''}`} value={formData.location} onChange={handleChange}><option value="">Select your city</option><option value="Delhi">Delhi</option><option value="Mumbai">Mumbai</option><option value="Kanpur">Kanpur</option></select>{errors.location && <p className="error-message">{errors.location}</p>}</div><div className="form-group"><label className="form-label">{t('profile.education')} *</label><select name="education" className={`form-select ${errors.education ? 'error' : ''}`} value={formData.education} onChange={handleChange}><option value="">Select education level</option><option value="Undergraduate">Undergraduate</option><option value="Graduate">Graduate</option></select>{errors.education && <p className="error-message">{errors.education}</p>}</div><div className="form-group"><label className="form-label">{t('profile.studyField')}</label><input type="text" name="studyField" className="form-input" value={formData.studyField} onChange={handleChange} /></div></div><div className="form-actions" style={{ justifyContent: 'flex-end', paddingTop: '2.5rem', borderTop: 'none' }}><button className="next-button" onClick={validateAndProceed}>{t('profile.nextBtn')} {t('profile.skillsInterests')}</button></div></>);
};
const SkillsInterestsForm = ({ onNext, onBack }) => {
  const { t } = useContext(LanguageContext);
  const initialPopularSkills = ["JavaScript", "Python", "React", "Node.js", "SQL", "Java", "Excel", "Communication", "Leadership", "Problem Solving", "Team Work", "Time Management", "Digital Marketing", "Data Analysis", "Content Writing", "Graphic Design"];
  const initialSectors = ["Technology", "Healthcare", "Education", "Finance", "Manufacturing", "Agriculture", "Retail", "Media", "Government", "Ngo"];
  const [availableSkills, setAvailableSkills] = useState(initialPopularSkills); const [selectedSkills, setSelectedSkills] = useState([]); const [availableSectors, setAvailableSectors] = useState(initialSectors); const [selectedSectors, setSelectedSectors] = useState([]); const [inputValue, setInputValue] = useState(''); const [errors, setErrors] = useState({});
  const handleSelectSkill = (skill) => { if (!selectedSkills.includes(skill)) { setSelectedSkills([...selectedSkills, skill]); setAvailableSkills(availableSkills.filter(s => s !== skill)); } };
  const handleRemoveSkill = (skill) => { setSelectedSkills(selectedSkills.filter(s => s !== skill)); if (initialPopularSkills.includes(skill) && !availableSkills.includes(skill)) { setAvailableSkills([...availableSkills, skill]); } };
  const handleSkillInput = (event) => { if (event.key === 'Enter' && inputValue.trim() !== '') { const newSkill = inputValue.trim(); if (!selectedSkills.includes(newSkill)) { setSelectedSkills([...selectedSkills, newSkill]); setAvailableSkills(availableSkills.filter(s => s.toLowerCase() !== newSkill.toLowerCase())); } setInputValue(''); event.preventDefault(); } };
  const handleSelectSector = (sector) => { if (!selectedSectors.includes(sector)) { setSelectedSectors([...selectedSectors, sector]); setAvailableSectors(availableSectors.filter(s => s !== sector)); } };
  const handleRemoveSector = (sector) => { setSelectedSectors(selectedSectors.filter(s => s !== sector)); if (initialSectors.includes(sector) && !availableSectors.includes(sector)) { setAvailableSectors([...availableSectors, sector]); } };
  const validateAndProceed = () => { const newErrors = {}; if (selectedSkills.length === 0) newErrors.skills = "Please add at least one skill"; if (selectedSectors.length === 0) newErrors.sectors = "Please select at least one preferred sector"; setErrors(newErrors); if (Object.keys(newErrors).length === 0) onNext(); };
  return (<><h3><LuTarget /> {t('profile.skillsInterests')}</h3><div className="form-group full-width" style={{ marginTop: '2rem' }}><label className="form-label">{t('profile.yourSkills')} *</label><div style={{ position: 'relative' }}><input type="text" className={`form-input ${errors.skills ? 'error' : ''}`} placeholder="Type a skill and press Enter" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleSkillInput} /><button style={{ position: 'absolute', right: '8px', top: '8px', background: '#e5e7eb', border: 'none', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer' }}><LuPlus /></button></div>{errors.skills && !selectedSkills.length && <p className="error-message">{errors.skills}</p>}</div><div className="form-group full-width" style={{ marginTop: '1rem' }}><div className="form-section-title" style={{ fontSize: '0.875rem', color: 'var(--text-medium)' }}>{t('profile.popularSkills')}</div><div className="popular-skills">{availableSkills.map(skill => <span key={skill} className="skill-tag" onClick={() => handleSelectSkill(skill)}>{skill}</span>)}</div></div>{selectedSkills.length > 0 && (<div className="form-group full-width" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--sidebar-border)', paddingTop: '1.5rem' }}><div className="form-section-title" style={{ fontSize: '0.875rem' }}>{t('profile.yourSkills')}:</div><div className="popular-skills">{selectedSkills.map(skill => <span key={skill} className="skill-tag" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary-blue)', cursor: 'default' }}>{skill} <LuX style={{ cursor: 'pointer', marginLeft: '8px' }} onClick={() => handleRemoveSkill(skill)} /></span>)}</div></div>)}<div className="form-group full-width" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--sidebar-border)' }}><div className="form-section-title">{t('profile.preferredSectors')} *</div><p style={{ margin: '-0.5rem 0 1rem 0', color: 'var(--text-medium)', fontSize: '0.875rem' }}>{t('profile.chooseIndustries')}</p><div className="preferred-sectors">{availableSectors.map(sector => <span key={sector} className="sector-tag" onClick={() => handleSelectSector(sector)}>{sector}</span>)}</div>{errors.sectors && !selectedSectors.length && <p className="error-message">{errors.sectors}</p>}</div>{selectedSectors.length > 0 && (<div className="form-group full-width" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--sidebar-border)', paddingTop: '1.5rem' }}><div className="form-section-title" style={{ fontSize: '0.875rem' }}>{t('profile.yourSectors')}</div><div className="popular-skills">{selectedSectors.map(sector => <span key={sector} className="skill-tag" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary-blue)', cursor: 'default' }}>{sector} <LuX style={{ cursor: 'pointer', marginLeft: '8px' }} onClick={() => handleRemoveSector(sector)} /></span>)}</div></div>)}<div className="form-actions"><button className="back-button" onClick={onBack}>{t('profile.backBtn')}</button><button className="next-button" onClick={validateAndProceed}>{t('profile.nextBtn')} {t('profile.preferences')}</button></div></>);
};
const PreferencesForm = ({ onBack, onComplete }) => {
  const { t } = useContext(LanguageContext);
  const [formData, setFormData] = useState({ location: '', availability: '' });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const validateAndComplete = () => { const newErrors = {}; if (!formData.location) newErrors.location = "Please select a preferred work location"; setErrors(newErrors); if (Object.keys(newErrors).length === 0) onComplete(); };
  return (<><h3><LuBriefcase /> {t('profile.workPreferences')}</h3><div className="form-group full-width"><label className="form-label">{t('profile.preferredLocations')} *</label><select name="location" className={`form-select ${errors.location ? 'error' : ''}`} value={formData.location} onChange={handleChange}><option value="">Select a city</option><option value="Delhi">Delhi</option><option value="Kanpur">Kanpur</option><option value="Remote">Remote</option></select>{errors.location && <p className="error-message">{errors.location}</p>}</div><div className="form-group full-width" style={{ marginTop: '1.5rem' }}><label className="form-label">{t('profile.whenStart')}</label><select name="availability" className="form-select" value={formData.availability} onChange={handleChange}><option value="">Select availability</option><option value="Immediately">Immediately</option><option value="In 1 month">In 1 month</option></select></div><div className="form-actions"><button className="back-button" onClick={onBack}>{t('profile.backBtn')}</button><button className="next-button" onClick={validateAndComplete}>{t('dashboard.completeProfileBtn')}</button></div></>);
};
const AIAssistantModal = ({ onClose }) => {
  const { t, language } = useContext(LanguageContext);
  const API_KEY = "AIzaSyBe5lGUCkiDO7cBphomKyUeU-9dYevXQ80"; // ⚠️ PASTE YOUR API KEY HERE

  const [chatHistory, setChatHistory] = useState([{ role: 'model', text: t('aiAssistant.greeting') }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);
  const chatSession = useRef(null);

  useEffect(() => {
    if (!API_KEY) { console.warn("AI Assistant: API Key is missing."); return; }
    const genAI = new GoogleGenerativeAI(API_KEY);
    const safetySettings = [ { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" }, { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" }, { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" }, { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }, ];
    const model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings });
    chatSession.current = model.startChat({ history: [] });
  }, [API_KEY]);

  useEffect(() => { if (chatBodyRef.current) { chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight; } }, [chatHistory, isLoading]);

  const handleSendMessage = async (messageText) => {
    const text = messageText.trim();
    if (!text || isLoading || !chatSession.current) {
        if (!API_KEY) { alert("AI Assistant is not configured. API Key is missing."); }
        return;
    }
    setInputValue('');
    setChatHistory(prev => [...prev, { role: 'user', text }]);
    setIsLoading(true);
    try {
        const prompt = `Please respond in ${language.name}. User's message: ${text}`;
        const result = await chatSession.current.sendMessage(prompt);
        const response = await result.response;
        const responseText = response.text();
        setChatHistory(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
        console.error("Error sending message to AI:", error);
        setChatHistory(prev => [...prev, { role: 'model', text: "Please specify your problem." }]);
    } finally {
        setIsLoading(false);
    }
  };
  const quickQuestions = [ t('aiAssistant.q1'), t('aiAssistant.q2'), t('aiAssistant.q3'), t('aiAssistant.contactSupport')];
  return (<div className="ai-modal-overlay" onClick={onClose}><div className="ai-modal-content" onClick={(e) => e.stopPropagation()}><div className="ai-modal-header"><div className="title"><span className="title-icon"><LuBot/></span> {t('aiAssistant.title')}</div><button className="close-btn" onClick={onClose}><LuX/></button></div><div className="chat-body" ref={chatBodyRef}>{chatHistory.map((msg, index) => (<div key={index} className={`chat-message ${msg.role}-message`}><div className="avatar">{msg.role === 'model' ? <LuBot/> : <LuCircleUserRound/>}</div><div className="bubble">{msg.text}</div></div>))}{isLoading && (<div className="chat-message model-message"><div className="avatar"><LuBot/></div><div className="bubble typing-indicator"><span></span><span></span><span></span></div></div>)}</div><div className="ai-modal-footer"><div className="quick-questions">{quickQuestions.map((q, i) => <button key={i} className="quick-question-btn" onClick={() => handleSendMessage(q)}>{q}</button>)}</div><form className="chat-input-form" onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}><input type="text" className="chat-input" placeholder={t('aiAssistant.inputPlaceholder')} value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={isLoading || !API_KEY} /><button type="submit" className="send-btn" disabled={isLoading || !inputValue.trim() || !API_KEY}><LuSend/></button></form></div></div></div>);
};

export default App;
