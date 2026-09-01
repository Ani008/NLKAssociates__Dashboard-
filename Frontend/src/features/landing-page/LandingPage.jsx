import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import {
  FaScaleBalanced,
  FaBuildingColumns,
  FaLandmark,
  FaGavel,
  FaHouse,
  FaFileSignature,
  FaUserShield,
  FaStar,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
  FaAngleUp,
} from "react-icons/fa6";

// ==========================================
// 1. STYLESHEET EMULATION (Scoped CSS Injector)
// ==========================================

const LANDING_CSS = `
/* =====================================================
   Adv. Narayan L. Khamkar & Associates
   Isolated Landing Page Styling scoped to .nlk-landing-root
 ======================================================*/

@import "aos/dist/aos.css";

/* Scope everything under .nlk-landing-root */
.nlk-landing-root {
  --nlk-primary: #0B0D17;
  --nlk-secondary: #1A1F2E;
  --nlk-gold: #C8A04B;
  --nlk-gold-light: #E8C97A;
  --nlk-white: #FFFFFF;
  --nlk-gray: #F5F5F5;
  --nlk-text: #555;
  --nlk-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);

  background: #fff;
  color: #333;
  line-height: 1.7;
  font-family: 'Poppins', sans-serif;
}

.nlk-landing-root * {
  box-sizing: border-box;
}

/* ================= GRID & UTILITIES (HAND-ROLLED) ================= */
.nlk-landing-root .nlk-container {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

@media (min-width: 576px) {
  .nlk-landing-root .nlk-container { max-width: 540px; }
}
@media (min-width: 768px) {
  .nlk-landing-root .nlk-container { max-width: 720px; }
}
@media (min-width: 992px) {
  .nlk-landing-root .nlk-container { max-width: 960px; }
}
@media (min-width: 1200px) {
  .nlk-landing-root .nlk-container { max-width: 1140px; }
}

.nlk-landing-root .nlk-row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.nlk-landing-root .nlk-align-center {
  align-items: center;
}

.nlk-landing-root .nlk-text-center {
  text-align: center;
}

/* Responsive Grid Columns */
.nlk-landing-root [class*="nlk-col-"] {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}

.nlk-landing-root .nlk-col-6 {
  flex: 0 0 50%;
  max-width: 50%;
}

.nlk-landing-root .nlk-col-12 {
  flex: 0 0 100%;
  max-width: 100%;
}

@media (min-width: 768px) {
  .nlk-landing-root .nlk-col-md-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .nlk-landing-root .nlk-col-md-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
  .nlk-landing-root .nlk-col-md-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (min-width: 992px) {
  .nlk-landing-root .nlk-col-lg-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .nlk-landing-root .nlk-col-lg-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
  .nlk-landing-root .nlk-col-lg-5 {
    flex: 0 0 41.666667%;
    max-width: 41.666667%;
  }
  .nlk-landing-root .nlk-col-lg-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .nlk-landing-root .nlk-col-lg-7 {
    flex: 0 0 58.333333%;
    max-width: 58.333333%;
  }
}

/* Row Gaps */
.nlk-landing-root .nlk-g-4 {
  margin-right: -12px;
  margin-left: -12px;
}
.nlk-landing-root .nlk-g-4 > [class*="nlk-col-"] {
  padding-right: 12px;
  padding-left: 12px;
  padding-bottom: 24px;
}

.nlk-landing-root .nlk-mb-4 {
  margin-bottom: 1.5rem !important;
}
.nlk-landing-root .nlk-mb-5 {
  margin-bottom: 3rem !important;
}
.nlk-landing-root .nlk-mt-3 {
  margin-top: 1rem !important;
}
.nlk-landing-root .nlk-w-100 {
  width: 100% !important;
}

/* Map Ratio embed */
.nlk-landing-root .nlk-map-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
  border-radius: 10px;
  margin-top: 1.5rem;
}
.nlk-landing-root .nlk-map-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

/* ================= TYPOGRAPHY ================= */
.nlk-landing-root h1,
.nlk-landing-root h2,
.nlk-landing-root h3,
.nlk-landing-root h4,
.nlk-landing-root h5 {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
}

.nlk-landing-root .nlk-section {
  padding: 100px 0;
}

.nlk-landing-root .nlk-bg-light {
  background: var(--nlk-gray);
}

.nlk-landing-root .nlk-section-title {
  font-size: 42px;
  margin-bottom: 30px;
  color: var(--nlk-primary);
  position: relative;
}

.nlk-landing-root .nlk-section-title::after {
  content: "";
  width: 80px;
  height: 4px;
  background: var(--nlk-gold);
  display: block;
  margin-top: 15px;
  border-radius: 20px;
}

/* ================= NAVBAR ================= */
.nlk-landing-root .nlk-navbar {
  transition: .4s;
  background: rgba(0,0,0,.15);
  backdrop-filter: blur(15px);
  padding: 15px 0;
  z-index: 1000;
  width: 100%;
}

.nlk-landing-root .nlk-navbar-fixed {
  position: fixed;
  top: 0;
  left: 0;
}

.nlk-landing-root .nlk-navbar-scrolled {
  background: #0b0d17;
  box-shadow: 0 10px 30px rgba(0,0,0,.2);
}

.nlk-landing-root .nlk-navbar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nlk-landing-root .nlk-navbar-brand {
  color: #fff !important;
  font-size: 26px;
  font-weight: 700;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.nlk-landing-root .nlk-brand-icon {
  color: var(--nlk-gold);
  margin-right: 10px;
}

.nlk-landing-root .nlk-navbar-toggler {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
}

.nlk-landing-root .nlk-toggler-bar {
  width: 100%;
  height: 3px;
  background: #fff;
  border-radius: 2px;
  transition: 0.3s;
}

.nlk-landing-root .nlk-navbar-collapse {
  display: none;
}

.nlk-landing-root .nlk-navbar-nav {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

.nlk-landing-root .nlk-nav-item {
  margin-left: 20px;
}

.nlk-landing-root .nlk-nav-link {
  color: #fff !important;
  font-weight: 500;
  text-decoration: none;
  position: relative;
  padding: 5px 0;
}

.nlk-landing-root .nlk-nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 0%;
  height: 2px;
  background: var(--nlk-gold);
  transition: .3s;
}

.nlk-landing-root .nlk-nav-link:hover::after,
.nlk-landing-root .nlk-nav-link--active::after {
  width: 100%;
}

/* Mobile Nav Toggle states */
@media (max-width: 992px) {
  .nlk-landing-root .nlk-navbar-inner {
    flex-wrap: wrap;
  }
  .nlk-landing-root .nlk-navbar-collapse {
    width: 100%;
    display: none;
    margin-top: 15px;
  }
  .nlk-landing-root .nlk-navbar-collapse--open {
    display: block;
  }
  .nlk-landing-root .nlk-navbar-nav {
    flex-direction: column;
    width: 100%;
  }
  .nlk-landing-root .nlk-nav-item {
    margin: 10px 0;
  }
}

@media (min-width: 992px) {
  .nlk-landing-root .nlk-navbar-collapse {
    display: block !important;
  }
}

/* ================= HERO ================= */
.nlk-landing-root .nlk-hero {
  height: 100vh;
  background:
    linear-gradient(rgba(8,8,8,.70),rgba(8,8,8,.70)),
    url("/images/landing/court.jpg") center center/cover no-repeat;
  position: relative;
  display: flex;
  align-items: center;
}

.nlk-landing-root .nlk-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.35);
}

.nlk-landing-root .nlk-hero-content {
  position: relative;
  z-index: 2;
}

.nlk-landing-root .nlk-hero-heading {
  font-size: 68px;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 25px;
}

.nlk-landing-root .nlk-hero-desc {
  color: #ddd;
  font-size: 18px;
  max-width: 650px;
}

.nlk-landing-root .nlk-gold-text {
  color: var(--nlk-gold);
  letter-spacing: 2px;
  margin-bottom: 20px;
}

.nlk-landing-root .nlk-hero-btns {
  margin-top: 1.5rem;
}

/* ================= BUTTONS ================= */
.nlk-landing-root .nlk-btn {
  display: inline-block;
  padding: 14px 35px;
  border-radius: 50px;
  transition: .4s;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
}

.nlk-landing-root .nlk-btn-gold {
  background: var(--nlk-gold);
  color: #fff;
}

.nlk-landing-root .nlk-btn-gold:hover {
  background: #b88b2b;
  transform: translateY(-3px);
  color: #fff;
}

.nlk-landing-root .nlk-btn-outline {
  border-color: #fff;
  color: #fff;
  background: transparent;
}

.nlk-landing-root .nlk-btn-outline:hover {
  background: #fff;
  color: #333;
}

/* ================= PROFILE CARD ================= */
.nlk-landing-root .nlk-profile-card {
  background: rgba(255,255,255,.10);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 20px;
  padding: 40px;
  color: #fff;
  box-shadow: var(--nlk-shadow);
}

.nlk-landing-root .nlk-profile-icon {
  font-size: 70px;
  color: var(--nlk-gold);
  margin-bottom: 20px;
}

.nlk-landing-root .nlk-profile-card h3 {
  margin-bottom: 10px;
}

/* ================= STATS ================= */
.nlk-landing-root .nlk-stats {
  background: var(--nlk-primary);
  color: #fff;
  padding: 70px 0;
}

.nlk-landing-root .nlk-counter {
  color: var(--nlk-gold);
  font-size: 52px;
}

.nlk-landing-root .nlk-stats p {
  color: #ddd;
}

/* ================= ABOUT ================= */
.nlk-landing-root .nlk-about-img {
  width: 100%;
  border-radius: 20px;
  box-shadow: var(--nlk-shadow);
}

.nlk-landing-root .nlk-about-list {
  list-style: none;
  padding-left: 0;
  margin-top: 15px;
}

.nlk-landing-root .nlk-about-list li {
  margin-bottom: 12px;
  position: relative;
  padding-left: 25px;
}

.nlk-landing-root .nlk-about-list li::before {
  content: "✔";
  color: var(--nlk-gold);
  position: absolute;
  left: 0;
  top: 0;
}

/* ================= PRACTICE AREAS ================= */
.nlk-landing-root .nlk-practice {
  background: #f8f8f8;
  padding: 100px 0;
}

.nlk-landing-root .nlk-service-card {
  background: #fff;
  border-radius: 18px;
  padding: 40px 30px;
  text-align: center;
  transition: .4s;
  box-shadow: 0 5px 20px rgba(0,0,0,.08);
  margin-bottom: 30px;
  height: 100%;
}

.nlk-landing-root .nlk-service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 35px rgba(0,0,0,.15);
}

.nlk-landing-root .nlk-service-icon {
  width: 90px;
  height: 90px;
  line-height: 90px;
  border-radius: 50%;
  background: var(--nlk-gold);
  color: #fff;
  font-size: 34px;
  margin: 0 auto 25px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nlk-landing-root .nlk-service-card h4 {
  margin-bottom: 15px;
}

.nlk-landing-root .nlk-service-card p {
  color: var(--nlk-text);
}

/* ================= CLIENT LOGOS ================= */
.nlk-landing-root .nlk-client-logo {
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  transition: .3s;
  border: 1px solid #eee;
  font-weight: 500;
}

.nlk-landing-root .nlk-client-logo:hover {
  transform: scale(1.05);
}

/* ================= TESTIMONIALS ================= */
.nlk-landing-root .nlk-stars {
  color: var(--nlk-gold);
  font-size: 20px;
  display: flex;
  justify-content: center;
  gap: 2px;
}

/* ================= FAQ ================= */
.nlk-landing-root .nlk-accordion {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.nlk-landing-root .nlk-accordion-item {
  border-bottom: 1px solid #ddd;
}
.nlk-landing-root .nlk-accordion-item:last-child {
  border-bottom: none;
}

.nlk-landing-root .nlk-accordion-header {
  margin: 0;
}

.nlk-landing-root .nlk-accordion-button {
  width: 100%;
  padding: 20px;
  background: var(--nlk-gold);
  color: #fff;
  border: none;
  text-align: left;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s, color 0.3s;
}

.nlk-landing-root .nlk-accordion-button--collapsed {
  background: #fff;
  color: #333;
}

.nlk-landing-root .nlk-accordion-chevron {
  font-size: 22px;
}

.nlk-landing-root .nlk-accordion-collapse {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.nlk-landing-root .nlk-accordion-collapse--open {
  max-height: 200px; /* high enough to show answer */
}

.nlk-landing-root .nlk-accordion-body {
  padding: 20px;
  background: #fff;
  color: var(--nlk-text);
  border-top: 1px solid #ddd;
}

/* ================= CONTACT ================= */
.nlk-landing-root .nlk-contact-box {
  background: #fff;
  border-radius: 20px;
  padding: 40px;
  box-shadow: var(--nlk-shadow);
}

.nlk-landing-root .nlk-form-control {
  width: 100%;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  font-family: inherit;
  font-size: 15px;
}

.nlk-landing-root .nlk-form-control:focus {
  border-color: var(--nlk-gold);
  outline: none;
}

.nlk-landing-root .nlk-form-error {
  border: 1px solid red !important;
}

.nlk-landing-root .nlk-contact-icon {
  color: var(--nlk-gold);
  margin-right: 10px;
  vertical-align: middle;
}

/* ================= FOOTER ================= */
.nlk-landing-root .nlk-footer {
  background: var(--nlk-primary);
  color: #bbb;
  padding: 70px 0 30px;
}

.nlk-landing-root .nlk-footer h4 {
  color: #fff;
  margin-bottom: 20px;
}

.nlk-landing-root .nlk-footer-list {
  list-style: none;
  padding-left: 0;
}

.nlk-landing-root .nlk-footer-list li {
  margin-bottom: 10px;
}

.nlk-landing-root .nlk-social-icons {
  display: flex;
  gap: 15px;
  font-size: 24px;
  color: #fff;
}

.nlk-landing-root .nlk-footer-bottom {
  border-top: 1px solid rgba(255,255,255,.1);
  margin-top: 40px;
  padding-top: 20px;
  text-align: center;
}

.nlk-landing-root .nlk-dashboard-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 11px 24px;

  background: var(--nlk-gold);
  color: #fff;

  border: 1px solid var(--nlk-gold);
  border-radius: 50px;

  font-size: 14px;
  font-weight: 600;

  text-decoration: none;

  transition: all 0.3s ease;

  white-space: nowrap;
}

.nlk-landing-root .nlk-dashboard-btn:hover {
  background: #b88b2b;
  border-color: #b88b2b;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* ================= FLOATING BUTTONS ================= */
.nlk-landing-root .nlk-whatsapp {
  position: fixed;
  right: 25px;
  bottom: 25px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #25D366;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 30px;
  z-index: 9999;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  transition: .3s;
  text-decoration: none;
}

.nlk-landing-root .nlk-whatsapp:hover {
  transform: scale(1.1);
  color: #fff;
}

.nlk-landing-root .nlk-scroll-top {
  position: fixed;
  right: 25px;
  bottom: 100px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--nlk-gold);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: .3s;
  box-shadow: 0 10px 25px rgba(0, 0, 0, .25);
  border: none;
  font-size: 20px;
}

.nlk-landing-root .nlk-scroll-top--visible {
  opacity: 1;
  pointer-events: auto;
}

/* ================= DISCLAIMER / DISCLAIMER MODAL ================= */
.nlk-landing-root.nlk-disclaimer-open > :not(.nlk-disclaimer-modal) {
  filter: blur(8px);
  pointer-events: none;
  user-select: none;
}

.nlk-landing-root .nlk-disclaimer-modal {
  position: fixed;
  inset: 0;
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.72);
  overflow-y: auto;
}

.nlk-landing-root .nlk-disclaimer-card {
  width: min(900px, 100%);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  background: #fff;
  color: #333;
  border-radius: 18px;
  padding: 35px;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.35);
}

.nlk-landing-root .nlk-disclaimer-title {
  margin: 0 0 20px;
  color: var(--nlk-primary);
  font-size: 30px;
  line-height: 1.25;
}

.nlk-landing-root .nlk-disclaimer-card p {
  margin: 0 0 16px;
  line-height: 1.7;
}

.nlk-landing-root .nlk-disclaimer-card ul {
  margin: 0 0 20px;
  padding-left: 22px;
}

.nlk-landing-root .nlk-disclaimer-card li {
  margin-bottom: 14px;
  line-height: 1.7;
}

.nlk-landing-root .nlk-disclaimer-approve {
  display: block;
  margin: 25px auto 0;
  min-width: 180px;
}

@media (max-width: 768px) {
  .nlk-landing-root .nlk-disclaimer-modal {
    padding: 14px;
  }

  .nlk-landing-root .nlk-disclaimer-card {
    max-height: calc(100vh - 28px);
    padding: 24px 20px;
    border-radius: 14px;
  }

  .nlk-landing-root .nlk-disclaimer-title {
    font-size: 24px;
  }
}

/* ================= RESPONSIVE ================= */
@media (max-width: 992px) {
  .nlk-landing-root .nlk-navbar-inner {
    flex-wrap: wrap;
    gap: 12px;
  }

  .nlk-landing-root .nlk-navbar-collapse {
    display: none;
  }

  .nlk-landing-root .nlk-navbar-brand {
    font-size: 20px;
  }

  .nlk-landing-root .nlk-dashboard-btn {
    padding: 9px 18px;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .nlk-landing-root .nlk-hero-heading {
    font-size: 38px;
  }
  .nlk-landing-root .nlk-navbar-brand {
    font-size: 20px;
  }
  .nlk-landing-root .nlk-counter {
    font-size: 36px;
  }
  .nlk-landing-root .nlk-section {
    padding: 70px 0;
  }
  .nlk-landing-root .nlk-service-card {
    padding: 30px 20px;
  }
}
`;

