"use client";

import { useState } from "react";
import RootLayoutWrapper from "../_components/RootLayoutWrapper";
import CookiePolicy from "./_components/CookiePolicy";
import PrivacyPolicy from "./_components/PrivacyPolicy";

type Tabs = "cookie" | "privacy";

export default function page() {
  const [activeTab, setActiveTab] = useState<Tabs>("privacy");

  return (
    <RootLayoutWrapper>
      <div className="px-5 sm:px-10 py-20">
        <div className="container max-w-2xl  mx-auto">
          <h1 className="text-3xl font-bold mb-10 text-center">
            Dev Trainer Policies
          </h1>
          <ul className="flex flex-wrap text-sm font-medium text-center border-b border-neutral-400">
            <li className="me-2">
              <button
                onClick={() => setActiveTab("cookie")}
                className={`inline-block p-4 text-primary-content rounded-t-lg transition-colors ${
                  activeTab === "cookie" ? "bg-neutral-500" : "bg-base-100"
                }`}>
                Cookies
              </button>
            </li>
            <li className="me-2">
              <button
                onClick={() => setActiveTab("privacy")}
                aria-current="page"
                className={`inline-block p-4 text-primary-content rounded-t-lg transition-colors ${
                  activeTab === "privacy" ? "bg-neutral-500" : "bg-base-100"
                }`}>
                Privacy Policy
              </button>
            </li>
          </ul>
          {activeTab === "cookie" && <CookiePolicy />}
          {activeTab === "privacy" && <PrivacyPolicy />}
        </div>
      </div>
    </RootLayoutWrapper>
  );
}
