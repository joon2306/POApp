export default interface FeedbackFormProps {
    onSubmit: (data: FeedbackFormType) => void;
    previousFeedback?: string;
  }


export interface FeedbackFormType {
    feedback: string;
    isApproved: boolean;
}