// ==========================================
// 2. STATIC CONTENT ARRAYS
// ==========================================

const statsData = [
  { target: 18, label: "Years Experience" },
  { target: 5000, label: "Cases Handled" },
  { target: 15, label: "Panel Banks" },
  { target: 98, label: "% Client Satisfaction" },
];

const practiceAreas = [
  {
    icon: "FaBuildingColumns",
    title: "Banking Law",
    description: "Recovery suits, Banking disputes, Panel Representation.",
  },
  {
    icon: "FaLandmark",
    title: "SARFAESI & DRT",
    description: "Representation before Debt Recovery Tribunal.",
  },
  {
    icon: "FaGavel",
    title: "Arbitration",
    description: "Commercial & Cooperative Arbitration.",
  },
  {
    icon: "FaScaleBalanced",
    title: "Civil Litigation",
    description: "Disputes, property partitions, title suits and contracts.",
  },
  {
    icon: "FaHouse",
    title: "Property Law",
    description: "Legal scrutiny, agreements, partition deeds and opinions.",
  },
  {
    icon: "FaFileSignature",
    title: "Documentation",
    description: "Drafting, execution & registrations of legal documents.",
  },
];

const whyChooseUsData = [
  {
    icon: "FaUserShield",
    title: "18+ Years Experience",
    description: "Trusted legal representation since 2007.",
  },
  {
    icon: "FaScaleBalanced",
    title: "Banking Specialist",
    description: "Extensive experience in DRT, SARFAESI & Recovery Matters.",
  },
  {
    icon: "FaGavel",
    title: "Arbitrator",
    description: "Experienced in Commercial & Cooperative Arbitration.",
  },
  {
    icon: "FaFileSignature",
    title: "Legal Documentation",
    description: "Property verification, agreements and legal opinions.",
  },
];

