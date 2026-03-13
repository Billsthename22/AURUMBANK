import { create } from 'zustand';

interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  // --- ADD THESE ---
  idType?: string;   
  idNumber?: string;
  // -----------------
  kycUploaded: boolean;
  kycDocuments?: {    
    passport?: File;
    utility?: File;
  };
  securityMethod: 'biometric' | 'auth_app' | 'none';
}

interface OnboardingStore {
  formData: OnboardingData;
  setFormData: (data: Partial<OnboardingData>) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  formData: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    idType: '',     // Initialize
    idNumber: '',    // Initialize
    kycUploaded: false,
    kycDocuments: {}, 
    securityMethod: 'none',
  },
  setFormData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
        kycDocuments: {
          ...state.formData.kycDocuments,
          ...data.kycDocuments,
        },
      },
    })),
  reset: () =>
    set(() => ({
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        idType: '',
        idNumber: '',
        kycUploaded: false,
        kycDocuments: {}, 
        securityMethod: 'none',
      },
    })),
}));