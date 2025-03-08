export interface ExtendedFormData {
  purpose: string;
  description: string;
  users: string;
  examples: string;
  validation: string;
  technicalDetails: string;
  context: string;
}

export interface FeatureInputProps {
  onSubmit: (formData: FeatureInputType) => void;
}

export default interface FeatureInputType {
  description: string;
  context: string;
}