const clientsData = [
  "Bank of Baroda",
  "Union Bank",
  "ICICI Bank",
  "IDBI Bank",
  "Kotak Mahindra",
  "Punjab National Bank",
  "RBL Bank",
  "TATA Capital",
];

const testimonialsData = [
  {
    stars: 5,
    text: "Professional guidance with complete transparency.",
    author: "Corporate Client",
  },
  {
    stars: 5,
    text: "Excellent support in Banking and Property matters.",
    author: "Business Owner",
  },
  {
    stars: 5,
    text: "Highly recommended for DRT & SARFAESI cases.",
    author: "Banking Client",
  },
];

const faqData = [
  {
    id: "q1",
    question: "Do you provide online consultation?",
    answer: "Yes. Consultations can be scheduled online or in person.",
  },
  {
    id: "q2",
    question: "Which courts do you practice in?",
    answer:
      "Civil, Criminal, DRT, NCLT, Cooperative Courts, Revenue Authorities and Tribunals.",
  },
  {
    id: "q3",
    question: "Can I book an appointment?",
    answer: "Yes. Use the contact form or call directly.",
  },
];

// ==========================================
// 3. CUSTOM HOOKS
// ==========================================

function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const end = parseInt(target, 10);
          let start = 0;
          const increment = Math.max(1, Math.ceil(end / 150));

          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 15);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [target, duration]);

  return [count, elementRef];
}

