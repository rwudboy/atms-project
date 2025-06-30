"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AppSidebar } from "@/interface-adapters/components/sidebar/app-sidebar";
import { SiteHeader } from "@/interface-adapters/components/header/site-header";
import { SidebarInset, SidebarProvider } from "@/interface-adapters/components/ui/sidebar";
import { Footer } from "@/interface-adapters/components/footer/footer";
import { Toaster } from "sonner";
import { AuthProvider } from "@/interface-adapters/context/AuthContext";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const pageSlug = pathname.split("/").filter(Boolean)[0] || "home";
  const excludedRoutes = ["/otp", "/login", "/register","/forgotPassword"];
  const isExcludedRoute = excludedRoutes.includes(pathname);
  
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [explosion, setExplosion] = useState(false);
  const [blueScreen, setBlueScreen] = useState(false);
  const [destroyed, setDestroyed] = useState(false);
  const [permanentRainbow, setPermanentRainbow] = useState(false);
  const [sirenAudio, setSirenAudio] = useState(null);

  const formattedTitle = pageSlug
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Warning and explosion sequence
  useEffect(() => {
    if (!isExcludedRoute) {
      // Show warning after 3 seconds
      const warningTimer = setTimeout(() => {
        setShowWarning(true);
        
        // Start countdown after 2 seconds of warning
        setTimeout(() => {
          let count = 3;
          setCountdown(count);
          
          const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
              setCountdown(count);
            } else {
              clearInterval(countdownInterval);
              setExplosion(true);
              
              // Show blue screen after explosion
              setTimeout(() => {
                setBlueScreen(true);
                setShowWarning(false);
                setCountdown(null);
                setExplosion(false);
                
                // Show destroyed page with permanent rainbow
                setTimeout(() => {
                  setDestroyed(true);
                  setPermanentRainbow(true);
                  setBlueScreen(false);
                  
                  // Keep rainbow forever - no reset
                }, 3000);
              }, 2000);
            }
          }, 1000);
        }, 2000);
      }, 3000);

      return () => {
        clearTimeout(warningTimer);
        if (sirenAudio) {
          sirenAudio.pause();
          sirenAudio.currentTime = 0;
        }
      };
    }
  }, [isExcludedRoute, pathname, sirenAudio]);

  // Sound effects
  useEffect(() => {
    if (showWarning && !sirenAudio) {
      // Civil defense siren from Pixabay - continuous until end
      const warningAudio = new Audio('https://cdn.pixabay.com/download/audio/2024/09/16/audio_5464b60e9b.mp3?filename=air-raid-siren-sound-effect-241383.mp3');
      warningAudio.volume = 0.7;
      warningAudio.loop = true;
      warningAudio.play().catch(() => {});
      setSirenAudio(warningAudio);
    }
    
    if (countdown !== null) {
      // Countdown beep sound
      const beepAudio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/24/audio_516e7b9b04.mp3?filename=countdown-from-10-105775.mp3');
      beepAudio.volume = 0.8;
      beepAudio.play().catch(() => {});
    }
    
    if (explosion) {
      // Explosion sound effect
      const explosionAudio = new Audio('https://cdn.pixabay.com/download/audio/2023/09/19/audio_f304554a28.mp3?filename=smile-dog-jumpscare-167171.mp3');
      explosionAudio.volume = 0.9;
      explosionAudio.play().catch(() => {});
    }
    
    if (blueScreen) {
      // Blue screen error sound
      const errorAudio = new Audio('https://cdn.pixabay.com/download/audio/2023/10/10/audio_3e4f4231e9.mp3?filename=error-170796.mp3');
      errorAudio.volume = 0.6;
      errorAudio.play().catch(() => {});
      
    }
  }, [showWarning, countdown, explosion, blueScreen, sirenAudio]);

  return (
    <html lang="en">
      <head>
        <title>{formattedTitle}</title>
        <style>{`
          @keyframes aggressive-rotate {
            0% { transform: rotate(0deg) translateX(0px) translateY(0px) scale(1); }
            10% { transform: rotate(36deg) translateX(20px) translateY(-15px) scale(1.05); }
            20% { transform: rotate(72deg) translateX(-10px) translateY(25px) scale(0.95); }
            30% { transform: rotate(108deg) translateX(30px) translateY(10px) scale(1.1); }
            40% { transform: rotate(144deg) translateX(-25px) translateY(-20px) scale(0.9); }
            50% { transform: rotate(180deg) translateX(15px) translateY(30px) scale(1.02); }
            60% { transform: rotate(216deg) translateX(-20px) translateY(-10px) scale(1.08); }
            70% { transform: rotate(252deg) translateX(25px) translateY(-25px) scale(0.92); }
            80% { transform: rotate(288deg) translateX(-15px) translateY(20px) scale(1.06); }
            90% { transform: rotate(324deg) translateX(10px) translateY(-30px) scale(0.98); }
            100% { transform: rotate(360deg) translateX(0px) translateY(0px) scale(1); }
          }

          @keyframes shake-and-spin {
            0% { transform: rotate(0deg) translateX(0px) translateY(0px); }
            5% { transform: rotate(18deg) translateX(-5px) translateY(8px); }
            10% { transform: rotate(36deg) translateX(12px) translateY(-3px); }
            15% { transform: rotate(54deg) translateX(-8px) translateY(-10px); }
            20% { transform: rotate(72deg) translateX(15px) translateY(6px); }
            25% { transform: rotate(90deg) translateX(-12px) translateY(-8px); }
            30% { transform: rotate(108deg) translateX(8px) translateY(12px); }
            35% { transform: rotate(126deg) translateX(-15px) translateY(-5px); }
            40% { transform: rotate(144deg) translateX(10px) translateY(-12px); }
            45% { transform: rotate(162deg) translateX(-6px) translateY(15px); }
            50% { transform: rotate(180deg) translateX(12px) translateY(-8px); }
            55% { transform: rotate(198deg) translateX(-10px) translateY(5px); }
            60% { transform: rotate(216deg) translateX(8px) translateY(-15px); }
            65% { transform: rotate(234deg) translateX(-15px) translateY(10px); }
            70% { transform: rotate(252deg) translateX(12px) translateY(-6px); }
            75% { transform: rotate(270deg) translateX(-8px) translateY(12px); }
            80% { transform: rotate(288deg) translateX(15px) translateY(-10px); }
            85% { transform: rotate(306deg) translateX(-12px) translateY(8px); }
            90% { transform: rotate(324deg) translateX(6px) translateY(-15px); }
            95% { transform: rotate(342deg) translateX(-10px) translateY(12px); }
            100% { transform: rotate(360deg) translateX(0px) translateY(0px); }
          }

          @keyframes crazy-movement {
            0% { transform: rotate(0deg) translateX(0px) translateY(0px) skewX(0deg) skewY(0deg); }
            8% { transform: rotate(45deg) translateX(30px) translateY(-20px) skewX(5deg) skewY(-3deg); }
            16% { transform: rotate(90deg) translateX(-15px) translateY(40px) skewX(-8deg) skewY(6deg); }
            24% { transform: rotate(135deg) translateX(25px) translateY(10px) skewX(3deg) skewY(-9deg); }
            32% { transform: rotate(180deg) translateX(-35px) translateY(-30px) skewX(-6deg) skewY(4deg); }
            40% { transform: rotate(225deg) translateX(20px) translateY(35px) skewX(9deg) skewY(-2deg); }
            48% { transform: rotate(270deg) translateX(-10px) translateY(-25px) skewX(-4deg) skewY(8deg); }
            56% { transform: rotate(315deg) translateX(40px) translateY(15px) skewX(7deg) skewY(-5deg); }
            64% { transform: rotate(360deg) translateX(-20px) translateY(-40px) skewX(-9deg) skewY(3deg); }
            72% { transform: rotate(405deg) translateX(15px) translateY(25px) skewX(2deg) skewY(-7deg); }
            80% { transform: rotate(450deg) translateX(-30px) translateY(-10px) skewX(-5deg) skewY(9deg); }
            88% { transform: rotate(495deg) translateX(35px) translateY(-35px) skewX(8deg) skewY(-1deg); }
            96% { transform: rotate(540deg) translateX(-25px) translateY(30px) skewX(-3deg) skewY(6deg); }
            100% { transform: rotate(720deg) translateX(0px) translateY(0px) skewX(0deg) skewY(0deg); }
          }

          @keyframes rainbow-cycle {
            0% { 
              filter: hue-rotate(0deg) saturate(2) brightness(1.2);
              background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
            }
            14% { 
              filter: hue-rotate(51deg) saturate(2.2) brightness(1.3);
              background: linear-gradient(45deg, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000);
            }
            28% { 
              filter: hue-rotate(102deg) saturate(2.4) brightness(1.1);
              background: linear-gradient(45deg, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000, #ff7f00);
            }
            42% { 
              filter: hue-rotate(153deg) saturate(2.6) brightness(1.4);
              background: linear-gradient(45deg, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000, #ff7f00, #ffff00);
            }
            56% { 
              filter: hue-rotate(204deg) saturate(2.8) brightness(1.2);
              background: linear-gradient(45deg, #0000ff, #4b0082, #9400d3, #ff0000, #ff7f00, #ffff00, #00ff00);
            }
            70% { 
              filter: hue-rotate(255deg) saturate(3) brightness(1.5);
              background: linear-gradient(45deg, #4b0082, #9400d3, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff);
            }
            84% { 
              filter: hue-rotate(306deg) saturate(2.5) brightness(1.3);
              background: linear-gradient(45deg, #9400d3, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082);
            }
            100% { 
              filter: hue-rotate(360deg) saturate(2) brightness(1.2);
              background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
            }
          }

          @keyframes warning-flash {
            0%, 100% { background-color: transparent; }
            50% { background-color: rgba(255, 0, 0, 0.4); }
          }

          @keyframes jumpscare-appear {
            0% { 
              opacity: 0;
              transform: scale(0.1) rotate(0deg);
            }
            10% { 
              opacity: 1;
              transform: scale(1.8) rotate(45deg);
            }
            100% { 
              opacity: 1;
              transform: scale(1) rotate(360deg);
            }
          }

          @keyframes explosion-rotate {
            0% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(90deg) scale(1.2); }
            50% { transform: rotate(180deg) scale(0.8); }
            75% { transform: rotate(270deg) scale(1.1); }
            100% { transform: rotate(360deg) scale(1); }
          }

          @keyframes permanent-rainbow-rotate {
            0% { transform: rotate(0deg) scale(1.2); }
            25% { transform: rotate(90deg) scale(1.5); }
            50% { transform: rotate(180deg) scale(1.3); }
            75% { transform: rotate(270deg) scale(1.4); }
            100% { transform: rotate(360deg) scale(1.2); }
          }

          @keyframes blue-screen-jumpscare-rotate {
            0% { transform: rotate(0deg) scale(1.5); }
            25% { transform: rotate(90deg) scale(1.8); }
            50% { transform: rotate(180deg) scale(1.2); }
            75% { transform: rotate(270deg) scale(1.6); }
            100% { transform: rotate(360deg) scale(1.5); }
          }

          @keyframes blue-screen-glitch {
            0%, 100% { background-color: #0078d4; }
            25% { background-color: #005a9e; }
            50% { background-color: #106ebe; }
            75% { background-color: #2b88d8; }
          }

          .rotate-aggressive {
            animation: 
              aggressive-rotate 0.8s ease-in-out infinite,
              shake-and-spin 0.4s linear infinite,
              crazy-movement 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
            transform-origin: center center;
          }

          .rainbow-permanent {
            animation: 
              rainbow-cycle 2s linear infinite,
              aggressive-rotate 0.8s ease-in-out infinite,
              shake-and-spin 0.4s linear infinite,
              crazy-movement 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
            transform-origin: center center;
          }

          .warning-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            pointer-events: none;
            animation: warning-flash 0.3s ease-in-out infinite;
          }

          .explosion-jumpscare {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 15000;
            pointer-events: none;
            background-image: url('https://2007.filemail.com/getthumbnail.ashx?fileid=OBWHO3DBNN3XI3TBNBZXG3LWPR6HYV3IMF2HGQLQOAQES3LBM5SSAMRQGI2S2MBXFUYDCIDBOQQDAMROGA3C4NBZL4YWKNRYMIYWEOJONJYGO&size=Large');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            animation: 
              jumpscare-appear 0.5s ease-out,
              explosion-rotate 1s linear infinite;
          }

          .blue-screen-jumpscare {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80vw;
            height: 80vh;
            z-index: 15001;
            pointer-events: none;
            background-image: url('https://2007.filemail.com/getthumbnail.ashx?fileid=OBWHO3DBNN3XI3TBNBZXG3LWPR6HYV3IMF2HGQLQOAQES3LBM5SSAMRQGI2S2MBXFUYDCIDBOQQDAMROGA3C4NBZL4YWKNRYMIYWEOJONJYGO&size=Large');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 20px;
            box-shadow: 0 0 50px rgba(255, 0, 0, 0.8);
            animation: 
              jumpscare-appear 0.3s ease-out,
              blue-screen-jumpscare-rotate 1.5s linear infinite;
          }

          .permanent-rainbow-jumpscare {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60vw;
            height: 60vh;
            z-index: 15002;
            pointer-events: none;
            background-image: url('https://2007.filemail.com/getthumbnail.ashx?fileid=OBWHO3DBNN3XI3TBNBZXG3LWPR6HYV3IMF2HGQLQOAQES3LBM5SSAMRQGI2S2MBXFUYDCIDBOQQDAMROGA3C4NBZL4YWKNRYMIYWEOJONJYGO&size=Large');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 30px;
            box-shadow: 0 0 100px rgba(255, 255, 255, 0.9);
            animation: 
              permanent-rainbow-rotate 2s linear infinite;
          }

          .blue-screen-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            pointer-events: none;
            animation: blue-screen-glitch 0.5s ease-in-out infinite;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Courier New', monospace;
            color: white;
            font-size: 2rem;
            text-align: center;
            padding: 2rem;
          }

          .warning-text {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10001;
            color: red;
            font-size: 4rem;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            animation: warning-flash 0.3s ease-in-out infinite;
            text-align: center;
          }

          .countdown-text {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10001;
            color: red;
            font-size: 8rem;
            font-weight: bold;
            text-shadow: 4px 4px 8px rgba(0,0,0,0.8);
            text-align: center;
          }

          body {
            overflow: hidden;
          }
        `}</style>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {isExcludedRoute ? (
          <>
            {children}
            <Toaster />
          </>
        ) : (
          <AuthProvider>
            <div className={`${permanentRainbow ? 'rainbow-permanent' : 'rotate-aggressive'}`}>
              <SidebarProvider
                style={{
                  "--sidebar-width": "calc(var(--spacing) * 72)",
                  "--header-height": "calc(var(--spacing) * 12)",
                }}
              >
                <AppSidebar variant="inset" />
                <SidebarInset>
                  <SiteHeader />
                  <div className="flex flex-col min-h-screen">
                    <main className="flex-grow p-6">{children}</main>
                    <Footer />
                  </div>
                  <Toaster richColors />
                </SidebarInset>
              </SidebarProvider>
            </div>

            {/* Warning Overlay */}
            {showWarning && !countdown && !explosion && (
              <>
                <div className="warning-overlay" />
                <div className="warning-text">
                  ⚠️ WARNING! SYSTEM OVERLOAD! ⚠️<br />
                  🚨 TUNING TUNING TUNING 🚨<br />
                  💥 CRITICAL ERROR DETECTED 💥
                </div>
              </>
            )}

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="countdown-text">
                💥 PROJECT WILL EXPLODE IN<br />{countdown} 💥
              </div>
            )}

            {/* Explosion Jumpscare */}
            {explosion && (
              <div className="explosion-jumpscare" />
            )}

            {/* Blue Screen Overlay */}
            {blueScreen && (
              <>
                <div className="blue-screen-overlay">
                  <div>
                    <h1>💀 SYSTEM CRASHED 💀</h1>
                    <p>A problem has been detected and the system has been shut down to prevent damage.</p>
                    <p>CRITICAL_PROCESS_DIED</p>
                    <p>*** STOP: 0x000000EF (0x00000000, 0x00000000, 0x00000000, 0x00000000)</p>
                    <br />
                    <p>The system is attempting to recover...</p>
                    <p>💥 DUAR! PAGE DESTROYED! 💥</p>
                  </div>
                </div>
                {/* Blue Screen Jumpscare Image */}
                <div className="blue-screen-jumpscare" />
              </>
            )}

            {/* Permanent Rainbow with Jumpscare Image */}
            {permanentRainbow && (
              <div className="permanent-rainbow-jumpscare" />
            )}
          </AuthProvider>
        )}
      </body>
    </html>
  );
}