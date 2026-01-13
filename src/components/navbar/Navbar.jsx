"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import Image from "next/image";
import { useAuthUser } from "@/context/AuthUserContext";
import { useRouter, usePathname } from "next/navigation";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { toast } from "react-hot-toast";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";

const STATE_MACHINE_NAME = "Basic State Machine";
const INPUT_NAME = "Switch";
const cn = (...classes) => classes.filter(Boolean).join(" ");

// --- Configuration for easy management ---
const NAV_ITEMS = [
  { label: "Events", href: "/events" },
  { label: "Multicity", href: "/multicity" },
  { label: "Gallery", href: "/gallery" },
  { label: "Team", href: "/team" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Campus Ambassador", href: "/campus-ambassador" },
  { label: "Store", href: "/store" },
];

// Style for disabled links
const disabledLinkStyle = {
  pointerEvents: "none",
  opacity: 0.5,
  cursor: "not-allowed",
};

function Navigation() {
  const { currentUser, logoutUser } = useAuthUser();
  const router = useRouter();
  const pathname = usePathname();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const refNav = useRef(null);

  const { rive, RiveComponent } = useRive({
    src: "/navbar/hamburger-time.riv",
    autoplay: true,
    stateMachines: STATE_MACHINE_NAME,
  });

  const toggleInput = useStateMachineInput(rive, STATE_MACHINE_NAME, INPUT_NAME);

  useEffect(() => {
    if (!showDropdown) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [showDropdown]);

  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e) => {
      if (refNav.current && !refNav.current.contains(e.target)) {
        closeDrawer();
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [drawerOpen]);

  useEffect(() => closeDrawer(), [pathname]);

  const toggleDrawer = () => {
    const drawer = document.getElementById("drawer");
    const nav = document.getElementById("nav_div");
    if (!drawer || !nav) return;

    if (!drawerOpen) {
      drawer.style.display = "block";
      nav.style.backgroundColor = "#000";
      setTimeout(() => (drawer.style.opacity = 1), 50);
    } else closeDrawer();

    setDrawerOpen(!drawerOpen);
    toggleInput?.fire();
  };

  const closeDrawer = () => {
    const drawer = document.getElementById("drawer");
    const nav = document.getElementById("nav_div");
    if (!drawer) return;

    drawer.style.opacity = 0;
    setTimeout(() => {
      drawer.style.display = "none";
      if (nav) nav.style.backgroundColor = "";
    }, 200);

    setDrawerOpen(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    setShowDropdown(false);
    closeDrawer();
    toast.success("Logged out!");
  };

  return (
    <>
      <div id="nav_div" className={styles.mainNav} ref={refNav}>
        {/* Hamburger */}
        <div className={styles.hamburger}>
          <RiveComponent onClick={toggleDrawer} />
        </div>

        {/* Logo */}
        <Link href="/" className={styles.navLogo}>
          <Image src="/navbar/logo_no_bg.svg" alt="logo" width={108} height={45} />
        </Link>

        {/* Desktop Links (DISABLED) */}
        <div className={styles.navLinks}>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link 
                  className={styles.linknav} 
                  href={item.href} 
                  style={disabledLinkStyle}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Right */}
        <div className={cn(styles.navEnds, "mr-14", "gap-2")}>
          <button
            disabled
            className={cn(styles.sexy_button, styles.sexy_button_small)}
            style={{ opacity: 0.5, cursor: "not-allowed" }}
          >
            GET PASSES
          </button>

          {!currentUser && (
            <button
              disabled
              className={cn(styles.sexy_button, styles.sexy_button_small)}
              style={{ opacity: 0.5, cursor: "not-allowed" }}
            >
              LOGIN
            </button>
          )}

          {currentUser && (
            <div className="relative flex items-center gap-2 " ref={dropdownRef}>
              <FaShoppingCart
                size={28}
                color="gray"
                style={{ cursor: "not-allowed", marginRight: "12px", opacity: 0.5 }}
              />

              <FaUserCircle
                size={28}
                color="white"
                style={{ cursor: "pointer" }}
                onClick={() => setShowDropdown(prev => !prev)}
              />

              {showDropdown && (
                <ul className="absolute right-0 top-full mt-3 w-56 rounded-2xl bg-black shadow-lg text-white">
                  <li>
                    <button
                      className="w-full px-4 py-2 text-left bg-gray-800 hover:bg-gray-600 rounded-xl"
                      onClick={() => {
                        setShowDropdown(false);
                        router.push("/profile");
                      }}
                    >
                      Profile
                    </button>
                  </li>
                  {/* ... other dropdown items stay enabled so user can still logout/see profile ... */}
                  <li className="mt-3">
                    <button
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Drawer (DISABLED) */}
      <div id="drawer" className={styles.nav_drawer}>
        <ul>
          <li><Link href="/" onClick={toggleDrawer}>Home</Link></li>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                style={disabledLinkStyle}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/anweshapass" style={disabledLinkStyle}>Get Passes</Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Navigation;