function useScrollSpy(sectionIds, offset = 120) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      let current = "";
      const scrollPosition = window.scrollY;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop - offset;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            current = id;
          }
        }
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, offset]);

  return activeId;
}

function useTypewriter(text, speed = 60, delay = 500) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    let timer;

    const startTyping = () => {
      timer = setInterval(() => {
        if (index < text.length) {
          setDisplayText((prev) => prev + text.charAt(index));
          index++;
        } else {
          clearInterval(timer);
        }
      }, speed);
    };

    const delayTimeout = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimeout);
      clearInterval(timer);
    };
  }, [text, speed, delay]);

  return displayText;
}

// ==========================================
// 4. SUBCOMPONENTS
// ==========================================

const NAV_LINKS = [
  { id: "landing-home", label: "Home" },
  { id: "landing-about", label: "About" },
  { id: "landing-practice", label: "Practice" },
  { id: "landing-clients", label: "Clients" },
  { id: "landing-faq", label: "FAQ" },
  { id: "landing-contact", label: "Contact" },
];
const SECTION_IDS = NAV_LINKS.map((l) => l.id);

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const activeId = useScrollSpy(SECTION_IDS, 120);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = useCallback((e, targetId) => {
    e.preventDefault();

    const el = document.getElementById(targetId);

    if (el) {
      window.scrollTo({
        top: el.offsetTop - 70,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <nav
      className={`nlk-navbar nlk-navbar-fixed ${
        scrolled ? "nlk-navbar-scrolled" : ""
      }`}
    >
      <div className="nlk-container nlk-navbar-inner">
        {/* BRAND */}
        <a
          className="nlk-navbar-brand"
          href="#landing-home"
          onClick={(e) => handleNavClick(e, "landing-home")}
        >
          <FaScaleBalanced className="nlk-brand-icon" />
          NLK Law Associates
        </a>

        {/* NAVIGATION */}
        <div className="nlk-navbar-collapse">
          <ul className="nlk-navbar-nav">
            {NAV_LINKS.map(({ id, label }) => (
              <li key={id} className="nlk-nav-item">
                <a
                  className={`nlk-nav-link ${
                    activeId === id ? "nlk-nav-link--active" : ""
                  }`}
                  href={`#${id}`}
                  onClick={(e) => handleNavClick(e, id)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* DASHBOARD */}
        <Link to="/dashboard" className="nlk-dashboard-btn">
          Dashboard
        </Link>
      </div>
    </nav>
  );
}
function Hero() {
  const heroContentRef = useRef(null);
  const typedText = useTypewriter("Justice.\nIntegrity.\nCommitment.", 60, 500);

  useEffect(() => {
    const handleScroll = () => {
      if (heroContentRef.current) {
        let opacity = 1 - window.scrollY / 500;
        if (opacity < 0) opacity = 0;
        heroContentRef.current.style.opacity = opacity;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: "smooth" });
  };

  return (
    <section id="landing-home" className="nlk-hero">
      <div className="nlk-overlay" />
      <div className="nlk-container nlk-hero-content" ref={heroContentRef}>
        <div className="nlk-row nlk-align-center">
          <div className="nlk-col-lg-7" data-aos="fade-right">
            <h5 className="nlk-gold-text">ADVOCATE • ARBITRATOR • NOTARY</h5>
            <h1 className="nlk-hero-heading">
              {typedText.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p className="nlk-hero-desc">
              Professional legal services in Banking Law, SARFAESI, DRT, NCLT,
              Civil, Criminal, Property and Arbitration matters.
            </p>
            <div className="nlk-hero-btns">
              <a
                href="#landing-contact"
                className="nlk-btn nlk-btn-gold"
                onClick={(e) => scrollTo(e, "landing-contact")}
              >
                Book Consultation
              </a>
              <a
                href="#landing-about"
                className="nlk-btn nlk-btn-outline"
                onClick={(e) => scrollTo(e, "landing-about")}
              >
                Know More
              </a>
            </div>
          </div>
          <div className="nlk-col-lg-5 nlk-text-center" data-aos="fade-left">
            <div className="nlk-profile-card">
              <FaScaleBalanced className="nlk-profile-icon" />
              <h3>Adv. Narayan L. Khamkar</h3>
              <p>B.S.L., LL.B.(Spl.)</p>
              <p>Advocate | Arbitrator | Notary</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ target, label }) {
  const [count, ref] = useCounter(target);
  return (
    <div className="nlk-col-md-3" ref={ref}>
      <h2 className="nlk-counter">{count}</h2>
      <p>{label}</p>
    </div>
  );
}

function Stats() {
  return (
    <section className="nlk-stats">
      <div className="nlk-container">
        <div className="nlk-row nlk-text-center">
          {statsData.map((stat, i) => (
            <StatItem key={i} target={stat.target} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const scrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: "smooth" });
  };

  return (
    <section id="landing-about" className="nlk-section" data-aos="fade-up">
      <div className="nlk-container">
        <div className="nlk-row nlk-align-center">
          <div className="nlk-col-lg-5">
            <img
              src="/images/landing/advocate.jpeg"
              className="nlk-about-img"
              alt="Advocate Narayan L. Khamkar"
            />
          </div>
          <div className="nlk-col-lg-7">
            <h2 className="nlk-section-title">About the Advocate</h2>
            <p>
              Adv. Narayan L. Khamkar is an Advocate, Arbitrator and Government
              Notary with extensive experience in Banking Litigation, SARFAESI
              matters, Debt Recovery Tribunal, Civil, Criminal, Property and
              Arbitration.
            </p>
            <div className="nlk-row">
              <div className="nlk-col-md-6">
                <ul className="nlk-about-list">
                  <li>B.S.L.</li>
                  <li>LL.B. (Spl.)</li>
                  <li>C.S. (Executive)</li>
                  <li>Practicing Since 2007</li>
                </ul>
              </div>
              <div className="nlk-col-md-6">
                <ul className="nlk-about-list">
                  <li>Panel Advocate</li>
                  <li>Arbitrator</li>
                  <li>Government Notary</li>
                  <li>Property Expert</li>
                </ul>
              </div>
            </div>
            <a
              href="#landing-contact"
              className="nlk-btn nlk-btn-gold nlk-mt-3"
              onClick={(e) => scrollTo(e, "landing-contact")}
            >
              Schedule Consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const ICON_MAP = {
  FaBuildingColumns,
  FaLandmark,
  FaGavel,
  FaScaleBalanced,
  FaHouse,
  FaFileSignature,
  FaUserShield,
};

function PracticeCard({ icon, title, description }) {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  const IconComp = ICON_MAP[icon];

  return (
    <div
      className="nlk-col-lg-4"
      ref={cardRef}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(50px)",
        transition: "transform 0.8s ease, opacity 0.8s ease",
      }}
    >
      <div className="nlk-service-card">
        <div className="nlk-service-icon">{IconComp && <IconComp />}</div>
        <h4>{title}</h4>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}

function Practice() {
  return (
    <section id="landing-practice" className="nlk-practice">
      <div className="nlk-container">
        <h2 className="nlk-section-title nlk-text-center">Practice Areas</h2>
        <div className="nlk-row">
          {practiceAreas.map((area, i) => (
            <PracticeCard key={i} {...area} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  return (
    <section className="nlk-section nlk-bg-light" data-aos="fade-up">
      <div className="nlk-container">
        <div className="nlk-text-center nlk-mb-5">
          <h2 className="nlk-section-title">Why Choose Us</h2>
          <p>Professional, ethical and result-oriented legal services.</p>
        </div>
        <div className="nlk-row nlk-g-4">
          {whyChooseUsData.map((item, i) => {
            const IconComp = ICON_MAP[item.icon];
            return (
              <div key={i} className="nlk-col-md-3">
                <div className="nlk-service-card">
                  <div className="nlk-service-icon">
                    {IconComp && <IconComp />}
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Clients() {
  return (
    <section id="landing-clients" className="nlk-section" data-aos="fade-up">
      <div className="nlk-container">
        <div className="nlk-text-center nlk-mb-5">
          <h2 className="nlk-section-title">Panel Clients</h2>
        </div>
        <div className="nlk-row nlk-text-center">
          {clientsData.map((client, i) => (
            <div
              key={i}
              className="nlk-col-lg-3 nlk-col-md-4 nlk-col-6 nlk-mb-4"
            >
              <div className="nlk-client-logo">{client}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="nlk-section nlk-bg-light" data-aos="fade-up">
      <div className="nlk-container">
        <div className="nlk-text-center nlk-mb-5">
          <h2 className="nlk-section-title">Client Testimonials</h2>
        </div>
        <div className="nlk-row">
          {testimonialsData.map((item, i) => (
            <div key={i} className="nlk-col-lg-4">
              <div className="nlk-service-card">
                <div className="nlk-stars">
                  {Array.from({ length: item.stars }, (_, j) => (
                    <FaStar key={j} />
                  ))}
                </div>
                <p className="nlk-mt-3">{item.text}</p>
                <strong>{item.author}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [openId, setOpenId] = useState(faqData[0]?.id ?? null);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section id="landing-faq" className="nlk-section" data-aos="fade-up">
      <div className="nlk-container">
        <h2 className="nlk-section-title nlk-text-center nlk-mb-5">
          Frequently Asked Questions
        </h2>
        <div className="nlk-accordion">
          {faqData.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="nlk-accordion-item">
                <h2 className="nlk-accordion-header">
                  <button
                    className={`nlk-accordion-button ${isOpen ? "" : "nlk-accordion-button--collapsed"}`}
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-expanded={isOpen}
                  >
                    {item.question}
                    <span className="nlk-accordion-chevron">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h2>
                <div
                  className={`nlk-accordion-collapse ${isOpen ? "nlk-accordion-collapse--open" : ""}`}
                >
                  <div className="nlk-accordion-body">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      name: formData.name.trim() === "",
      email: formData.email.trim() === "",
      phone: formData.phone.trim() === "",
      message: formData.message.trim() === "",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      alert("Please complete all required fields.");
      return;
    }
    alert("Thank you! Your consultation request has been submitted.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section
      id="landing-contact"
      className="nlk-section nlk-bg-light"
      data-aos="fade-up"
    >
      <div className="nlk-container">
        <div className="nlk-row">
          <div className="nlk-col-lg-6">
            <h2 className="nlk-section-title">Contact Us</h2>
            <p>
              <strong>NLK Law Associates</strong>
            </p>
            <p>
              <FaLocationDot className="nlk-contact-icon" />
              Flat No.3, Gurudatta Apartment, Behind Bhawkar Garage, Regent
              Hotel Lane, Shivajinagar, Pune – 411005
            </p>
            <p>
              <FaPhone className="nlk-contact-icon" /> +91 9922810198
            </p>
            <p>
              <FaEnvelope className="nlk-contact-icon" />{" "}
              narayan.khamkar@gmail.com
            </p>
            <div className="nlk-map-wrapper">
              <iframe
                src="https://maps.google.com/maps?q=Shivajinagar%20Pune&t=&z=15&ie=UTF8&iwloc=&output=embed"
                allowFullScreen
                title="Google Maps Location"
                loading="lazy"
              />
            </div>
          </div>

          <div className="nlk-col-lg-6">
            <div className="nlk-contact-box">
              <form onSubmit={handleSubmit}>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`nlk-form-control ${errors.name ? "nlk-form-error" : ""}`}
                  placeholder="Full Name"
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`nlk-form-control ${errors.email ? "nlk-form-error" : ""}`}
                  placeholder="Email"
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`nlk-form-control ${errors.phone ? "nlk-form-error" : ""}`}
                  placeholder="Phone"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`nlk-form-control ${errors.message ? "nlk-form-error" : ""}`}
                  rows="5"
                  placeholder="Describe your legal matter"
                />
                <button
                  type="submit"
                  className="nlk-btn nlk-btn-gold nlk-w-100"
                >
                  Book Consultation
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="nlk-footer">
      <div className="nlk-container">
        <div className="nlk-row">
          <div className="nlk-col-lg-4">
            <h4>NLK Law Associates</h4>
            <p>Justice • Integrity • Commitment</p>
          </div>
          <div className="nlk-col-lg-4">
            <h4>Practice Areas</h4>
            <ul className="nlk-footer-list">
              <li>Banking Law</li>
              <li>SARFAESI</li>
              <li>DRT</li>
              <li>NCLT</li>
              <li>Property Law</li>
              <li>Arbitration</li>
            </ul>
          </div>
          <div className="nlk-col-lg-4">
            <h4>Follow Us</h4>
            <div className="nlk-social-icons">
              <FaFacebook />
              <FaLinkedin />
              <FaInstagram />
            </div>
          </div>
        </div>
        <div className="nlk-footer-bottom">
          <a
            href="https://calyonix.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Developed and managed by Calyonix Infotech
          </a>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919922810198"
      className="nlk-whatsapp"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
    >
      <FaWhatsapp />
    </a>
  );
}

function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`nlk-scroll-top ${visible ? "nlk-scroll-top--visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <FaAngleUp />
    </button>
  );
}

// ==========================================
// 5. MAIN DEFAULT EXPORT (LandingPage)
// ==========================================

export default function LandingPage() {
  const [disclaimerOpen, setDisclaimerOpen] = useState(true);

  useEffect(() => {
    document.body.style.overflow = disclaimerOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [disclaimerOpen]);

  useEffect(() => {
    // 1. Initialize AOS animation library
    AOS.init({
      duration: 900,
      easing: "ease-in-out",
      once: true,
    });

    // 2. Inject CSS stylesheet dynamically into <head>
    const styleEl = document.createElement("style");
    styleEl.id = "nlk-landing-dynamic-style";
    styleEl.innerHTML = LANDING_CSS;
    document.head.appendChild(styleEl);

    // 3. Clean up style element on unmount
    return () => {
      const el = document.getElementById("nlk-landing-dynamic-style");
      if (el) {
        el.parentNode.removeChild(el);
      }
    };
  }, []);

  return (
    <div className={`nlk-landing-root ${disclaimerOpen ? "nlk-disclaimer-open" : ""}`}>
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Practice />
      <WhyChooseUs />
      <Clients />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
      <WhatsAppButton />
      <ScrollTopButton />

      {disclaimerOpen && (
        <div className="nlk-disclaimer-modal" role="dialog" aria-modal="true" aria-labelledby="nlk-disclaimer-title">
          <div className="nlk-disclaimer-card">
            <h2 id="nlk-disclaimer-title" className="nlk-disclaimer-title">
              Disclaimer
            </h2>

            <p>
              The rules of the Bar Council of India prohibit law firms from
              advertising and soliciting work through communication in the public
              domain. The website is meant solely for the purpose of information
              and not for the purpose of advertising. The user acknowledges the
              following:
            </p>

            <ul>
              <li>
                The information about our Law Firm is provided to the user only
                on his/her request and any information obtained or material
                downloaded from this website is completely at the user's
                volition and any transmission, receipt or use of this site would
                not create any lawyer-client relationship.
              </li>

              <li>
                The material on our website has been prepared and published for
                general information only. There is neither any effort nor any
                intention to solicit new clients or new engagement from existing
                clients by way of this web site.
              </li>

              <li>
                NLK Law Associates a Law Firm has committed to comply with all
                the laws applicable and under no circumstances will NLK Law
                Associates Law Firm undertake any engagement that violates any
                law or conflicts with any ethical, statutory or other
                requirements applicable for performance of professional legal
                services.
              </li>
            </ul>

            <p>
              Even though NLK Law Associates Law Firm makes all efforts to
              ensure that this website is free of viruses but does not guarantee
              the same. NLK Law Associates Law Firm disclaims any liability or
              responsibility it may hold if the site is not free of viruses.
            </p>

            <button
              type="button"
              className="nlk-btn nlk-btn-gold nlk-disclaimer-approve"
              onClick={() => setDisclaimerOpen(false)}
            >
              Approve
            </button>
          </div>
        </div>
      )}
    </div>
  );
}