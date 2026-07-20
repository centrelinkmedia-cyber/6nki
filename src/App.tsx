import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StudioProvider } from './context/StudioContext';
import { EconomyProvider } from './context/EconomyContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SacredOverlay } from './components/layout/SacredOverlay';

import { HomeView } from './components/views/HomeView';
import { CreatorNetworkView } from './components/views/CreatorNetworkView';
import { StudiosView } from './components/views/StudiosView';
import { AscensionView } from './components/views/AscensionView';
import { MarketplaceView } from './components/views/MarketplaceView';
import { TreasuryEconomyView } from './components/views/TreasuryEconomyView';
import { CodexView } from './components/views/CodexView';

import { AuthModal } from './components/modals/AuthModal';
import { CreateStudioModal } from './components/modals/CreateStudioModal';
import { SupabaseConfigModal } from './components/modals/SupabaseConfigModal';
import { ProfileModal } from './components/modals/ProfileModal';
import type { UserProfile } from './types';

export const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [showSacredGrid, setShowSacredGrid] = useState<boolean>(false);

  // Modal states
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showCreateStudioModal, setShowCreateStudioModal] = useState<boolean>(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState<boolean>(false);
  const [inspectedProfile, setInspectedProfile] = useState<{ profile: UserProfile; mode: 'view' | 'collaborate' } | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#f8fafc] flex flex-col justify-between selection:bg-sky-500 selection:text-black relative">
      
      {/* Sacred Geometry Toggleable Grid Overlay */}
      <SacredOverlay show={showSacredGrid} />

      {/* Main Navigation Hub */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenSupabaseModal={() => setShowSupabaseModal(true)}
        onOpenCodex={() => setCurrentTab('codex')}
        showSacredGrid={showSacredGrid}
        setShowSacredGrid={setShowSacredGrid}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full relative z-10">
        {currentTab === 'home' && (
          <HomeView
            setCurrentTab={setCurrentTab}
            onOpenCodex={() => setCurrentTab('codex')}
            onOpenSupabaseModal={() => setShowSupabaseModal(true)}
          />
        )}

        {currentTab === 'network' && (
          <CreatorNetworkView
            onInspectProfile={(profile) => setInspectedProfile({ profile, mode: 'view' })}
            onInviteCollaboration={(profile) => setInspectedProfile({ profile, mode: 'collaborate' })}
          />
        )}

        {currentTab === 'studios' && (
          <StudiosView onOpenCreateModal={() => setShowCreateStudioModal(true)} />
        )}

        {currentTab === 'ascension' && <AscensionView />}

        {currentTab === 'nexus' && <MarketplaceView />}

        {currentTab === 'treasury' && <TreasuryEconomyView />}

        {currentTab === 'codex' && (
          <CodexView
            onBackToHome={() => setCurrentTab('home')}
            showSacredGrid={showSacredGrid}
            setShowSacredGrid={setShowSacredGrid}
          />
        )}
      </main>

      {/* System Footer */}
      <Footer
        onOpenCodex={() => setCurrentTab('codex')}
        onOpenSupabaseModal={() => setShowSupabaseModal(true)}
        setCurrentTab={setCurrentTab}
      />

      {/* Modals */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showCreateStudioModal && <CreateStudioModal onClose={() => setShowCreateStudioModal(false)} />}
      {showSupabaseModal && <SupabaseConfigModal onClose={() => setShowSupabaseModal(false)} />}
      {inspectedProfile && (
        <ProfileModal
          profile={inspectedProfile.profile}
          initialMode={inspectedProfile.mode}
          onClose={() => setInspectedProfile(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StudioProvider>
        <EconomyProvider>
          <AppContent />
        </EconomyProvider>
      </StudioProvider>
    </AuthProvider>
  );
}
